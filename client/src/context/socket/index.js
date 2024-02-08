import { createContext } from 'react'
import { io } from 'socket.io-client'

const URL = 'https://quiz-app-production-4616.up.railway.app/'

const socket = io(URL, { autoConnect: false })

const SocketContext = createContext({
  socket: null
})

export { socket, SocketContext }
