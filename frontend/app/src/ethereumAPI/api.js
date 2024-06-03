import { ethers } from 'ethers';
import DuelsV1 from '../artifacts/contracts/DuelsV1.sol/DuelsV1';


export default class DuelContractAPIManager {
  constructor(signer, gameIndex = null) {
    this.signer = signer;
    this.contract = new ethers.Contract(import.meta.env.VITE_DUELS_CONTRACT_ADDRESS, DuelsV1.abi, signer.provider);
    this.gameIndex = gameIndex;
  }

  async createGame(playPeriod, betValue) {
    const txn = await this.contract.connect(this.signer)
      .createGame(playPeriod, { value: betValue });
    const receipt = await txn.wait();

    for (const log of receipt.logs) {
      const parsedLog = this.contract.interface.parseLog(log);
      if (parsedLog.name === "Created") {
        return Number(parsedLog.args.id);
      }
    }
  }

  // async join() {
  //   const betValue = await this.contract.bet();

  //   const txn = await this.contract.connect(this.signer).join({ value: betValue });
  //   return await txn.wait();
  // }

  // async cancel() {
  //   return this._executeMethod('cancel');
  // }
  // async excludePlayer2() {
  //   return this._executeMethod('excludePlayer2');
  // }
  // async start() {
  //   return this._executeMethod('start');
  // }
  // async voteForDraw() {
  //   return this._executeMethod('voteForDraw');
  // }
  // async forceDraw() {
  //   return this._executeMethod('forceDraw');
  // }
  // async voteForPlace(place) {
  //   return this._executeMethod('voteForPlace', place);
  // }
  // async forceAppointWinner(winnerAddress) {
  //   return this._executeMethod('forceAppointWinner', winnerAddress);
  // }

  // async _executeMethod(methodName, ...args) {
  //   const txn = await this.contract.connect(this.signer)[methodName](this.gameIndex, ...args);
  //   return await txn.wait();
  // }
}
