import { ethers } from 'ethers';
import DuelsV1 from '../artifacts/contracts/DuelsV1.sol/DuelsV1';
import { gameCancelEventEmitted, player2JoinedEventEmitted, slotFreedEventEmitted, victoryEventEmitted } from '../redux/gameSlice';


export default class DuelContractAPIManager {
  // class for interacting with on-chain contract,
  // getting specific game parameters form EVM storage and listening of this game on-chain events

  constructor(signer, gameIndex = null) {
    this.signer = signer;
    this.contract = new ethers.Contract(import.meta.env.VITE_DUELS_CONTRACT_ADDRESS, DuelsV1.abi, signer);
    this.gameIndex = gameIndex;
    this.lastEventBlockNumber = null; // needed for preventing to repeat of listener execution
  }

  async createGame(playPeriod, betValue) {
    const txn = await this.contract.createGame(playPeriod, { value: betValue });
    const receipt = await txn.wait();

    for (const log of receipt.logs) {
      const parsedLog = this.contract.interface.parseLog(log);
      if (parsedLog.name === "Created") {
        return Number(parsedLog.args.id);
      }
    }
  }

  async getGameData() {
    const data = await this.contract.games(this.gameIndex);
    const formattedData = {
      host: data.host.toLowerCase(),
      player2: data.player2.toLowerCase(),
      bet: Number(data.bet),
      timeStart: Number(data.timeStart) * 1_000,
      playPeriod: Number(data.playPeriod) * 1_000,
      started: data.started,
      closed: data.closed,
      disagreement: data.disagreement,
      hostVote: Number(data.hostVote),
      player2Vote: Number(data.player2Vote),
    }
    return formattedData;
  }

  async join() {
    const betValue = Number((await this.contract.games(this.gameIndex)).bet);

    const txn = await this.contract.join(this.gameIndex, { value: betValue });
    return await txn.wait();
  }

  async cancel() {
    return await this._executeMethod('cancel');
  }
  async excludePlayer2() {
    return await this._executeMethod('excludePlayer2');
  }
  async start() {
    return await this._executeMethod('start');
  }
  async voteResult(place) {
    return await this._executeMethod('voteResult', place);
  }
  async forceAppointWinner(winnerAddress) {
    return await this._executeMethod('forceAppointWinner', winnerAddress);
  }
  async forceDraw() {
    return await this._executeMethod('forceDraw');
  }

  async _executeMethod(methodName, ...args) {
    try {
      const txn = await this.contract[methodName](this.gameIndex, ...args);
      return await txn.wait();
    } catch (error) {
      console.error(`Error executing method ${methodName}:`, error);
      throw error;
    }
  }

  setEventListeners(dispatch, toast, onChainRefetch, getPlayer2DataByAddress) {
    this.contract.on("Joined", (id, player2, event) => {
      if (Number(id) === this.gameIndex && event.log.blockNumber != this.lastEventBlockNumber) {
        this.lastEventBlockNumber = event.log.blockNumber;
        toast({
          title: 'Player joined!',
          description: 'Some player has joined game.',
          status: 'warning',
          position: 'top',
          isClosable: true,
          duration: null,
        });
        dispatch(player2JoinedEventEmitted(player2));
        getPlayer2DataByAddress(player2);
      }
    });
    this.contract.on("SlotFreed", (id, event) => {
      if (Number(id) === this.gameIndex && event.log.blockNumber != this.lastEventBlockNumber) {
        this.lastEventBlockNumber = event.log.blockNumber;
        toast({
          title: 'Slot freed!',
          description: 'Seconds player quit or was kicked.',
          status: 'warning',
          position: 'top',
          isClosable: true,
          duration: null,
        });
        dispatch(slotFreedEventEmitted());
      }
    });
    this.contract.on("Cancel", (id, event) => {
      if (Number(id) === this.gameIndex && event.log.blockNumber != this.lastEventBlockNumber) {
        this.lastEventBlockNumber = event.log.blockNumber;
        toast({
          title: 'Game canceled!',
          description: 'Host has canceled game. All funds were returned to owners.',
          status: 'warning',
          position: 'top',
          isClosable: true,
          duration: null,
        });
        dispatch(gameCancelEventEmitted());
      }
    });
    this.contract.on("Start", (id, player2, event) => {
      if (Number(id) === this.gameIndex && event.log.blockNumber != this.lastEventBlockNumber) {
        this.lastEventBlockNumber = event.log.blockNumber;
        toast({
          title: 'Game started!',
          description: 'Participants will play, and then each of them shall contribute the result.',
          status: 'warning',
          position: 'top',
          isClosable: true,
          duration: null,
        });
        onChainRefetch();
      }
    });
    this.contract.on("Victory", (id, winner, event) => {
      if (Number(id) === this.gameIndex && event.log.blockNumber != this.lastEventBlockNumber) {
        this.lastEventBlockNumber = event.log.blockNumber;
        toast({
          title: 'The winner has been determined!',
          description: 'Game is finished now. Prize fund has been transferred to the winner.',
          status: 'warning',
          position: 'top',
          isClosable: true,
          duration: null,
        });
        dispatch(victoryEventEmitted(winner));
      }
    });
    this.contract.on("Draw", (id, event) => {
      if (Number(id) === this.gameIndex && event.log.blockNumber != this.lastEventBlockNumber) {
        this.lastEventBlockNumber = event.log.blockNumber;
        toast({
          title: 'Game ended in a draw!',
          description: 'There is no winner. Prize fund was divided equally.',
          status: 'warning',
          position: 'top',
          isClosable: true,
          duration: null,
        });
        onChainRefetch();
      }
    });
    this.contract.on("Disagreement", (id, event) => {
      if (Number(id) === this.gameIndex && event.log.blockNumber != this.lastEventBlockNumber) {
        this.lastEventBlockNumber = event.log.blockNumber;
        toast({
          title: 'Players reached disagreement!',
          description: 'The result will be decided by the arbitrator. But until the decision is made, players can change their vote.',
          status: 'warning',
          position: 'top',
          isClosable: true,
          duration: null,
        });
        onChainRefetch();
      }
    });
  }

  async removeAllListeners() {
    await this.contract.removeAllListeners();
  }
}