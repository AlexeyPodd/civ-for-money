import Game from './Game';
import { useContext } from "react";
import { SignerContext } from "../../context/SignerContext";
import { useParams } from 'react-router-dom';
import { useGetGameQuery } from '../../redux/api';
import Preloader from '../../components/Preloader/Preloader';
import { useSelector } from 'react-redux';
import { selectOnChanGameData, selectServerGameData } from '../../redux/gameSlice';
import SomeError from '../../components/SomeError/SomeError';
import withLoginOffer from "../../hoc/withLoginOffer";
import withConnectWalletOffer from "../../hoc/withConnectWalletOffer";
import { compose } from "@reduxjs/toolkit";
import useFetchOnChainGameData from '../../hooks/useFetchOnChainGameData';
import { selectIsArbiter, selectUUID } from '../../redux/authSlice';


function GameContainer() {
  const { signer } = useContext(SignerContext);
  const { gameID } = useParams();
  const uuid = useSelector(selectUUID);
  const isArbiter = useSelector(selectIsArbiter);

  // fetching game data from server
  const { error, isLoading } = useGetGameQuery(gameID);
  const serverGameData = useSelector(selectServerGameData);

  // fetching game data from EVM
  const isFetchingOnChainData = useFetchOnChainGameData(signer, gameID);
  const onChainGameData = useSelector(selectOnChanGameData);

  if (isLoading || isFetchingOnChainData) return <Preloader />
  if (error) return <SomeError error={error} />

  return <Game
    uuid={uuid}
    serverGameData={serverGameData}
    onChainGameData={onChainGameData}
    connectedWalletAddress={signer.address.toLowerCase()}
    isArbiter={isArbiter}
  />
}

export default compose(withLoginOffer, withConnectWalletOffer)(GameContainer);