import NewGameForm from "./NewGameForm";

export default function NewGame({
  createGame,
  rules,
  deleteRule,
  ruleIsDeleting,
  ruleIsDeleted,
  gameTypes,
  responseErrors,
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
    />
  )
}
