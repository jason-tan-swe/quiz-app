import { create } from 'zustand'

export const useGameStateStore = create(set => ({
  current: {
    answer: '',
    choices: [],
    isFinished: false,
    isHost: false,
    isStarted: false,
    isRevealingAnswer: false,
    isLastQuestion: false,
    hasAnswered: false,
    players: [],
    question: '',
    roomName: '',
    timer: 0,
    username: '',
    score: 0
  },
  updateGameState: fields =>
    set(state => ({ current: { ...state.current, ...fields } }))
}))
