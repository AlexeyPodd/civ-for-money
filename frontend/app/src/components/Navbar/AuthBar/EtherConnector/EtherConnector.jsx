import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";


export default function EtherConnector({ signerIsSet, etherAddress, initializeSigner, disconnect }) {
  const [showDisconnectButton, setShowDisconnectButton] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  async function connectWallet() {
    setIsConnecting(true);
    await initializeSigner();
    setIsConnecting(false);
  }
  function disConnectWallet() {
    disconnect();
    setShowDisconnectButton(false);
  }

  if (!signerIsSet) return (
    <Button
     colorScheme="yellow"
     isLoading={isConnecting}
     onClick={connectWallet}
     >
      Connect Wallet
    </Button>
  )

  return (
    <>
      {showDisconnectButton
        ? <Button
          colorScheme="red"
          w="160px"
          variant="outline"
          onMouseOut={() => setShowDisconnectButton(false)}
          onClick={disConnectWallet}
        >
          Disconnect
        </Button>
        : <Button
          colorScheme="blackAlpha"
          w="160px"
          variant="outline"
          leftIcon={<LinkIcon />}
          onClick={() => setShowDisconnectButton(true)}
        >
          {`${etherAddress.slice(0, 6)}...${etherAddress.slice(38)}`}
        </Button>
      }
    </>
  )
}