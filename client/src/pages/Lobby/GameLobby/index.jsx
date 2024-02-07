import { useGameStateStore } from '../../../hooks/gameState'
import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../../../context/socket'
import { shuffle } from '../../../utils/shuffle'
import * as HTMLDecoderEncoder from 'html-encoder-decoder'

const GameLobby = () => {
  let num = 0
  const state = useGameStateStore(state => state.current)
  const updateGameState = useGameStateStore(state => state.updateGameState)
  const socket = useContext(SocketContext)
  const [choices, setChoices] = useState(null)
  const [playerChoice, setPlayerChoice] = useState(null)

  const handleChoiceClick = choice => {
    setPlayerChoice(choice)
  }

  const handleConfirm = e => {
    updateGameState({ hasAnswered: true })
    socket.emit('game:player-answered', { answer: playerChoice })
  }

  const handleNextQuestion = e => {
    socket.emit('game:next-question')
    if (!state.isLastQuestion) {
      setTimeout(() => {
        socket.emit('game:timer')
      }, 500)
    }
  }

  // console.log({ answer: state.answer, reveal: state.isRevealingAnswer })

  const choiceStyles = 'max-w-[80%] p-2 border-2 border-solid rounded-full'
  const outlinedChoiceStyles = `${choiceStyles} text-purple-500 border-purple-500 hover:cursor-pointer hover:bg-purple-400 transition-colors hover:text-white duration-400 hover:border-purple-400 duration-300`
  const chosenChoiceStyles = `${choiceStyles} text-white bg-purple-500`
  const disabledStyles = `${choiceStyles} opacity-40 cursor-not-allowed border-solid border-2 text-purple-500 border-purple-500 rounded-full p-2 max-w-[80%]`
  const correctAnswerStyles = `${choiceStyles} bg-green-500 opacity-100 border-green-500 text-white`
  const wrongAnswerStyles = `${choiceStyles} bg-red-500 opacity-100 border-red-500 text-white`

  const getChoiceStyles = choice => {
    if (state.isRevealingAnswer && state.answer == choice) {
      return correctAnswerStyles
    } else if (state.isRevealingAnswer && state.answer != choice) {
      return wrongAnswerStyles
    } else if (state.hasAnswered) {
      return disabledStyles
    } else if (playerChoice == choice) {
      return chosenChoiceStyles
    }
    return outlinedChoiceStyles
  }

  useEffect(() => {
    // setChoices(shuffle(state.choices))
    setChoices(state.choices)
  }, [state.choices])

  return (
    <>
      <aside className="absolute top-0 right-0 mx-2">
        {state.timer} <p className="text-xs">Your score: {state.score}</p>
      </aside>
      <main className="border-2 border-solid border-grey-300 max-w-[80%] rounded-xl shadow-xl p-4 mx-12 flex flex-col justify-center items-center gap-2">
        <h1 className="">{HTMLDecoderEncoder.decode(state.question)}</h1>
        <div className="flex flex-col w-full gap-2">
          {choices?.map(choice => (
            <button
              disabled={state.hasAnswered}
              key={++num}
              className={getChoiceStyles(choice)}
              onClick={() => handleChoiceClick(choice)}
            >
              <p className="ml-2 w-full flex justify-between">
                {HTMLDecoderEncoder.decode(choice)}
                {playerChoice == choice && (
                  <span className="mr-2">Your answer</span>
                )}
              </p>
            </button>
          ))}
        </div>
        <button
          disabled={state.hasAnswered || state.isRevealingAnswer}
          onClick={handleConfirm}
          className="disabled:opacity-40 disabled:cursor-not-allowed font-semibold max-w-[80%] w-full self-start bg-purple-500 text-white hover:bg-purple-400 hover:cursor-pointer rounded-full px-4 py-2 my-4"
        >
          Confirm
        </button>
        {!state.isRevealingAnswer && state.hasAnswered && (
          <p className="max-w-[80%] w-full text-xs">
            Waiting for other players...
          </p>
        )}
        {state.isRevealingAnswer && state.isHost ? (
          <button
            onClick={handleNextQuestion}
            className="hover:bg-purple-400 self-start w-full max-w-[80%] p-2 bg-purple-500 text-white font-bold rounded-full"
          >
            Next
          </button>
        ) : (
          state.isRevealingAnswer && (
            <p className="text-xs">Waiting for host...</p>
          )
        )}
      </main>
    </>
  )
}

export default GameLobby
