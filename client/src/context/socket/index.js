import { createContext } from 'react'
import { io } from 'socket.io-client'

const URL =
  process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000'

const socket = io(URL, { autoConnect: false })

const SocketContext = createContext({
  socket: null
})

export { socket, SocketContext }
