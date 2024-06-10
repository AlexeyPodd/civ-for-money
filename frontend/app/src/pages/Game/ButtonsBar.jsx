import { Button, ButtonGroup, Heading, VStack } from '@chakra-ui/react'

export default function ButtonsBar() {
  return (
    <ButtonGroup mb='50px' w='100%' justifyContent="center" alignItems='end' gap='100px'>
      <Button colorScheme='teal'>Start Game</Button>
      <Button colorScheme='red'>Cancel Game</Button>
      <VStack>
        <Heading size='md' as='p'>Vote</Heading>
        <ButtonGroup isAttached variant='outline'>
          <Button>Victory</Button>
          <Button>Loss</Button>
          <Button>Draw</Button>
        </ButtonGroup>
      </VStack>
      <VStack>
        <Heading size='md' as='p'>Appoint Winner</Heading>
        <ButtonGroup isAttached variant='outline'>
          <Button>Host</Button>
          <Button>Player 2</Button>
          <Button>Draw</Button>
        </ButtonGroup>
      </VStack>
    </ButtonGroup>
  )
}
