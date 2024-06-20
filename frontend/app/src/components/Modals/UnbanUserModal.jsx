import { useState, useEffect } from "react";
import ActionsModal from "./BaseModals/ActionsModal";
import { useUnbanUserMutation } from "../../redux/api";

export default function UnbanUserModal({ isOpen, onClose, username, uuid, refetch }) {
  const [confirmed, setConfirmed] = useState(false);
  const [actions, setActions] = useState([
    {
      description: 'waiting for server',
      isProcessing: false,
      isSuccess: false,
      isError: false
    },
  ]);

  const [unban, { isSuccess, isError, isLoading, reset }] = useUnbanUserMutation();

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
  }

  function unbanUser() {
    setConfirmed(true);
    unban(uuid);
  }

  return (
    <ActionsModal
      isOpen={isOpen}
      modalTitle={`Unban user ${username}.`}
      confirmed={confirmed}
      closeModal={closeModal}
      startProcess={unbanUser}
      processFinished={isSuccess || isError}
      actions={actions}
    />
  )
}
