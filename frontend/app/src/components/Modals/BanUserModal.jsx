import { useState, useEffect } from "react";
import ActionsModal from "./BaseModals/ActionsModal";
import { useBanUserMutation } from "../../redux/api";

export default function BanUserModal({ isOpen, onClose, username, uuid, refetch }) {
  const [confirmed, setConfirmed] = useState(false);
  const [actions, setActions] = useState([
    {
      description: 'waiting for server',
      isProcessing: false,
      isSuccess: false,
      isError: false
    },
  ]);

  const [ban, { isSuccess, isError, isLoading, reset }] = useBanUserMutation();

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

  function banUser() {
    setConfirmed(true);
    ban(uuid);
  }

  return (
    <ActionsModal
      isOpen={isOpen}
      modalTitle={`Ban user ${username}.`}
      confirmed={confirmed}
      closeModal={closeModal}
      startProcess={banUser}
      processFinished={isSuccess || isError}
      actions={actions}
    />
  )
}
