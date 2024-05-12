import { Button, Image, Link } from '@chakra-ui/react'
import steamLoginImg from '../../assets/images/steam-icon.webp';
import createSteamLoginLink from "../../utils/createSteamLoginLink";

export default function LoginButton({ isLoggingIn, size }) {
  return (
    <Link m="10px" href={createSteamLoginLink()}>
      <Button colorScheme="yellow" isLoading={isLoggingIn} size={size}>
        <Image h="25px" me="10px" src={steamLoginImg} />
        Login
      </Button>
    </Link>
  )
}
