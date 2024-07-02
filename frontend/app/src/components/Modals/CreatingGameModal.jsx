import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Text, HStack, ModalFooter, Heading } from "@chakra-ui/react";
import Spinner from "../common/Spinner/Spinner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatingGameModal({
  isCreatingGame,
  isSettingRules,
  settingRulesSuccess,
  settingRulesError,
  isCreatingOnChain,
  isCreatingOnChainSuccess,
  isCreatingOnChainError,
  isGameRegistering,
  gameRegistered,
  gameFailedToRegister,
  onChainGameIndex,
  isModalOpen,
  onModalClose,
}) {

  const [resultMessage, setResultMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isCreatingGame) {
      setResultMessage("");
    }
    else if (settingRulesSuccess && isCreatingOnChainSuccess && gameRegistered) {
      setResultMessage("Game was successfully created");
    }
    else if (settingRulesError) {
      setResultMessage("Rules creating/updating error");
    }
    else if (isCreatingOnChainError) {
      setResultMessage("Failed to create game on chain (canceled or error)");
    }
    else if (gameFailedToRegister) {
      setResultMessage(
        `Oops... Server error occurs while game registering.
         Your game id on chain is ${onChainGameIndex}.
         Please contact support with this id for registering your game on server.`
      );
    }
  }, [isCreatingGame,
    settingRulesSuccess,
    isCreatingOnChainSuccess,
    gameRegistered,
    settingRulesError,
    isCreatingOnChainError,
    gameFailedToRegister,
  ]);

  function closeModal() {
    if (settingRulesSuccess && isCreatingOnChainSuccess && gameRegistered) {
      return () => navigate(`/game/${onChainGameIndex}`);
    }
    return onModalClose;
  }

  return (
    <Modal isOpen={isModalOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Creating New Game.</ModalHeader>
        <ModalBody>
          <HStack>
            <Text>Setting game rules...</Text>
            {isSettingRules && <Spinner />}
            {settingRulesSuccess && <Text>&#9989;</Text>}
            {settingRulesError && <Text>&#10060;</Text>}
          </HStack>
          {settingRulesSuccess
            && <HStack>
              <Text>Creating game instance on chain...</Text>
              {isCreatingOnChain && <Spinner />}
              {isCreatingOnChainSuccess && <Text>&#9989;</Text>}
              {isCreatingOnChainError && <Text>&#10060;</Text>}
            </HStack>}
          {settingRulesSuccess
            && isCreatingOnChainSuccess
            && <HStack>
              <Text>Registering game on server...</Text>
              {isGameRegistering && <Spinner />}
              {gameRegistered && <Text>&#9989;</Text>}
              {gameFailedToRegister && <Text>&#10060;</Text>}
            </HStack>}
          {!isCreatingGame && resultMessage && <Heading as='p' size='md' mt='40px'>{resultMessage}</Heading>}
        </ModalBody>
        {!isCreatingGame &&
          <ModalFooter>
            <Button onClick={closeModal()}>Ok</Button>
          </ModalFooter>
        }
      </ModalContent>
    </Modal>
  )
}
