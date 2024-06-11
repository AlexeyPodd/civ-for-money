import { useContext, useEffect, useState } from "react";
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

  const [registerUserWallet, { error, isError, isSuccess, isLoading: isRegistering }] = useRegisterUserWalletMutation();

  const [isConnecting, setIsConnecting] = useState(false);

  async function initializeSigner() {
    setIsConnecting(true);
    let accounts = [];
    try {
      accounts = await provider.send('eth_requestAccounts', []);
    }
    catch (err) {
      console.error(err);
    }
    await onAccountChange(accounts);
    window.ethereum.on('accountsChanged', onAccountChange);
  }

  function disconnect() {
    dispatch(setWalletConnected(false));
    setSigner(null);
    window.ethereum.removeAllListeners();
  }

  async function connect() {
    setIsConnecting(true);
    dispatch(setWalletConnected(false));
    const s = await provider.getSigner();
    setSigner(s);

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
    setIsConnecting(false);
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

  useEffect(() => {
    if (isSuccess) {
      dispatch(setWalletConnected(true));
    }
  }, [isSuccess]);

  return <EtherConnector
    walletConnected={walletConnected}
    isRegistering={isRegistering}
    etherAddress={signer && signer.address.toLowerCase()}
    disconnect={disconnect}
    initializeSigner={initializeSigner}
    isConnecting={isConnecting}
  />
}