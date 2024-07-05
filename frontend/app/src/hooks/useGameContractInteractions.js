import { useEffect, useState } from "react";

export default function useGameContractInteractions(contractAPI, onChainGameData, serverGameData) {
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
  }, [contractAPI, onChainGameData, serverGameData]);

  return { interactionVariants, chosenMethod, setChosenMethod }
}
