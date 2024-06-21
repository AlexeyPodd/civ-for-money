import { Box, Heading } from '@chakra-ui/react';

export default function NoGamesBanner({ gamesKind, username=null }) {
  return (
    <Box p='40px' m='10px' border='2px' borderColor='yellow.800' borderRadius='20px' textAlign='center' textColor='yellow.800'>
      <Heading as='p' size='md'>{username ? `${username} doesn't` : "You don't" } have any {gamesKind} games for now.</Heading>
    </Box>
  )
}
