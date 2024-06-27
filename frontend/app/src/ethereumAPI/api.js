import { ethers } from 'ethers';
import DuelsV1 from '../artifacts/contracts/DuelsV1.sol/DuelsV1';


export default class DuelContractAPIManager {
  constructor(signer, gameIndex = null) {
    this.signer = signer;
    this.contract = new ethers.Contract(import.meta.env.VITE_DUELS_CONTRACT_ADDRESS, DuelsV1.abi, signer);
    this.gameIndex = gameIndex;
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

  async addEventListener(event, listener) {
    this.contract.on(event, listener);
  }
  async removeEventListener(event, listener) {
    this.contract.off(event, listener);
  }

  async join() {
    const betValue = await this.contract.bet();

    const txn = await this.contract.join({ value: betValue });
    return await txn.wait();
  }

  async cancel() {
    return this._executeMethod('cancel');
  }
  async excludePlayer2() {
    return this._executeMethod('excludePlayer2');
  }
  async start() {
    return this._executeMethod('start');
  }
  async voteForDraw() {
    return this._executeMethod('voteForDraw');
  }
  async forceDraw() {
    return this._executeMethod('forceDraw');
  }
  async voteForPlace(place) {
    return this._executeMethod('voteForPlace', place);
  }
  async forceAppointWinner(winnerAddress) {
    return this._executeMethod('forceAppointWinner', winnerAddress);
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