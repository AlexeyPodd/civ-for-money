import { Text, HStack, Avatar, Button, Link, Image } from "@chakra-ui/react";

import steamLoginImg from '../../../assets/images/steam-icon.png';

export default function AuthBar({
  steamLink,
  isAuth,
  username,
  avatar,
  logout,
  isLoggingOut }) {

  if (!isAuth) return (
    <Link m="10px" href={steamLink}>
      <Button colorScheme="yellow">
        Login
        <Image h="30px" ms="10px" src={steamLoginImg} />
      </Button>
    </Link>
  )

  return (
    <HStack h="68px" gap="20px" p="10px" >
      <Avatar name={username} bg="gray.100" src={avatar} />
      <Text>{username}</Text>
      <Button colorScheme="gray" onClick={logout} disabled={isLoggingOut} >Logout</Button>
    </HStack>
  )
}