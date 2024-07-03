import { useEffect, useState } from "react";
import { useUpdateGameMutation } from "../../redux/api";
import ActionsModal from "./BaseModals/ActionsModal";

export default function OnChainInteractionModal({
  modalTitle,
  gameID,
  isOpen,
  onClose,
  contractMethod,
  contractMethodArgs,
  possibleEventType,
  onChainRefetch,
}) {
  const initialActions = [
    {
      id: 1,
      description: 'waiting for transaction confirmation',
      isProcessing: false,
      isSuccess: false,
      isError: false
    },
    {
      id: 2,
      description: 'registering on server',
      isProcessing: false,
      isSuccess: false,
      isError: false
    },
  ];
  const [confirmed, setConfirmed] = useState(false);
  const [actions, setActions] = useState(initialActions);

  const [updateGame, { isLoading, isError, isSuccess, reset }] = useUpdateGameMutation();

  useEffect(() => {
    setActions([
      actions[0],
      {
        id: 2,
        description: actions[1].description,
        isProcessing: isLoading,
        isSuccess,
        isError,
      }]);
  }, [isSuccess, isError, isLoading]);

  async function OnChainInteraction() {
    setActions([
      {
        id: 1,
        description: actions[0].description,
        isProcessing: true,
        isSuccess: false,
        isError: false,
      },
      actions[1],
    ]);
    try {
      const receipt = await contractMethod(...contractMethodArgs);
      setActions([
        {
          id: 1,
          description: actions[0].description,
          isProcessing: false,
          isSuccess: true,
          isError: false,
        },
        actions[1],
      ]);
      return receipt.blockNumber;
    } catch (error) {
      setActions([
        {
          id: 1,
          description: actions[0].description,
          isProcessing: false,
          isSuccess: false,
          isError: true,
        },
        actions[1],
      ]);
      throw error;
    }
  }

  function closeModal() {
    onClose();
    if (confirmed) {
      reset();
      onChainRefetch();
      setConfirmed(false);
      setActions(initialActions);
    }
  }

  async function interact() {
    setConfirmed(true);

    // using smart contract method
    let blockNumber;
    try {
      blockNumber = await OnChainInteraction();
    } catch (err) {
      console.log(err)
      return;
    }

    // updating data on server
    updateGame({ gameID, possibleEventType, blockNumber });
  }

  return (
    <ActionsModal
      isOpen={isOpen}
      modalTitle={modalTitle}
      confirmed={confirmed}
      closeModal={closeModal}
      startProcess={interact}
      processFinished={actions.every(a => a.isSuccess) || actions.some(a => a.isError)}
      actions={actions}
    />
  )
}
