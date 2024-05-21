import NewGame from "./NewGame";
import withLoginOffer from "../../hoc/withLoginOffer";
import withConnectWalletOffer from "../../hoc/withConnectWalletOffer";
import { compose } from "@reduxjs/toolkit";
import { useCreateRuleMutation, useDeleteRuleMutation, useGetGameTypesQuery, useGetUserRulesQuery, useUpdateRuleMutation } from "../../redux/api";
import Preloader from "../../components/Preloader/Preloader"
import SomeError from "../../components/SomeError/SomeError";
import { useEffect, useState } from "react";

function NewGameContainer() {
  const { data: rules, error: gettingRulesListError, isLoading: isGettingRulesList, refetch } = useGetUserRulesQuery();
  const [deleteRule, { isSuccess: ruleIsDeleted, isLoading: ruleIsDeleting, error: ruleDeletingError, reset: resetDeleteMutation }] = useDeleteRuleMutation();
  const { data: gameTypes, error: gettingGameTypesError, isLoading: isGettingGameTypes } = useGetGameTypesQuery();
  const [updateRule, {isSuccess: ruleIsUpdated, reset: resetUpdateMutation}] = useUpdateRuleMutation();
  const [createRule, {isSuccess: ruleIsCreated, reset: resetCreateMutation}] = useCreateRuleMutation();

  const [responseErrors, setResponseErrors] = useState({});


  useEffect(() => {
    if (ruleIsDeleted) {
      resetDeleteMutation();
      refetch();
    }
  }, [ruleIsDeleted, resetDeleteMutation, refetch])

  useEffect(() => {
    if (ruleIsUpdated) {
      resetUpdateMutation();
      refetch();
    }
  }, [ruleIsUpdated, resetUpdateMutation, refetch])

  useEffect(() => {
    if (ruleIsCreated) {
      resetCreateMutation();
      refetch();
    }
  }, [ruleIsCreated, resetCreateMutation, refetch])

  if (isGettingRulesList || isGettingGameTypes) return <Preloader />
  if (gettingRulesListError) return <SomeError error={gettingRulesListError} />
  if (ruleDeletingError) return <SomeError error={ruleDeletingError} />
  if (gettingGameTypesError) return <SomeError error={gettingGameTypesError} />
  if (!isGettingGameTypes && !gettingGameTypesError && !gameTypes) {
    return <SomeError error="Server error: no game types" />
  }

  async function createGame(formData) {
    try {
      await syncRule(formData);
    }
    catch (err) {
      setRulesResponseErrors(err);
      return;
    }
    console.log('continuing creating game process');
  }

  function syncRule(formData) {
    if (formData.rules === "create") {
      return createRule({
        title: formData.rulesTitle,
        description: formData.rulesDescription
      }).unwrap();
    }

    let chosenRule;
    for (let rule of rules) {
      if (Number(formData.rules) === rule.id) {
        chosenRule = rule;        
        break;
      }
    }

    if (chosenRule.title != formData.rulesTitle
      || chosenRule.description != formData.rulesDescription) {
        return updateRule({
          id: chosenRule.id,
          title: formData.rulesTitle,
          description: formData.rulesDescription,
        }).unwrap();
      }

    return new Promise((resolve, reject) => resolve());
  }

  function setRulesResponseErrors(err) {
    const errors = {};
    if (err.data.title) errors.rulesTitle = err.data.title[0];
    if (err.data.description) errors.rulesDescription = err.data.description[0];
    if (err.data.detail) errors.serverError = err.data.detail;
    setResponseErrors(errors);
  }

  return <NewGame
    createGame={createGame}
    rules={rules}
    deleteRule={deleteRule}
    ruleIsDeleting={ruleIsDeleting}
    ruleIsDeleted={ruleIsDeleted}
    gameTypes={gameTypes}
    responseErrors={responseErrors}
  />
}

export default compose(withLoginOffer)(NewGameContainer);