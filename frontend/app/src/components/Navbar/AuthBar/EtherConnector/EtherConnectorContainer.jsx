import { useContext } from "react";
import { SignerContext } from "../../../../context/SignerContext";

import EtherConnector from "./EtherConnector";

import provider from '../../../../ethereumAPI/provider'


export default function EtherConnectorContainer() {
  const { signer, setSigner } = useContext(SignerContext);

  async function initializeSigner() {
    const accounts = await provider.send('eth_requestAccounts', []);
    await accountChange(accounts);
    window.ethereum.on('accountsChanged', accountChange);
  }

  function disconnect() {
    setSigner(null);
    window.ethereum.removeListener('accountsChanged', accountChange);
  }

  async function accountChange(accounts) {
    if (accounts.length === 0) {
      alert('You are not connected to Metamask.');
      disconnect();
    } else {
      setSigner(await provider.getSigner());
    }
  }

  return <EtherConnector
    signerIsSet={Boolean(signer)}
    etherAddress={signer && signer.address.toLowerCase()}
    initializeSigner={initializeSigner}
    disconnect={disconnect}    
  />
}