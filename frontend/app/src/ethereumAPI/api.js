import { ethers } from 'ethers';
import Duel from '../artifacts/contracts/Duel.sol/Duel';


export default class DuelContractAPIManager {
  constructor(contractAddress, signer) {
    this.signer = signer;
    this.contract = new ethers.Contract(contractAddress, Duel.abi, signer.provider);
  }

  async join() {
    const betValue = await this.contract.bet();

    const txn = await this.contract.connect(this.signer).join({ value: betValue });
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
    const txn = await this.contract.connect(this.signer)[methodName](...args);
    return await txn.wait();
  }
}
