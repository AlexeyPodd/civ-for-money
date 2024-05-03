import { Text, HStack, Avatar, AvatarBadge, Button, Link } from "@chakra-ui/react";
import createSteamLoginLink from "../../utils/createSteamLoginLink";

export default function LoginStack() {
  return (
    <HStack h="68px" gap="20px" p="10px">
      <Avatar name="mario" bg="gray.100" src="/img/mario.png">
        <AvatarBadge width="1.3em" bg="red.500">
          <Text fontSize="xs" color="white">3</Text>
        </AvatarBadge>
      </Avatar>
      <Text>mario@netninja.dev</Text>
      <Button colorScheme="blue">Logout</Button>
      <Link href={createSteamLoginLink()} >Steam Login</Link>
    </HStack>
  )
}