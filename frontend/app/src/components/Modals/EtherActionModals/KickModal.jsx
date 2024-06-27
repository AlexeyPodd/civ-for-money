import { useEffect, useState } from "react";
import { useUpdateGameMutation } from "../../../redux/api";
import ActionsModal from "../BaseModals/ActionsModal";

export default function KickModal({
  gameID,
  isOpen,
  onClose,
  username,
  contractAPI,
  refetch,
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [actions, setActions] = useState([
    {
      description: 'waiting for transaction confirmation',
      isProcessing: false,
      isSuccess: false,
      isError: false
    },
    {
      description: 'registering on server',
      isProcessing: false,
      isSuccess: false,
      isError: false
    },
  ]);

  const [updateGame, { isLoading, isError, isSuccess, reset }] = useUpdateGameMutation();

  useEffect(() => {
    setActions([
      actions[0],
      {
        description: actions[1].description,
        isProcessing: isLoading,
        isSuccess,
        isError,
      }]);
  }, [isSuccess, isError, isLoading]);

  async function kickOnChain() {
    setActions([
      {
        description: actions[0].description,
        isProcessing: true,
        isSuccess: false,
        isError: false,
      },
      actions[1],
    ]);
    try {
      const receipt = await contractAPI.excludePlayer2();
      setActions([
        {
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
      refetch();
      setConfirmed(false);
    }
  }

  async function kickPlayer() {
    setConfirmed(true);

    // using smart contract method
    let blockNumber;
    try {
      blockNumber = await kickOnChain();
    } catch (err) {
      return;
    }

    // updating data on server
    updateGame({ gameID, eventType: "SlotFreed", blockNumber });
  }

  return (
    <ActionsModal
      isOpen={isOpen}
      modalTitle={`Kick ${username}.`}
      confirmed={confirmed}
      closeModal={closeModal}
      startProcess={kickPlayer}
      processFinished={actions.every(a => a.isSuccess) || actions.some(a => a.isError)}
      actions={actions}
    />
  )
}
