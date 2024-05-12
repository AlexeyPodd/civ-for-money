import { Outlet } from "react-router-dom";
import NavbarContainer from "../components/Navbar/NavbarContainer";
import { Container, Flex } from "@chakra-ui/react";
import Footer from "../components/Footer/Footer";
import { SignerContext } from "../context/SignerContext";
import { useState } from "react";

export default function RootLayout() {
  const [signer, setSigner] = useState();
  return (
    <Flex minHeight="100vh" flexDirection="column">
      <SignerContext.Provider value={{ signer, setSigner }}>
        <NavbarContainer />
        <Container maxWidth="8xl" mb="40px">
          <Outlet />
        </Container>
      </SignerContext.Provider>
      <Footer />
    </Flex>
  )
}
