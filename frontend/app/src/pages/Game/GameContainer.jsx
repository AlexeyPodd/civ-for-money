import Game from './Game';
import { useContext, useState } from "react";
import { SignerContext } from "../../context/SignerContext";
import { useParams } from 'react-router-dom';
import { useGetGameQuery } from '../../redux/api';
import Preloader from '../../components/Preloader/Preloader';
import { useSelector } from 'react-redux';
import { selectServerGameData } from '../../redux/gameSlice';
import SomeError from '../../components/SomeError/SomeError';
import { useEffect } from 'react';
import DuelContractAPIManager from '../../ethereumAPI/api';
import withLoginOffer from "../../hoc/withLoginOffer";
import withConnectWalletOffer from "../../hoc/withConnectWalletOffer";
import { compose } from "@reduxjs/toolkit";

function GameContainer() {
  const { signer } = useContext(SignerContext);
  const { gameID } = useParams();

  // fetching game data from server
  const { error, isLoading, isSuccess } = useGetGameQuery(gameID);
  const serverGameData = useSelector(selectServerGameData);

  // fetching game data from EVM
  const [onChainGameData, setOnChainGameData] = useState();
  useEffect(() => {
    if (signer && gameID) {
      async function fetchOnChainGameData() {
        const contractAPI = new DuelContractAPIManager(signer, Number(gameID));
        const data = await contractAPI.getGameData();
        const formattedData = {
          bet: data.bet,
          timeStart: data.timeStart,
          playPeriod: data.playPeriod,
          started: data.started,
          closed: data.closed,
          disagreement: data.disagreement,
          hostVote: data.hostVote,
          player2Vote: data.player2Vote,
        };
        setOnChainGameData(formattedData);
      }

      fetchOnChainGameData();
    }
  }, [signer, gameID]);

  if (isLoading || !onChainGameData) return <Preloader />
  if (error) return <SomeError error={error} />

  return <Game
    game={{
      ...serverGameData,
      host: serverGameData.host.owner,
      player2: serverGameData.player2?.owner,
      ...onChainGameData
    }}
  />
}

export default compose(withLoginOffer, withConnectWalletOffer)(GameContainer);