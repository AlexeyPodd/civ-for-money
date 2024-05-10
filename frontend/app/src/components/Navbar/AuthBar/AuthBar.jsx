import { Text, HStack, Avatar, Button, Link, Image } from "@chakra-ui/react";

import steamLoginImg from '../../../assets/images/steam-icon.webp';

export default function AuthBar({
  steamLink,
  isAuth,
  username,
  avatar,
  logout,
  isLoggingIn,
  isLoggingOut,
 }) {

  if (!isAuth) return (
    <Link m="10px" href={steamLink}>
      <Button colorScheme="yellow" isDisabled={isLoggingIn}>        
        <Image h="25px" me="10px" src={steamLoginImg} />
        Login
      </Button>
    </Link>
  )

  return (
    <HStack h="68px" gap="20px" p="10px" >
      <Avatar name={username} bg="gray.100" src={avatar} />
      <Text>{username}</Text>
      <Button colorScheme="gray" onClick={logout} isDisabled={isLoggingOut} >Logout</Button>
    </HStack>
  )
}
