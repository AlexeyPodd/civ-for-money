import { Flex, Image, keyframes } from '@chakra-ui/react'
import preloaderImg from '../../assets/images/preloader.webp'

export default function Preloader() {
  const brightnessChange = keyframes`
    from {filter: brightness(80%);}
    75% {filter: brightness(120%);}
    to {filter: brightness(80%);} 
  `;
  const animation = `${brightnessChange} infinite 2s linear`

  return (
    <Flex h='75vh' w="100%" alignItems="center" justify="center">
      <Image       
      src={preloaderImg}
      alt='loading...'
      animation={animation}
      />
    </Flex>
  )
}