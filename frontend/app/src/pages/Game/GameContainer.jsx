import Game from './Game';
import { useContext, useState } from "react";
import { SignerContext } from "../../context/SignerContext";
import { useParams } from 'react-router-dom';
import { useGetGameQuery } from '../../redux/api';
import Preloader from '../../components/Preloader/Preloader';
import { useSelector } from 'react-redux';
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

  const { signer } = useContext(SignerContext);
  const [contractAPI, setContractAPI] = useState();
  const { gameID } = useParams();
  const uuid = useSelector(selectUUID);
  const isArbiter = useSelector(selectIsArbiter);
  const isBanned = useSelector(selectBanned);

  // fetching game data from server
  const { error, isLoading, refetch } = useGetGameQuery(gameID);
  const serverGameData = useSelector(selectServerGameData);

  // fetching game data from EVM
  const {
    isLoading: isFetchingOnChainData,
    error: onChainError,
    refetch: onChainRefetch,
  } = useFetchOnChainGameData(contractAPI);
  const onChainGameData = useSelector(selectOnChanGameData);

  function refetchGameData() {
    refetch();
    onChainRefetch();
  }

  // setting contract api, if there is signer and id of game to interact
  useEffect(() => {
    if (signer && gameID) {
      setContractAPI(new DuelContractAPIManager(signer, Number(gameID)));
    } else {
      setContractAPI(null);
    }
  }, [signer, gameID]);

  if (isLoading || isFetchingOnChainData) return <Preloader />
  if (error) return <SomeError error={error} />
  if (onChainError) return <SomeError error={onChainError} />

  return <Game
    uuid={uuid}
    serverGameData={serverGameData}
    onChainGameData={onChainGameData}
    isWalletConnected={Boolean(signer)}
    connectedWalletAddress={signer?.address.toLowerCase()}
    isArbiter={isArbiter}
    isBanned={isBanned}
    gameID={gameID}
    refetch={refetchGameData}
    contractAPI={contractAPI}
  />
}

export default withLoginOffer(GameContainer);