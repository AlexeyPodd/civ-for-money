import { Button, HStack, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import Spinner from '../../common/Spinner/Spinner'

export default function ActionsModal({
  isOpen,
  modalTitle,
  confirmed,
  closeModal,
  actions,
  startProcess,
  processFinished,
}) {
  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalTitle}</ModalHeader>
        <ModalBody>
          {confirmed
            ? actions
              .filter(a => a.isProcessing || a.isSuccess || a.isError)
              .map(a => <HStack key={a.id}>
                <Text>{a.description}...</Text>
                {a.isProcessing && <Spinner />}
                {a.isSuccess && <Text>&#9989;</Text>}
                {a.isError && <Text>&#10060;</Text>}
              </HStack>)
            : <Text>Are you sure?</Text>
          }
        </ModalBody>
        <ModalFooter>
          {!confirmed
            && <>
              <Button colorScheme='green' onClick={startProcess}>Yes</Button>
              <Button ms='auto' onClick={closeModal}>Cancel</Button>
            </>
          }
          {processFinished
            && <Button onClick={closeModal}>Ok</Button>
          }
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
