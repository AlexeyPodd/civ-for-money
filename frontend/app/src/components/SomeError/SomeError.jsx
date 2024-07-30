import { Heading, Text } from "@chakra-ui/react";

export default function SomeError({error}) {
  return (
    <>
      <Heading as='h3'>Oops...</Heading>
      {error.status && <Heading as='p' size='lg'>{error.status}</Heading>}
      <Text>{error.data && error.data.detail ? error.data.detail :"Something gone wrong..."}</Text>
    </>
  )
}