
import { useEffect, useState } from 'react';
import GameTable from '../../components/GamesTables/GameTable'
import ButtonsBar from './ButtonsBar'
import { useSelector } from 'react-redux';
import { selectUUID } from '../../redux/authSlice';
import WrongWalletWarningBanner from '../../components/Banners/WrongWalletWarningBanner';

export default function Game({ serverGameData, onChainGameData, connectedWalletAddress }) {
  const uuid = useSelector(selectUUID);

  const [walletIsWrong, setWalletIsWrong] = useState(false);

  const [player2Joined, setPlayer2Joined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [isPlayer2, setIsPlayer2] = useState(false);
  const [isArbiter, setIsArbiter] = useState(false);

  useEffect(() => {
    setPlayer2Joined(Boolean(serverGameData.player2));
  }, [serverGameData.player2]);
  useEffect(() => {
    setIsHost(uuid === serverGameData.host.uuid);
  }, [uuid, serverGameData.host.uuid]);
  useEffect(() => {
    setIsPlayer2(uuid === serverGameData.player2?.uuid);
  }, [uuid, serverGameData.player2]);
  useEffect(() => {
    setIsArbiter(connectedWalletAddress === import.meta.env.VITE_ARBITER_ADDRESS.toLowerCase());
  }, [connectedWalletAddress]);

  useEffect(() => {
    setWalletIsWrong(
      isHost && connectedWalletAddress != onChainGameData.host
      || isPlayer2 && connectedWalletAddress != onChainGameData.player2
    );
  }, [isHost, isPlayer2, connectedWalletAddress, onChainGameData.host, onChainGameData.player2]);


  return <>
    {walletIsWrong && <WrongWalletWarningBanner
     rightAddress={isHost ? onChainGameData.host : onChainGameData.player2} 
     />}
    <ButtonsBar
      walletIsWrong={walletIsWrong}
      isHost={isHost}
      isPlayer2={isPlayer2}
      player2Joined={player2Joined}
      isArbiter={isArbiter}
      gameStarted={onChainGameData.started}
      disagreementReached={onChainGameData.disagreement}
    />
    <GameTable
      walletIsWrong={walletIsWrong}
      serverGameData={serverGameData}
      onChainGameData={onChainGameData}
      isHost={isHost}
      player2Joined={player2Joined}
      isPlayer2={isPlayer2}
      gameStarted={onChainGameData.started}
    />
  </>
}
