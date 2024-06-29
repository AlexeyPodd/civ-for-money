import { Button, ButtonGroup, Heading, VStack } from '@chakra-ui/react'

export default function ButtonsBar({
  walletIsWrong,
  isHost,
  isPlayer2,
  player2Joined,
  isArbiter,
  gameStarted,
  gameClosed,
  disagreementReached,
  onModalOpen,
  setChosenMethod,
}) {

  function onMethodModalOpen(method) {
    setChosenMethod(method);
    onModalOpen();
  }

  return (
    <ButtonGroup mb='30px' w='100%' justifyContent="center" alignItems='end' gap='100px'>
      {isHost
        && <>
          <Button colorScheme='teal' isDisabled={walletIsWrong || !player2Joined || gameStarted || gameClosed} onClick={() => onMethodModalOpen('start')} >Start Game</Button>
          <Button colorScheme='red' isDisabled={walletIsWrong || gameStarted || gameClosed} onClick={() => onMethodModalOpen('cancel')} >Cancel Game</Button>
        </>
      }
      {(isHost || isPlayer2)
        && <VStack>
          <Heading size='md' as='p'>Vote</Heading>
          <ButtonGroup isAttached variant='outline' isDisabled={walletIsWrong || !gameStarted || gameClosed} >
            <Button onClick={() => onMethodModalOpen('voteVictory')}>Victory</Button>
            <Button onClick={() => onMethodModalOpen('voteLoss')}>Loss</Button>
            <Button onClick={() => onMethodModalOpen('voteDraw')}>Draw</Button>
          </ButtonGroup>
        </VStack>
      }
      {isArbiter
        && <VStack>
          <Heading size='md' as='p'>Appoint Winner</Heading>
          <ButtonGroup isAttached variant='outline' isDisabled={!disagreementReached || gameClosed} >
            <Button onClick={() => onMethodModalOpen('declareHostWinner')}>Host</Button>
            <Button onClick={() => onMethodModalOpen('decarePlayer2Winner')}>Player 2</Button>
            <Button onClick={() => onMethodModalOpen('declareDraw')}>Draw</Button>
          </ButtonGroup>
        </VStack>
      }
    </ButtonGroup>
  )
}
