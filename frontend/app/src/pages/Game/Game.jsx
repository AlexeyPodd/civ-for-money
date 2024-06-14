
import { useContext } from 'react';
import GameTable from '../../components/GamesTables/GameTable'
import ButtonsBar from './ButtonsBar'

import WrongWalletWarningBanner from '../../components/Banners/WrongWalletWarningBanner';
import { Button } from '@chakra-ui/react';
import { ToastContext } from '../../context/ToastContext';

export default function Game({
  uuid,
  serverGameData,
  onChainGameData,
  connectedWalletAddress,
  isArbiter,
}) {
  const toast = useContext(ToastContext);

  const player2Joined = Boolean(serverGameData.player2);
  const isHost = uuid === serverGameData.host.uuid;
  const isPlayer2 = uuid === serverGameData.player2?.uuid;
  const walletIsWrong = isHost && connectedWalletAddress != onChainGameData.host
    || isPlayer2 && connectedWalletAddress != onChainGameData.player2;


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
    <Button onClick={() => toast({
      title: 'test toast',
      description: 'testing testing',
      status: 'warning',
      duration: 9000,
      isClosable: true,
      position: 'top',
    })}>toast</Button>
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
