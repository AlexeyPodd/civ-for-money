import { Box, Heading } from '@chakra-ui/react';

export default function BannedBanner() {
  return (
    <Box p='40px' m='10px' border='2px' borderColor='red' borderRadius='20px' textAlign='center' textColor='red'>
      <Heading pb='20px' as='p' size='md'>Your profile has been banned by the administration.</Heading>
      <Heading as='p' size='md'>You can no longer host games or join other players.</Heading>
    </Box>
  )
}
