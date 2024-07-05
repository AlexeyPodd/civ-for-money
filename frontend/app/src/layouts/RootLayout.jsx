import { Outlet } from "react-router-dom";
import NavbarContainer from "../components/Navbar/NavbarContainer";
import { Container, Flex, useToast } from "@chakra-ui/react";
import Footer from "../components/Footer/Footer";
import { SignerContext } from "../context/SignerContext";
import { useState } from "react";
import { ToastContext } from "../context/ToastContext";

export default function RootLayout() {
  // signer and toast for using in different components, through context
  const [signer, setSigner] = useState();
  const toast = useToast();

  return (
      <Flex minHeight="100vh" flexDirection="column">
        <SignerContext.Provider value={{ signer, setSigner }}>
          <ToastContext.Provider value={toast}>
            <NavbarContainer />
            <Container maxWidth="8xl">
              <Outlet />
            </Container>
          </ToastContext.Provider>
        </SignerContext.Provider>
        <Footer />
      </Flex>

  )
}
