import { Box, Text } from '@chakra-ui/react';

export default function WrongWalletWarningBanner({ rightAddress }) {
  return (
    <Box p='20px' m='10px' border='2px' borderColor='red' borderRadius='20px' textAlign='center' textColor='red'>
      <Text mb='30px'>Warning!</Text>
      <Text>Your contract address and connected wallet are not the same!</Text>
      <Text>{`You did join the game using this address: ${rightAddress}.`}</Text>
      <Text>Please reconnect your wallet to be able to interact with game contract.</Text>
    </Box>
  )
}
