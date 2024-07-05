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
import useGameContractInteractions from '../../hooks/useGameContractInteractions';


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
  const { error, isLoading, refetch } = useGetGameQuery(gameID, { refetchOnMountOrArgChange: true });
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
  const [getPlayer2DataByAddress, { error: gettingPlayer2ByAddressError }] = useLazyGetAnotherUserDataByAddressQuery();

  // variants of interactions with smart contract
  const { interactionVariants, chosenMethod, setChosenMethod } = useGameContractInteractions(contractAPI, onChainGameData);

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
        newContractAPI.setEventListeners(
          dispatch,
          toast,
          onChainRefetch,
          getPlayer2DataByAddress
        );
        setContractAPI(newContractAPI);
        contractAPIRef.current = newContractAPI;
      }
      createContractAPI(signer, gameID);

    } else if (contractAPIRef.current) {
      setContractAPI(null);
      contractAPIRef.current = null;
      refetch();
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
    onChainRefetch={onChainRefetch}
    interactionVariants={interactionVariants}
    chosenMethod={chosenMethod}
    setChosenMethod={setChosenMethod}
    synchronizeGameData={synchronizeGameData}
  />
}

export default withLoginOffer(GameContainer);