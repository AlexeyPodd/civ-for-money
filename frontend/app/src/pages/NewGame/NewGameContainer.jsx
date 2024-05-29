import NewGame from "./NewGame";
import withLoginOffer from "../../hoc/withLoginOffer";
import withConnectWalletOffer from "../../hoc/withConnectWalletOffer";
import { compose } from "@reduxjs/toolkit";
import { useCreateRuleMutation, useDeleteRuleMutation, useGetGameTypesQuery, useGetUserRulesQuery, useUpdateRuleMutation } from "../../redux/api";
import Preloader from "../../components/Preloader/Preloader"
import SomeError from "../../components/SomeError/SomeError";
import { useContext, useEffect, useState } from "react";
import { SignerContext } from "../../context/SignerContext";
import { useSelector } from "react-redux";
import { selectRules } from "../../redux/rulesSlice";
import deploy from "../../ethereumAPI/contractDeploy";

function NewGameContainer() {
  // server api
  const { error: gettingRulesListError, isLoading: isGettingRulesList } = useGetUserRulesQuery();
  const [deleteRule, { isSuccess: ruleIsDeleted, isLoading: ruleIsDeleting, error: ruleDeletingError, reset: resetDeleteMutation }] = useDeleteRuleMutation();
  const { data: gameTypes, error: gettingGameTypesError, isLoading: isGettingGameTypes } = useGetGameTypesQuery();
  const [updateRule] = useUpdateRuleMutation();
  const [createRule] = useCreateRuleMutation();

  const rules = useSelector(selectRules);

  const [responseErrors, setResponseErrors] = useState({});

  const [chosenRuleID, setChosenRuleID] = useState();

  const { signer } = useContext(SignerContext);
  const [balanceWei, setBalanceWei] = useState();

  useEffect(() => {
    async function getBalance() {
      setBalanceWei(await signer.provider.getBalance(signer.address));
    }
    getBalance();
  }, [signer]);

  if (isGettingRulesList || isGettingGameTypes) return <Preloader />
  if (gettingRulesListError) return <SomeError error={gettingRulesListError} />
  if (ruleDeletingError) return <SomeError error={ruleDeletingError} />
  if (gettingGameTypesError) return <SomeError error={gettingGameTypesError} />
  if (!isGettingGameTypes && !gettingGameTypesError && !gameTypes) {
    return <SomeError error="Server error: no game types" />
  }

  // main submit function
  async function createGame(formData) {
    // managing rules
    try {
      const ruleData = await syncRule(formData);
      setChosenRuleID(ruleData.id);
    }
    catch (err) {
      setRulesResponseErrors(err);
      return;
    }

    // deploying smart contract
    try {
      const contract = await deploy(
        signer,
        import.meta.env.VITE_ARBITER_ADDRESS,
        formData.playPeriod * formData.playPeriodType,
        formData.bet * 10 ** formData.betDenomination,
      );
      await contract.waitForDeployment();
    }
    catch (err) {
      console.error(err);
      return;
    }

    console.log(await contract.getAddress());

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
      id: Number(formData.rules),
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
    chosenRuleID={chosenRuleID}
  />
}

export default compose(withLoginOffer, withConnectWalletOffer)(NewGameContainer);