import { useContext } from 'react'
import { SocketContext } from '../../context/socket'
import { useGameStateStore } from '../../hooks/gameState'

const GameFinished = () => {
  const socket = useContext(SocketContext)
  const updateGameState = useGameStateStore(state => state.updateGameState)
  const state = useGameStateStore(state => state.current)

  const compareFn = (playerA, playerB) => {
    if (playerA.score > playerB.score) {
      return -1
    } else if (playerA.score < playerB.score) {
      return 1
    }
    return 0
  }

  let winningPlayer = state.players[0]
  state.players.forEach(player => {
    if (player.score > winningPlayer.score) {
      winningPlayer = player
    }
  })

  const handlePlayAgain = () => {
    socket.disconnect()
    updateGameState({
      timer: 0,
      choices: [],
      hasAnswered: false,
      isRevealingAnswer: false,
      isHost: false,
      isStarted: false,
      isFinished: false,
      isLastQuestion: false,
      players: [],
      question: '',
      roomName: '',
      score: 0,
      username: ''
    })
  }

  let count = 1

  return (
    <div className="w-full h-full rounded-xl rounded-md mx-8 shadow-xl flex flex-col justify-center items-center gap-4">
      <header className="shadow-xl text-3xl md:text-5xl w-full bg-purple-500 p-4 rounded-xl flex items-center flex-col justify-center">
        <p className="text-lg font-semibold text-white">The winner is...</p>
        <h1 className="text-white font-bold">{winningPlayer.username}</h1>
        <p className="text-lg md:text-3xl text-white font-semibold">
          with a total of <strong>{winningPlayer.score} POINTS!</strong>
        </p>
      </header>
      <h2 className="text-3xl text-center font-bold">Scoreboard</h2>
      <main className="w-full max-w-[75%] max-h-64">
        <ul className=" max-h-48 overflow-auto text-center overflow-auto border-2 border-solid border-grey-300 shadow-xl p-4 rounded-xl">
          {state.players.sort(compareFn).map(player => (
            <li
              className="font-semibold border-b border-purple-500 py-0.5 flex justify-between"
              key={player.id}
            >
              <p>
                {count++}. {player.username}
              </p>
              <p>{player.score}</p>
            </li>
          ))}
        </ul>
      </main>
      <button
        onClick={handlePlayAgain}
        className="hover:bg-purple-400 hover:border-purple-400 transition-colors p-2 border-2 border-solid border-purple-500 bg-purple-500 text-white font-semibold rounded-full px-8"
      >
        Play Again
      </button>
    </div>
  )
}

export default GameFinished
