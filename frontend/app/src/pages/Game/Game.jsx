
import GameTable from '../../components/GamesTables/GameTable'
import ButtonsBar from './ButtonsBar'

export default function Game({ game }) {
  return <>
    <ButtonsBar />
    <GameTable game={game} />
  </>
}
