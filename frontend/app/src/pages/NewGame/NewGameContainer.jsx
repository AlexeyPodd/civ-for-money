import NewGame from "./NewGame";
import withLoginOffer from "../../hoc/withLoginOffer";
import withConnectWalletOffer from "../../hoc/withConnectWalletOffer";
import { compose } from "@reduxjs/toolkit";
import { useDeleteRuleMutation, useGetUserRulesQuery } from "../../redux/api";
import Preloader from "../../components/Preloader/Preloader"
import SomeError from "../../components/SomeError/SomeError";
import { useEffect } from "react";

function NewGameContainer() {
  const { data: rules, error: gettingRulesListError, isLoading: isGettingRulesList, refetch } = useGetUserRulesQuery();

  const [deleteRule, { isSuccess: ruleIsDeleted, isLoading: ruleIsDeleting, error: ruleDeletingError, reset }] = useDeleteRuleMutation();

  async function createGame(formData) {
    console.log(formData);
  }

  useEffect(() => {
    if (ruleIsDeleted) {
      reset();
      refetch();
    }
  }, [ruleIsDeleted, reset, refetch])

  if (isGettingRulesList) return <Preloader />
  if (gettingRulesListError) return <SomeError error={gettingRulesListError} />
  if (ruleDeletingError) return <SomeError error={ruleDeletingError} />

  return <NewGame
    createGame={createGame}
    rules={rules}
    deleteRule={deleteRule}
    ruleIsDeleting={ruleIsDeleting}
    ruleIsDeleted={ruleIsDeleted}
  />
}

export default compose(withLoginOffer)(NewGameContainer);