import { Heading, Text } from "@chakra-ui/react";

export default function SomeError({error}) {
  console.log(error)
  return (
    <>
      <Heading as='h3'>Oops...</Heading>
      {error.status && <Heading as='p' size='lg'>{error.status}</Heading>}
      <Text>{error.data.detail ? error.data.detail :"Something gone wrong..."}</Text>
    </>
  )
}