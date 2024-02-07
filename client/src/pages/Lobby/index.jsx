import GameLobby from './GameLobby'
import WaitingLobby from './WaitingLobby'
import { useGameStateStore } from '../../hooks/gameState'

const Lobby = () => {
  const state = useGameStateStore(state => state.current)
  console.log(state)
  return state.isStarted ? <GameLobby /> : <WaitingLobby />
}

export default Lobby
