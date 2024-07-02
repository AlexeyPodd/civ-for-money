import Game from './Game';
import { useContext, useRef, useState } from "react";
import { SignerContext } from "../../context/SignerContext";
import { useParams } from 'react-router-dom';
import { useGetGameQuery, useLazyGetAnotherUserDataByAddressQuery, useUpdateGameMutation } from '../../redux/api';
import Preloader from '../../components/Preloader/Preloader';
import { useDispatch, useSelector } from 'react-redux';
import { selectOnChanGameData, selectServerGameData } from '../../redux/gameSlice';
import SomeError from '../../components/SomeError/SomeError';
import withLoginOffer from "../../hoc/withLoginOffer";
import useFetchOnChainGameData from '../../hooks/useFetchOnChainGameData';
import { selectBanned, selectIsArbiter, selectUUID } from '../../redux/authSlice';
import { ToastContext } from '../../context/ToastContext';
import { useEffect } from 'react';
import DuelContractAPIManager from '../../ethereumAPI/api';


function GameContainer() {
  const toast = useContext(ToastContext);

  const dispatch = useDispatch();

  const { signer } = useContext(SignerContext);
  const [contractAPI, setContractAPI] = useState();
  const contractAPIRef = useRef();
  const { gameID } = useParams();
  const uuid = useSelector(selectUUID);
  const isArbiter = useSelector(selectIsArbiter);
  const isBanned = useSelector(selectBanned);

  // fetching game data from server
  const { error, isLoading } = useGetGameQuery(gameID);
  const serverGameData = useSelector(selectServerGameData);

  // updating data on server from EVM
  const [synchronize, { isLoading: isUpdating, error: updatingError }] = useUpdateGameMutation();

  // fetching game data from EVM
  const {
    isLoading: isFetchingOnChainData,
    error: onChainError,
    refetch: onChainRefetch,
  } = useFetchOnChainGameData(contractAPI);
  const onChainGameData = useSelector(selectOnChanGameData);

  // getting user data from server on joined event emitted
  const [getPlayer2DataByAddress, { isLoading: isGettingPlayer2ByAddress, error: gettingPlayer2ByAddressError }] = useLazyGetAnotherUserDataByAddressQuery();

  // variants of interactions with smart contract
  const [interactionVariants, setInteractionVariants] = useState();
  const [chosenMethod, setChosenMethod] = useState();

  useEffect(() => {
    if (contractAPI && Object.keys(onChainGameData).length > 0) {
      setInteractionVariants({
        join: {
          title: 'Join game.',
          method: contractAPI?.join.bind(contractAPI),
          args: [],
          possible_event: 'Joined',
        },
        kick: {
          title: `Kick ${serverGameData?.player2?.username}.`,
          method: contractAPI?.excludePlayer2.bind(contractAPI),
          args: [],
          possible_event: 'SlotFreed',
        },
        quit: {
          title: "Quit game.",
          method: contractAPI?.excludePlayer2.bind(contractAPI),
          args: [],
          possible_event: 'SlotFreed',
        },
        start: {
          title: "Start game.",
          method: contractAPI?.start.bind(contractAPI),
          args: [],
          possible_event: 'Start',
        },
        cancel: {
          title: "Cancel game.",
          method: contractAPI?.cancel.bind(contractAPI),
          args: [],
          event: 'Cancel',
        },
        voteVictory: {
          title: "Vote for your victory.",
          method: contractAPI?.voteResult.bind(contractAPI),
          args: [1],
          possible_event: 'Victory',
        },
        voteLoss: {
          title: "Vote for your loss.",
          method: contractAPI?.voteResult.bind(contractAPI),
          args: [2],
          possible_event: 'Victory',
        },
        voteDraw: {
          title: "Vote for draw.",
          method: contractAPI?.voteResult.bind(contractAPI),
          args: [3],
          possible_event: 'Draw',
        },
        declareHostWinner: {
          title: "Declare the game host the winner.",
          method: contractAPI?.forceAppointWinner.bind(contractAPI),
          args: [onChainGameData.host],
          possible_event: 'Victory',
        },
        decarePlayer2Winner: {
          title: "Declare second player the winner.",
          method: contractAPI?.forceAppointWinner.bind(contractAPI),
          args: [onChainGameData.player2],
          possible_event: 'Victory',
        },
        declareDraw: {
          title: "Declare a draw.",
          method: contractAPI?.forceDraw.bind(contractAPI),
          args: [],
          possible_event: 'Draw',
        },
      });
    }
  }, [contractAPI, onChainGameData]);

  function synchronizeGameData() {
    synchronize({ gameID });
  }

  // setting contract api, if there is signer and id of game to interact;
  // also setting on-chain event listeners
  useEffect(() => {
    if (signer && gameID) {
      async function createContractAPI(signer, gameID) {
        if (contractAPIRef.current) {
          contractAPIRef.current.removeAllListeners();
        }

        const newContractAPI = new DuelContractAPIManager(signer, Number(gameID));
        await newContractAPI.setEventListeners(dispatch, toast, getPlayer2DataByAddress);
        setContractAPI(newContractAPI);
        contractAPIRef.current = newContractAPI;
      }
      createContractAPI(signer, gameID);

    } else if (contractAPIRef.current) {
      setContractAPI(null);
      contractAPIRef.current = null;
    }

    return () => {
      if (contractAPIRef.current) {
        contractAPIRef.current.removeAllListeners();
      }
    };
  }, [signer, gameID, dispatch, toast]);

  if (isLoading || isFetchingOnChainData || isUpdating) return <Preloader />
  if (error) return <SomeError error={error} />
  if (onChainError) return <SomeError error={onChainError} />
  if (updatingError) return <SomeError error={updatingError} />
  if (gettingPlayer2ByAddressError) return <SomeError error={gettingPlayer2ByAddressError} />

  return <Game
    uuid={uuid}
    serverGameData={serverGameData}
    onChainGameData={onChainGameData}
    isWalletConnected={Boolean(signer)}
    connectedWalletAddress={signer?.address.toLowerCase()}
    isArbiter={isArbiter}
    isBanned={isBanned}
    gameID={gameID}
    refetch={onChainRefetch}
    interactionVariants={interactionVariants}
    chosenMethod={chosenMethod}
    setChosenMethod={setChosenMethod}
    synchronizeGameData={synchronizeGameData}
    isGettingPlayer2ByAddress={isGettingPlayer2ByAddress}
  />
}

export default withLoginOffer(GameContainer);