export const getRoomByName = (rooms, id) => {
    return rooms.find((room) => room.roomName == id);
};

export const getPlayerById = (players, id) => {
    return players.find((player) => player.id == id);
};

export const parseChoices = (currentQuestion) => {
    let choices = [];
    choices.push(currentQuestion.correct_answer);
    choices = choices.concat(currentQuestion.incorrect_answers);
    return choices;
};
