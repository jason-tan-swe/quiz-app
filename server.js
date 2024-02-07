import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import ShortUniqueId from "short-unique-id";
import axios from "axios";
import { getPlayerById, getRoomByName, parseChoices } from "./utils/rooms.js";

const CLIENT_PORT = process.env.CLIENT_PORT || 5173;
const PORT = process.env.PORT || 3000;

const app = express();

let rooms = [];

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: `http://localhost:${CLIENT_PORT}`,
    },
});

io.on("connection", (socket) => {
    // console.log(`user with id: ${socket.id}`);

    /**
     * GAME RELATED HANDLERS
     */
    socket.on("game:start", async (payload) => {
        // populate the questions
        const currentRoom = getRoomByName(rooms, socket.data.roomName);
        if (currentRoom == undefined) {
            return;
        }

        const quizRes = await axios.get(
            "https://opentdb.com/api.php?amount=5&category=31"
        );
        const questions = quizRes.data?.results;
        const currentQuestion = questions[currentRoom.currentQuestion];
        currentRoom.questions = questions;

        currentRoom.timer = 30;

        let choices = parseChoices(currentQuestion);

        io.to(currentRoom.roomName).emit("game:start", {
            answer: currentQuestion.correct_answer,
            choices,
            question: currentQuestion.question,
            timer: currentRoom.timer,
        });
        // console.log(quizRes, questions);
    });

    socket.on("game:timer", () => {
        const lobbyTimer = setInterval(() => {
            const currentRoom = getRoomByName(rooms, socket.data.roomName);

            if (currentRoom == null || currentRoom == undefined) {
                return clearInterval(lobbyTimer);
            }

            currentRoom.timer -= 1;
            io.to(socket.data.roomName).emit("game:timer", {
                timer: currentRoom.timer,
            });

            if (
                currentRoom.timer === 0 ||
                currentRoom.playersAnswered === currentRoom.players.length
            ) {
                // asses score and answers
                clearInterval(lobbyTimer);
                currentRoom.timer = 0;
                io.to(currentRoom.roomName).emit("game:timer-finished", {
                    timer: currentRoom.timer,
                });
                currentRoom.players.forEach((player) => {
                    const myPlayer = getPlayerById(
                        currentRoom.players,
                        player.id
                    );
                    io.to(player.id).emit("game:score-update", {
                        score: myPlayer.score,
                        players: currentRoom.players,
                    });
                });
            }
        }, 1000);
    });

    socket.on("game:player-answered", (payload) => {
        const { answer } = payload;
        const currentRoom = getRoomByName(rooms, socket.data.roomName);

        if (currentRoom == null || currentRoom == undefined) {
            return;
        }

        const myPlayer = getPlayerById(currentRoom.players, socket.id);

        if (
            answer ==
            currentRoom.questions[currentRoom.currentQuestion].correct_answer
        ) {
            myPlayer.score += 1;
        } else if (myPlayer.score > 0) {
            myPlayer.score -= 1;
        }
        currentRoom.playersAnswered += 1;
        // console.log(currentRoom);
    });

    socket.on("game:next-question", () => {
        // reset the timer, increment the current question index
        // reset playersAnswered and initiate timer again
        const currentRoom = getRoomByName(rooms, socket.data.roomName);
        if (currentRoom == undefined) {
            return;
        }

        currentRoom.timer = 30;
        currentRoom.currentQuestion += 1;
        currentRoom.playersAnswered = 0;

        if (currentRoom.currentQuestion == currentRoom.questions.length) {
            currentRoom.isFinished = true;
            io.to(currentRoom.roomName).emit("game:end", {
                isFinished: currentRoom.isFinished,
            });
            return;
        }

        const currentQuestion =
            currentRoom.questions[currentRoom.currentQuestion];
        const choices = parseChoices(currentQuestion);
        io.to(currentRoom.roomName).emit("game:next-question", {
            answer: currentQuestion.correct_answer,
            choices,
            question: currentQuestion.question,
            timer: currentRoom.timer,
            isLastQuestion:
                currentRoom.currentQuestion + 1 == currentRoom.questions.length
                    ? true
                    : false,
        });
    });

    /**
     * ROOM RELATED HANDLERS
     */
    socket.on("room:create", (payload) => {
        const { username } = payload;
        const roomName = new ShortUniqueId({ length: 6 }).rnd();
        const players = [
            {
                username,
                id: socket.id,
                score: 0,
            },
        ];
        // console.log({ roomName });
        rooms.push({
            host: socket.id,
            players,
            roomName,
            timer: 0,
            questions: [],
            currentQuestion: 0,
            playersAnswered: 0,
            isFinished: false,
        });
        // attach to socket object for later
        socket.data.username = username;
        socket.data.roomName = roomName;
        io.to(socket.id).emit("user:IsHost", {
            id: socket.id,
            isHost: true,
            roomName,
            players,
        });
        socket.join(roomName);
    });
    socket.on("room:join", (payload) => {
        const { username, roomName } = payload;
        const hasDuplicateRooms = Boolean(
            rooms.filter((room) => room.roomName == roomName).length
        );

        // does not exist
        if (!hasDuplicateRooms) {
            return io.to(socket.id).emit("room:join-error", {
                message: `The room with code "${roomName}" does not exist!`,
            });
        }

        // attach to socket object for later
        socket.data.username = username;
        socket.data.roomName = roomName;

        // join room
        const roomToJoin = rooms.find((room) => room.roomName == roomName);
        roomToJoin.players.push({ username, id: socket.id, score: 0 });
        socket.join(roomToJoin.roomName);

        io.to(roomToJoin.roomName).emit("room:join", {
            players: roomToJoin.players,
            roomName,
        });
    });
    socket.on("disconnecting", () => {
        if (socket.rooms.length == 1) {
            return;
        }

        const roomToLeave = rooms.find(
            (room) => room.roomName == socket.data.roomName
        );

        if (!roomToLeave) {
            return;
        }

        // console.log(rooms, roomToLeave, socket.data.roomName);
        roomToLeave.players = roomToLeave.players?.filter(
            (player) => player.id !== socket.id
        );

        io.to(socket.data.roomName).emit("room:leave", {
            players: roomToLeave.players,
        });
    });
});

server.listen(PORT, () => {
    console.log(`server running at localhost:${CLIENT_PORT}`);
});
