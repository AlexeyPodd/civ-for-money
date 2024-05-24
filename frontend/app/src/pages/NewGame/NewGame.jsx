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
  currentRule,
}) {
  return (
    <NewGameForm
      onSubmit={createGame}
      rules={rules}
      deleteRule={deleteRule}
      ruleIsDeleting={ruleIsDeleting}
      ruleIsDeleted={ruleIsDeleted}
      gameTypes={gameTypes}
      responseErrors={responseErrors}
      balanceWei={balanceWei}
      currentRule={currentRule}
    />
  )
}
