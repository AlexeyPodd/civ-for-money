import { useContext, useEffect } from "react";
import { SignerContext } from "../../../../context/SignerContext";

import EtherConnector from "./EtherConnector";

import provider from '../../../../ethereumAPI/provider'
import { useRegisterUserWalletMutation } from "../../../../redux/api";
import { useDispatch, useSelector } from "react-redux";
import { selectWalletConnected, setWalletConnected } from "../../../../redux/authSlice";


export default function EtherConnectorContainer() {
  const { signer, setSigner } = useContext(SignerContext);

  const walletConnected = useSelector(selectWalletConnected);
  const dispatch = useDispatch();

  const [registerUserWallet, { error, isError, isLoading: isRegistering }] = useRegisterUserWalletMutation();

  async function initializeSigner() {
    let accounts = [];
    try {
      accounts = await provider.send('eth_requestAccounts', []);
    }
    catch (err) {
      console.error(err);
    }
    await onAccountChange(accounts);
  }

  function disconnect() {
    dispatch(setWalletConnected(false));
    setSigner(null);
    window.ethereum.removeListener('accountsChanged', onAccountChange);
  }

  async function connect() {
    const s = await provider.getSigner();
    setSigner(s);
    window.ethereum.on('accountsChanged', onAccountChange);

    const verifyAddressMessage = 'verify your address';
    let signature;
    try {
      signature = await s.signMessage(verifyAddressMessage);
    }
    catch (err) {
      console.error(err);
    }
    if (signature) registerUserWallet({
      message: verifyAddressMessage,
      signature: signature,
    });
  }

  async function onAccountChange(accounts) {
    if (accounts.length === 0) {
      disconnect();
    } else {
      await connect();
    }
  }

  useEffect(() => {
    if (isError) {
      disconnect();
      alert(`Status ${error.status}\n${error.data}`);
    }
  }, [isError, error]);

  return <EtherConnector
    walletConnected={walletConnected}
    isRegistering={isRegistering}
    etherAddress={signer && signer.address.toLowerCase()}
    initializeSigner={initializeSigner}
    disconnect={disconnect}
  />
}