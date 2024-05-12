import { ethers } from 'ethers';
import Duel from '../artifacts/contracts/Duel.sol/Duel';


export default async function deploy(signer, arbiter, playPeriod, value) {
  const factory = new ethers.ContractFactory(
    Duel.abi,
    Duel.bytecode,
    signer,
  );
  return factory.deploy(arbiter, playPeriod, { value });
}
