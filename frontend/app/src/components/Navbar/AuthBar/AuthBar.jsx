import { Text, HStack, Avatar, Button } from "@chakra-ui/react";


import LoginButton from "../../common/LoginButton";
import EtherConnectorContainer from "./EtherConnector/EtherConnectorContainer";

export default function AuthBar({
  isAuth,
  username,
  avatar,
  logout,
  isLoggingIn,
  isLoggingOut,
 }) {

  if (!isAuth) return <LoginButton isLoggingIn={isLoggingIn} size='md' />

  return (
    <HStack h="68px" gap="20px" p="10px" >
      <EtherConnectorContainer />
      <Avatar name={username} bg="gray.100" src={avatar} />
      <Text>{username}</Text>
      <Button colorScheme="gray" onClick={logout} isLoading={isLoggingOut} >Logout</Button>
    </HStack>
  )
}
