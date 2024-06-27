import { Box, Text } from '@chakra-ui/react';

export default function WalletIsNotConnectedBanner() {
  return (
    <Box p='20px' m='10px' border='2px' borderColor='red' borderRadius='20px' textAlign='center' textColor='red'>
      <Text mb='30px'>Warning!</Text>
      <Text>Your wallet is not connected!</Text>
      <Text>Please connect your wallet to be able to interact with game contract.</Text>
    </Box>
  )
}
