import { Card, CardBody, CardFooter, CardHeader, Container, Heading, Text } from "@chakra-ui/react";
import LoginButton from "../common/LoginButton";

export default function LoginOffer() {
  return (
    <Container maxWidth="2xl" mt='25vh'>
      <Card align='center'>
        <CardHeader>
          <Heading as="p">Please Login</Heading>
        </CardHeader>
        <CardBody>
          <Text>Please login via Steam so that other players can find your profile to play with you.</Text>
        </CardBody>
        <CardFooter>
          <LoginButton isLoggingIn={false} size='lg' />
        </CardFooter>
      </Card>
    </Container>
  )
}