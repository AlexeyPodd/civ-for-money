import { Flex, Heading, HStack, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import LoginStack from "./LoginStack";

export default function Navbar() {
  const FlexNavStyles = {
    h: "100%",
    p: "15px",
    alignItems: "center",
  }
  const NavLinkStyles = {
    h: "100%",
    _activeLink: {color: "yellow.600", bg: 'green.300', borderBottom: "8px", borderColor: "yellow.600"},
    ':hover': {
      textDecoration: "none",
      bg: 'green.300'
    },
  }

  return (
    <Flex as="nav" alignItems="center" gap="10px" mb="40px" bg="green.400" wrap="wrap" justify="space-between" >
      <NavLink to="/"><Heading h="68px" as="h1" p="15px" >Civ For Money</Heading></NavLink>

      <HStack h="68px" color="white" gap="30px" fontSize="1.2em" >
        <Link as={NavLink} to="/" sx={NavLinkStyles}  >
          <Flex sx={FlexNavStyles} >Lobby</Flex>
        </Link>
        <Link as={NavLink} to="/my-games" sx={NavLinkStyles} >
          <Flex sx={FlexNavStyles} >My Games</Flex>
        </Link>
        <Link as={NavLink} to="/new-game" sx={NavLinkStyles} >
          <Flex sx={FlexNavStyles} >Host</Flex>
        </Link>
        <Link as={NavLink} to="/disputes" sx={NavLinkStyles} >
          <Flex sx={FlexNavStyles} >Disputes</Flex>
        </Link>
      </HStack>

      <LoginStack />
    </Flex>
  )
}