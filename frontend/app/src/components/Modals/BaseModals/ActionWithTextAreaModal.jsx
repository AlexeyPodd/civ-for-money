import { Button, FormControl, FormLabel, HStack,  Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea } from '@chakra-ui/react'
import Spinner from '../../common/Spinner/Spinner'

export default function ActionWithTextAreaModal({
  isOpen,
  modalTitle,
  confirmed,
  closeModal,
  actions,
  startProcess,
  processFinished,
  inputLabel,
  inputValue,
  setInputValue,
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
            : <FormControl>
              <FormLabel>{inputLabel}</FormLabel>
              <Textarea value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            </FormControl>
          }
        </ModalBody>
        <ModalFooter>
          {!confirmed
            && <>
              <Button colorScheme='green' onClick={startProcess} isDisabled={!inputValue}>Confirm</Button>
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
