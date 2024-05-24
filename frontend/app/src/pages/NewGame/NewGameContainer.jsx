import NewGame from "./NewGame";
import withLoginOffer from "../../hoc/withLoginOffer";
import withConnectWalletOffer from "../../hoc/withConnectWalletOffer";
import { compose } from "@reduxjs/toolkit";
import { useCreateRuleMutation, useDeleteRuleMutation, useGetGameTypesQuery, useGetUserRulesQuery, useUpdateRuleMutation } from "../../redux/api";
import Preloader from "../../components/Preloader/Preloader"
import SomeError from "../../components/SomeError/SomeError";
import { useContext, useEffect, useState } from "react";
import { SignerContext } from "../../context/SignerContext";

function NewGameContainer() {
  const { data: rules, error: gettingRulesListError, isLoading: isGettingRulesList,isFetching: isFetchingRulesList, refetch } = useGetUserRulesQuery();
  const [deleteRule, { isSuccess: ruleIsDeleted, isLoading: ruleIsDeleting, error: ruleDeletingError, reset: resetDeleteMutation }] = useDeleteRuleMutation();
  const { data: gameTypes, error: gettingGameTypesError, isLoading: isGettingGameTypes } = useGetGameTypesQuery();
  const [updateRule, { isSuccess: ruleIsUpdated, reset: resetUpdateMutation }] = useUpdateRuleMutation();
  const [createRule, { isSuccess: ruleIsCreated, reset: resetCreateMutation }] = useCreateRuleMutation();

  const [responseErrors, setResponseErrors] = useState({});
  const [createdRule, setCreatedRule] = useState({id: 'create', title: '', description: ''});
  const [currentRule, setCurrentRule] = useState({id: 'create', title: '', description: ''});

  const { signer } = useContext(SignerContext);
  const [balanceWei, setBalanceWei] = useState();

  useEffect(() => {
    async function getBalance() {
      setBalanceWei(await signer.provider.getBalance(signer.address));
    }
    getBalance();
  }, [signer]);

  // --- effects for resetting api data after using it -----
  useEffect(() => {
    if (ruleIsDeleted) {
      resetDeleteMutation();
      refetch();
    }
  }, [ruleIsDeleted, resetDeleteMutation, refetch]);

  useEffect(() => {
    if (ruleIsUpdated) {
      resetUpdateMutation();
      refetch();
    }
  }, [ruleIsUpdated, resetUpdateMutation, refetch]);

  useEffect(() => {
    if (ruleIsCreated) {
      resetCreateMutation();
      refetch();
    }
  }, [ruleIsCreated, resetCreateMutation, refetch]);
  // ---------------------------------------------------------

  // effect for choosing created rule after refetch rules list from server
  useEffect(() => {
    if (!isFetchingRulesList && rules && createdRule.id != 'create' && rules.some(r => r.id === createdRule.id)) {
      setCurrentRule(createdRule);
    }
  }, [isFetchingRulesList, rules, createdRule]);


  if (isGettingRulesList || isGettingGameTypes) return <Preloader />
  if (gettingRulesListError) return <SomeError error={gettingRulesListError} />
  if (ruleDeletingError) return <SomeError error={ruleDeletingError} />
  if (gettingGameTypesError) return <SomeError error={gettingGameTypesError} />
  if (!isGettingGameTypes && !gettingGameTypesError && !gameTypes) {
    return <SomeError error="Server error: no game types" />
  }

  async function createGame(formData) {
    // managing rules
    try {
      const ruleData = await syncRule(formData);
      setCreatedRule(ruleData);
    }
    catch (err) {
      setRulesResponseErrors(err);
      return;
    }

    console.log('continuing creating game process');
  }

  function syncRule(formData) {
    // makes creating or updating request to server, if needed
    // returns Promise, resolve will return rule object {id, title, description}
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

    return new Promise((resolve, reject) => resolve({ 
      id: formData.rules,
      title: FormData.rulesTitle,
      description: formData.rulesDescription,
      }));
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
    balanceWei={balanceWei}
    currentRule={currentRule}
  />
}

export default compose(withLoginOffer)(NewGameContainer);