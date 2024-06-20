import { useState, useEffect } from "react";
import { useWarnUserMutation } from "../../redux/api";
import ActionWithTextAreaModal from "./BaseModals/ActionWithTextAreaModal";

export default function WarnUserModal({ isOpen, onClose, username, uuid, refetch }) {
  const [confirmed, setConfirmed] = useState(false);
  const [warningDescription, setWarningDescription] = useState('');
  const [actions, setActions] = useState([
    {
      id: 0,
      description: 'waiting for server',
      isProcessing: false,
      isSuccess: false,
      isError: false
    },
  ]);

  const [warn, { isSuccess, isError, isLoading, reset }] = useWarnUserMutation();

  useEffect(() => {
    setActions([{
      description: actions[0].description,
      isProcessing: isLoading,
      isSuccess,
      isError,
    }])
  }, [isSuccess, isError, isLoading]);

  function closeModal() {
    onClose();
    refetch();
    reset();
    setConfirmed(false);
    setWarningDescription('');
  }

  function unbanUser() {
    setConfirmed(true);
    warn({uuid, description: warningDescription});
  }

  return (
    <ActionWithTextAreaModal
      isOpen={isOpen}
      modalTitle={`Unban user ${username}.`}
      confirmed={confirmed}
      closeModal={closeModal}
      startProcess={unbanUser}
      processFinished={isSuccess || isError}
      actions={actions}
      inputLabel='Warning Description'
      inputValue={warningDescription}
      setInputValue={setWarningDescription}
    />
  )
}
