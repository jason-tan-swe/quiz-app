import { useContext, useState } from 'react'
import { SocketContext } from '../../context/socket'
import { useGameStateStore } from '../../hooks/gameState'

const JoinForm = ({ setIsConnected }) => {
  const updateGameState = useGameStateStore(state => state.updateGameState)
  const socket = useContext(SocketContext)
  const [username, setUsername] = useState('')
  const [roomName, setRoomName] = useState('')

  const handleUsername = e => {
    setUsername(e.target.value)
  }

  const handleRoomName = e => {
    setRoomName(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    setIsConnected(true)
    socket.connect()
    socket.emit('room:join', {
      username,
      roomName
    })
    updateGameState({ username })

    setUsername('')
    setRoomName('')
    document.getElementById('usernameField').value = ''
    document.getElementById('roomNameField').value = ''
  }
  const inputGroupStyles = 'p-2 border-2 border-solid rounded-md shadow-sm'

  return (
    <form
      autoComplete="off"
      onSubmit={handleSubmit}
      className="flex flex-col p-4 b-2 rounded-md shadow-xl gap-2"
    >
      <label htmlFor="usernameField">Name</label>
      <input
        id="usernameField"
        className={inputGroupStyles}
        name="username"
        type="text"
        placeholder="Enter a username"
        onChange={handleUsername}
        required={true}
      />
      <label htmlFor="roomNameField">Room Name</label>
      <input
        id="roomNameField"
        className={inputGroupStyles}
        name="room name"
        type="text"
        placeholder="Enter the room name"
        onChange={handleRoomName}
        required={true}
      />
      <input
        name="join"
        type="submit"
        value="Join"
        className="text-white hover:cursor-pointer hover:bg-purple-400 bg-purple-500 mt-2 font-semibold rounded-md p-2"
      />
    </form>
  )
}

export default JoinForm
