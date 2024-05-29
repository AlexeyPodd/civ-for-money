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
      chosenRuleID={chosenRuleID}
    />
  )
}
