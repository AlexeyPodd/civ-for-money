import { Button, ButtonGroup, Heading, VStack } from '@chakra-ui/react'

export default function ButtonsBar({
  walletIsWrong,
  isHost,
  isPlayer2,
  player2Joined,
  isArbiter,
  gameStarted,
  disagreementReached
}) {
  return (
    <ButtonGroup mb='50px' w='100%' justifyContent="center" alignItems='end' gap='100px'>
      {isHost
        && <>
          <Button colorScheme='teal' isDisabled={walletIsWrong || !player2Joined || gameStarted} >Start Game</Button>
          <Button colorScheme='red' isDisabled={walletIsWrong || gameStarted} >Cancel Game</Button>
        </>
      }
      {(isHost || isPlayer2)
        && <VStack>
          <Heading size='md' as='p'>Vote</Heading>
          <ButtonGroup isAttached variant='outline' isDisabled={walletIsWrong || !gameStarted} >
            <Button>Victory</Button>
            <Button>Loss</Button>
            <Button>Draw</Button>
          </ButtonGroup>
        </VStack>
      }
      {isArbiter
        && <VStack>
          <Heading size='md' as='p'>Appoint Winner</Heading>
          <ButtonGroup isAttached variant='outline' isDisabled={!disagreementReached}>
            <Button>Host</Button>
            <Button>Player 2</Button>
            <Button>Draw</Button>
          </ButtonGroup>
        </VStack>
      }
    </ButtonGroup>
  )
}
