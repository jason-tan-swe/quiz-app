import { useContext, useState } from 'react'
import { SocketContext } from '../../context/socket'
import { useGameStateStore } from '../../hooks/gameState'

const CreateForm = ({ setIsConnected }) => {
  const socket = useContext(SocketContext)
  const updateGameState = useGameStateStore(state => state.updateGameState)
  const [username, setUsername] = useState('')

  const handleUsername = e => {
    setUsername(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    setIsConnected(true)
    socket.connect()
    socket.emit('room:create', {
      username
    })
    updateGameState({ username })

    setUsername('')
    document.getElementById('usernameField').value = ''
  }
  const inputGroupStyles = 'p-2 border-2 border-solid rounded-md shadow-sm'

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col p-4 b-2 rounded-md shadow-xl gap-2"
    >
      <label for="usernameField">Name</label>
      <input
        id="usernameField"
        className={inputGroupStyles}
        name="username"
        type="text"
        placeholder="Enter a username"
        onChange={handleUsername}
        required={true}
      />
      <input
        name="create"
        type="submit"
        value="Create"
        className="text-white hover:cursor-pointer hover:bg-purple-400 bg-purple-500 mt-2 font-semibold rounded-md p-2"
      />
    </form>
  )
}

export default CreateForm
