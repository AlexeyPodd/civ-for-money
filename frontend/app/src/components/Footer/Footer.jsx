import { Flex, Box, HStack, Spacer, Link } from "@chakra-ui/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const linkStyles = {
    p: "2px",
    ':hover': {
      bg: "black",
      color: "white",
      textDecoration: "none"
    }
  }
  return (
    <Flex mt="auto" px="40px" as="footer" bg="gray.100" fontSize="sm" gap="50px">
      <Spacer />
      <HStack gap="10px">
        <Link href="https://github.com/AlexeyPodd" sx={linkStyles}>Github</Link>
        <Link href="https://www.linkedin.com/in/oleksii-piddubnyi-98797b268" sx={linkStyles}>Linkedin</Link>
        <Link href="https://t.me/alexey_0000" sx={linkStyles}>Telegram</Link>
      </HStack>
      <Box>© Oleksii Piddubnyi 2024-{currentYear}</Box>
    </Flex>
  )
}
