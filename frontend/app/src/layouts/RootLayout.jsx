import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { Container, Flex } from "@chakra-ui/react";
import Footer from "../components/Footer/Footer";

export default function RootLayout() {
  return (
    <Flex minHeight="100vh" flexDirection="column">
      <Navbar />
      <Container maxWidth="8xl" mb="40px">
        <Outlet />
      </Container>
      <Footer />
    </Flex>
  )
}
