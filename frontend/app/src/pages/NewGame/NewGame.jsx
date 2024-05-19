import NewGameForm from "./NewGameForm";

export default function NewGame({ createGame, rules, deleteRule, ruleIsDeleting, ruleIsDeleted }) {
  return (
    <NewGameForm
      onSubmit={createGame}
      rules={rules}
      deleteRule={deleteRule}
      ruleIsDeleting={ruleIsDeleting}
      ruleIsDeleted={ruleIsDeleted}
    />
  )
}
