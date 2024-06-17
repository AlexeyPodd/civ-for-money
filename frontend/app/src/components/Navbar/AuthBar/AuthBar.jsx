import { Text, HStack, Avatar, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";


import LoginButton from "../../common/LoginButton";
import EtherConnectorContainer from "./EtherConnector/EtherConnectorContainer";

export default function AuthBar({
  isAuth,
  username,
  avatar,
  uuid,
  logout,
  isLoggingIn,
  isLoggingOut,
}) {

  const navigate = useNavigate();

  if (!isAuth) return <LoginButton isLoggingIn={isLoggingIn} size='md' />

  return (
    <HStack h="68px" gap="20px" p="10px" >
      <EtherConnectorContainer />
      <Button
        onClick={() => navigate(`/profile/${uuid}`)}
        size="bg"
        px="10px"
        py='4px'
        colorScheme='green'
      >
        <Avatar name={username} bg="gray.100" src={avatar} />
        <Text ms='10px'>{username.length > 13 ? username.slice(0, 10) + "..." : username}</Text>
      </Button>
      <Button colorScheme="gray" onClick={logout} isLoading={isLoggingOut} >Logout</Button>
    </HStack>
  )
}
