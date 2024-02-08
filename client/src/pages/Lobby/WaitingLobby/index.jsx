import { useContext } from 'react'
import { SocketContext } from '../../../context/socket'
import { useGameStateStore } from '../../../hooks/gameState'
import Player from './Player'
import { ClipboardIcon } from '@heroicons/react/24/outline'

const WaitingLobby = () => {
  const socket = useContext(SocketContext)
  const state = useGameStateStore(state => state.current)

  const handleStartGame = e => {
    socket.emit('game:start')
    socket.emit('game:timer')
  }

  const handleRoomNameCopy = e => {
    navigator.clipboard.writeText(state.roomName)
    alert(`You successfully copied the room code '${state.roomName}'`)
  }

  return (
    <main className="md:text-2xl flex flex-col justify-center items-center gap-4 h-full w-full max-w-[80%]">
      <header className="text-center font-semibold text-xl md:text-3xl">
        You ARE{' '}
        <p className="text-3xl md:text-8xl underline font-bold text-purple-600 text-center">
          {state.username}
        </p>
      </header>
      <div className="md:text-3xl shadow-xl border-2 border-solid border-grey-300 rounded-2xl flex flex-wrap md:flex-col max-h-40 justify-center items-center w-full overflow-auto grow gap-2">
        {state.players?.map(player => (
          <Player key={player.id} username={player.username} />
        ))}
      </div>
      {state.isHost ? (
        <button
          onClick={handleStartGame}
          className="text-xl transition-colors hover:border-purple-400 hover:bg-purple-400 text-white border-2 border-solid border-purple-500 shadow-md font-semibold rounded-full bg-purple-500 py-4 px-8 md:text-3xl"
        >
          Start Game
        </button>
      ) : (
        <p className="text-xs">Waiting for host to start...</p>
      )}
      <div>
        <p className="text-center">Your room code is</p>
        <div
          onClick={handleRoomNameCopy}
          className="hover:cursor-pointer border-2 border-solid border-grey-300 w-72 md:w-96 rounded-full shadow-xl text-3xl md:text-3xl font-bold flex justify-between items-center"
        >
          <p className="mb-2 ml-10 text-center grow">{state.roomName}</p>
          <ClipboardIcon className="mb-1 mr-4 h-6 w-6 md:h-8 md:w-8" />
        </div>
      </div>
    </main>
  )
}

export default WaitingLobby
