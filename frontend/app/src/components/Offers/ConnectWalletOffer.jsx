import { Card, CardBody, CardHeader, Container, Heading, Text } from "@chakra-ui/react";

export default function ConnectWalletOffer() {
  return (
    <Container maxWidth="2xl" mt='25vh'>
      <Card align='center'>
        <CardHeader>
          <Heading as="p">Please Connect Your Wallet</Heading>
        </CardHeader>
        <CardBody>
          <Text>Please connect your wallet to be able to interact with blockchain.</Text>
        </CardBody>
      </Card>
    </Container>
  )
}