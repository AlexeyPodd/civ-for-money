import GameTable from '../../components/GamesTables/GameTable';
import ButtonsBar from './ButtonsBar';
import WrongWalletWarningBanner from '../../components/Banners/WrongWalletWarningBanner';
import WalletIsNotConnectedBanner from '../../components/Banners/WalletIsNotConnectedBanner';
import { Button, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import OnChainInteractionModal from '../../components/Modals/OnChainInteractionModal';
import { RepeatClockIcon } from '@chakra-ui/icons';

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
  interactionVariants,
  chosenMethod,
  setChosenMethod,
  synchronizeGameData,
  isGettingPlayer2ByAddress,
}) {

  const { isOpen, onOpen, onClose } = useDisclosure();

  const player2Joined = Boolean(serverGameData.player2 || isGettingPlayer2ByAddress);
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
        gameClosed={onChainGameData.closed}
        disagreementReached={onChainGameData.disagreement}
        onModalOpen={onOpen}
        setChosenMethod={setChosenMethod}
      />
    }
    <HStack mt='10px' justify='center'>
      <Spacer />
      <Button
        onClick={synchronizeGameData}
        leftIcon={<RepeatClockIcon />}
        colorScheme="green"
        variant="outline"
      >Refresh</Button>
    </HStack>
    <GameTable
      walletIsWrong={walletIsWrong}
      isWalletConnected={isWalletConnected}
      serverGameData={serverGameData}
      onChainGameData={onChainGameData}
      isHost={isHost}
      player2Joined={player2Joined}
      isPlayer2={isPlayer2}
      gameStarted={onChainGameData.started}
      gameClosed={onChainGameData.closed}
      isBanned={isBanned}
      onModalOpen={onOpen}
      setChosenMethod={setChosenMethod}
      isGettingPlayer2ByAddress={isGettingPlayer2ByAddress}
    />
    <OnChainInteractionModal
      gameID={gameID}
      isOpen={isOpen}
      onClose={onClose}
      refetch={refetch}
      modalTitle={interactionVariants && interactionVariants[chosenMethod]?.title}
      contractMethod={interactionVariants && interactionVariants[chosenMethod]?.method}
      contractMethodArgs={interactionVariants && interactionVariants[chosenMethod]?.args}
      possibleEventType={interactionVariants && interactionVariants[chosenMethod]?.possible_event}
    />
  </>
}
