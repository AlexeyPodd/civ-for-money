import { ethers } from 'ethers';
import DuelsV1 from '../artifacts/contracts/DuelsV1.sol/DuelsV1';
import { gameCancelEventEmitted, slotFreedEventEmitted } from '../redux/gameSlice';


export default class DuelContractAPIManager {
  constructor(signer, gameIndex = null) {
    this.signer = signer;
    this.contract = new ethers.Contract(import.meta.env.VITE_DUELS_CONTRACT_ADDRESS, DuelsV1.abi, signer);
    this.gameIndex = gameIndex;
    this.lastEventBlockNumber = null; // needed for preventing to repeat of listener execution
  }

  async setEventListeners(dispatch, toast, getPlayer2DataByAddress) {
    await this.contract.removeAllListeners();

    this.contract.on("Joined", (id, player2, event) => {
      if (Number(id) === this.gameIndex && event.log.blockNumber != this.lastEventBlockNumber) {
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
          description: 'Host has canceled game. All funds was returned to owners.',
          status: 'warning',
          position: 'top',
          isClosable: true,
          duration: null,
        });
        dispatch(gameCancelEventEmitted());
      }
    });
  }

  async removeAllListeners() {
    await this.contract.removeAllListeners();
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
      timeStart: Number(data.timeStart),
      playPeriod: Number(data.playPeriod),
      started: data.started,
      closed: data.closed,
      disagreement: data.disagreement,
      hostVote: Number(data.hostVote),
      player2Vote: Number(data.player2Vote),
    }
    return formattedData;
  }

  async join() {
    const betValue = await this.contract.bet();

    const txn = await this.contract.join({ value: betValue });
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
}