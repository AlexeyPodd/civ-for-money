import GameTable from '../../components/GamesTables/GameTable';
import ButtonsBar from './ButtonsBar';
import WrongWalletWarningBanner from '../../components/Banners/WrongWalletWarningBanner';
import WalletIsNotConnectedBanner from '../../components/Banners/WalletIsNotConnectedBanner';
import { useDisclosure } from '@chakra-ui/react';
import KickModal from '../../components/Modals/EtherActionModals/KickModal';

export default function Game({
  uuid,
  serverGameData,
  isWalletConnected,
  onChainGameData,
  connectedWalletAddress,
  isArbiter,
  isBanned,
  gameID,
  refetch,
  contractAPI,
}) {
  const { isOpen: isKickModalOpen, onOpen: onKickModalOpen, onClose: onKickModalClose } = useDisclosure();

  const player2Joined = Boolean(serverGameData.player2);
  const isHost = uuid === serverGameData.host.uuid;
  const isPlayer2 = uuid === serverGameData.player2?.uuid;
  const walletIsWrong = isWalletConnected && (isHost && connectedWalletAddress != onChainGameData.host
    || isPlayer2 && connectedWalletAddress != onChainGameData.player2);

  return <>
    {!isWalletConnected && <WalletIsNotConnectedBanner />}
    {walletIsWrong
      && <WrongWalletWarningBanner
        rightAddress={isHost ? onChainGameData.host : onChainGameData.player2}
      />
    }
    {isWalletConnected
      && <ButtonsBar
        walletIsWrong={walletIsWrong}
        isHost={isHost}
        isPlayer2={isPlayer2}
        player2Joined={player2Joined}
        isArbiter={isArbiter}
        gameStarted={onChainGameData.started}
        disagreementReached={onChainGameData.disagreement}
      />
    }
    <GameTable
      walletIsWrong={walletIsWrong}
      isWalletConnected={isWalletConnected}
      serverGameData={serverGameData}
      onChainGameData={onChainGameData}
      isHost={isHost}
      player2Joined={player2Joined}
      isPlayer2={isPlayer2}
      gameStarted={onChainGameData.started}
      isBanned={isBanned}
      onKickModalOpen={onKickModalOpen}
    />
    <KickModal
      gameID={gameID}
      isOpen={isKickModalOpen}
      onClose={onKickModalClose}
      username={serverGameData.player2?.username}
      contractAPI={contractAPI}
      refetch={refetch}
    />
  </>
}
