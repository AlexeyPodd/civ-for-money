import NewGame from "./NewGame";
import withLoginOffer from "../../hoc/withLoginOffer";
import withConnectWalletOffer from "../../hoc/withConnectWalletOffer";
import withNotBanned from "../../hoc/withNotBanned";
import { compose } from "@reduxjs/toolkit";
import { useCreateGameMutation, useCreateRuleMutation, useDeleteRuleMutation, useGetGameTypesQuery, useGetUserRulesQuery, useUpdateRuleMutation } from "../../redux/api";
import Preloader from "../../components/Preloader/Preloader"
import SomeError from "../../components/SomeError/SomeError";
import { useContext, useEffect, useState } from "react";
import { SignerContext } from "../../context/SignerContext";
import { useDispatch, useSelector } from "react-redux";
import { selectRules } from "../../redux/rulesSlice";
import DuelContractAPIManager from "../../ethereumAPI/api";
import { gameCreatingFinished, gameCreatingStarted, selectIsCreatingGame } from "../../redux/gameSlice";
import { useDisclosure } from "@chakra-ui/react";

function NewGameContainer() {
  // server api
  const { error: gettingRulesListError, isLoading: isGettingRulesList } = useGetUserRulesQuery();
  const [deleteRule, { isSuccess: ruleIsDeleted, isLoading: ruleIsDeleting, error: ruleDeletingError }] = useDeleteRuleMutation();
  const { data: gameTypes, error: gettingGameTypesError, isLoading: isGettingGameTypes } = useGetGameTypesQuery();
  const [updateRule, { isLoading: isRuleUpdating }] = useUpdateRuleMutation();
  const [createRule, { isLoading: isRuleCreating }] = useCreateRuleMutation();
  const [registerGame, { isLoading: isGameRegistering, isSuccess: gameRegistered, isError: gameFailedToRegister }] = useCreateGameMutation();

  const isCreatingGame = useSelector(selectIsCreatingGame);
  const dispatch = useDispatch();

  const rules = useSelector(selectRules);

  const [responseErrors, setResponseErrors] = useState({});

  const [chosenRuleID, setChosenRuleID] = useState();
  const [onChainGameIndex, setOnChainGameIndex] = useState(-1);

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  // states for visualization of game creating process statuses
  const [settingRulesSuccess, setSettingRulesSuccess] = useState(false);
  const [settingRulesError, setSettingRulesError] = useState(false);
  const [isCreatingOnChain, setIsCreatingOnChain] = useState(false);
  const [isCreatingOnChainSuccess, setIsCreatingOnChainSuccess] = useState(false);
  const [isCreatingOnChainError, setIsCreatingOnChainError] = useState(false);

  const { signer } = useContext(SignerContext);
  const [balanceWei, setBalanceWei] = useState();

  useEffect(() => {
    async function getBalance() {
      setBalanceWei(await signer.provider.getBalance(signer.address));
    }
    getBalance();
  }, [signer]);

  // Effect for enabling form after game created
  useEffect(() => {
    if (gameRegistered || gameFailedToRegister) {
      dispatch(gameCreatingFinished());
    }
  }, [gameRegistered, gameFailedToRegister]);

  if (isGettingRulesList || isGettingGameTypes) return <Preloader />
  if (gettingRulesListError) return <SomeError error={gettingRulesListError} />
  if (ruleDeletingError) return <SomeError error={ruleDeletingError} />
  if (gettingGameTypesError) return <SomeError error={gettingGameTypesError} />
  if (!isGettingGameTypes && !gettingGameTypesError && !gameTypes) {
    return <SomeError error="Server error: no game types" />
  }

  // main submit function
  async function createGame(formData) {
    // opening modal window with process statuses
    onModalOpen();

    //refreshing statuses states
    dispatch(gameCreatingStarted());
    setSettingRulesSuccess(false);
    setSettingRulesError(false);
    setIsCreatingOnChain(false);
    setIsCreatingOnChainSuccess(false);
    setIsCreatingOnChainError(false);

    // managing rules
    let ruleData;
    try {
      ruleData = await syncRule(formData);
      setChosenRuleID(ruleData.id);
      setSettingRulesSuccess(true);
    }
    catch (err) {
      setRulesResponseErrors(err);
      dispatch(gameCreatingFinished());
      setSettingRulesError(true);
      return;
    }

    // creating new game instance in smart contract
    setIsCreatingOnChain(true);
    const contractAPI = new DuelContractAPIManager(signer);
    let newGameID;
    try {
      newGameID = await contractAPI.createGame(
        formData.playPeriod * formData.playPeriodType,
        formData.bet * 10 ** formData.betDenomination,
      );
      setOnChainGameIndex(newGameID);
      setIsCreatingOnChainSuccess(true);
      setIsCreatingOnChain(false);
    }
    catch (err) {
      console.error(err);
      dispatch(gameCreatingFinished());
      setIsCreatingOnChainError(true);
      setIsCreatingOnChain(false);
      return;
    }

    // registering created game on server
    registerGame({
      title: formData.title,
      game: formData.game,
      rules: ruleData.id,
      game_index: newGameID
    });
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
    isCreatingGame={isCreatingGame}
    isSettingRules={isRuleCreating || isRuleUpdating}
    settingRulesSuccess={settingRulesSuccess}
    settingRulesError={settingRulesError}
    isCreatingOnChain={isCreatingOnChain}
    isCreatingOnChainSuccess={isCreatingOnChainSuccess}
    isCreatingOnChainError={isCreatingOnChainError}
    isGameRegistering={isGameRegistering}
    gameRegistered={gameRegistered}
    gameFailedToRegister={gameFailedToRegister}
    onChainGameIndex={onChainGameIndex}
    isModalOpen={isModalOpen}
    onModalClose={onModalClose}
  />
}

export default compose(
  withLoginOffer,
  withNotBanned,
  withConnectWalletOffer,
)(NewGameContainer);