
import CreatingGameModal from "../../components/Modals/CreatingGameModal";
import NewGameForm from "./NewGameForm";

export default function NewGame({
  createGame,
  rules,
  deleteRule,
  ruleIsDeleting,
  ruleIsDeleted,
  gameTypes,
  responseErrors,
  balanceWei,
  chosenRuleID,
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


  return (
    <>
      <NewGameForm
        onSubmit={createGame}
        rules={rules}
        deleteRule={deleteRule}
        ruleIsDeleting={ruleIsDeleting}
        ruleIsDeleted={ruleIsDeleted}
        gameTypes={gameTypes}
        responseErrors={responseErrors}
        balanceWei={balanceWei}
        chosenRuleID={chosenRuleID}
        isCreatingGame={isCreatingGame}
      />
      <CreatingGameModal
        isModalOpen={isModalOpen}
        onModalClose={onModalClose}
        isCreatingGame={isCreatingGame}
        isSettingRules={isSettingRules}
        settingRulesSuccess={settingRulesSuccess}
        settingRulesError={settingRulesError}
        isCreatingOnChain={isCreatingOnChain}
        isCreatingOnChainSuccess={isCreatingOnChainSuccess}
        isCreatingOnChainError={isCreatingOnChainError}
        isGameRegistering={isGameRegistering}
        gameRegistered={gameRegistered}
        gameFailedToRegister={gameFailedToRegister}
        onChainGameIndex={onChainGameIndex}
      />
    </>
  )
}
