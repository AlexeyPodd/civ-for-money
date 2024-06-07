import { Button, ButtonGroup } from '@chakra-ui/react'
import GameTable from '../../components/GamesTable/GameTable'

export default function Game({game}) {
  return <>
    <ButtonGroup mb='50px' w='100%' justifyContent="center" gap='100px'>
      <Button>Join</Button>
      <Button>Cancel</Button>
      <Button>Start</Button>
      <Button>Quit</Button>
    </ButtonGroup>
    <GameTable game={game} />
  </>
}
