import { Heading, Text } from "@chakra-ui/react";

export default function SomeError({error}) {
  return (
    <>
      <Heading as='h3'>Oops...</Heading>
      <Text>{error ? error :"Something gone wrong..."}</Text>
    </>
  )
}