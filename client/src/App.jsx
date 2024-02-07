import { useContext, useEffect, useState } from 'react'
import Homepage from './pages/Homepage'
import Lobby from './pages/Lobby'
import GameFinished from './pages/GameFinished'
import { SocketContext } from './context/socket'
import { useGameStateStore } from './hooks/gameState'

const App = () => {
  const [isConnected, setIsConnected] = useState(false)
  const updateGameState = useGameStateStore(state => state.updateGameState)
  const state = useGameStateStore(state => state.current)
  const socket = useContext(SocketContext)

  useEffect(() => {
    const onRoomJoin = args => {
      const { players, roomName } = args
      updateGameState({ players, roomName })
    }
    const onUserHost = async args => {
      const { isHost, roomName, players } = args
      updateGameState({ isHost, roomName, players })
    }
    const onRoomJoinError = args => {
      console.log('DISCONNECTING')
      const { message } = args
      socket.disconnect()
      setIsConnected(false)
      alert(message)
    }
    const onRoomLeave = args => {
      const { players } = args
      updateGameState({ players })
    }
    const onDisconnect = args => {
      const { players } = args
      updateGameState({ players })
      setIsConnected(false)
    }
    const onGameStart = args => {
      const { answer, timer, question, choices } = args
      updateGameState({ answer, timer, question, choices, isStarted: true })
    }
    const onGameTimer = args => {
      const { timer } = args
      updateGameState({ timer })
    }
    const onGameTimerFinished = args => {
      const { timer } = args
      updateGameState({ isRevealingAnswer: true, timer })
    }
    const onGameScoreUpdate = args => {
      const { score, players } = args
      updateGameState({ score, players })
    }
    const onGameNextQuestion = args => {
      const { answer, choices, question, timer, isLastQuestion } = args
      updateGameState({
        answer,
        choices,
        question,
        timer,
        isRevealingAnswer: false,
        hasAnswered: false,
        isLastQuestion
      })
    }
    const onGameEnd = args => {
      const { isFinished } = args
      updateGameState({ isFinished })
    }

    socket.on('room:join', onRoomJoin)
    socket.on('room:join-error', onRoomJoinError)
    socket.on('room:leave', onRoomLeave)
    socket.on('disconnect', onDisconnect)
    socket.on('user:IsHost', onUserHost)
    socket.on('game:start', onGameStart)
    socket.on('game:timer', onGameTimer)
    socket.on('game:timer-finished', onGameTimerFinished)
    socket.on('game:score-update', onGameScoreUpdate)
    socket.on('game:next-question', onGameNextQuestion)
    socket.on('game:end', onGameEnd)
  }, [])

  return (
    <main className="w-svw h-svh flex flex-col justify-center items-center">
      {/* <GameFinished /> */}
      {isConnected ? (
        state.isFinished && state.isStarted ? (
          <GameFinished />
        ) : (
          <Lobby />
        )
      ) : (
        <Homepage setIsConnected={setIsConnected} />
      )}
    </main>
  )
}

export default App
