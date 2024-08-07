import { useContext, useEffect, useState } from "react";
import { SignerContext } from "../../../../context/SignerContext";

import EtherConnector from "./EtherConnector";

import provider from '../../../../ethereumAPI/provider';
import { useCheckUserWalletRegistrationMutation, useRegisterUserWalletMutation } from "../../../../redux/api";
import { useDispatch, useSelector } from "react-redux";
import { selectWalletConnected, setWalletConnected, setWalletDisconnected } from "../../../../redux/authSlice";
import { ToastContext } from "../../../../context/ToastContext";


export default function EtherConnectorContainer() {
  const toast = useContext(ToastContext);

  const { signer, setSigner } = useContext(SignerContext);

  const walletConnected = useSelector(selectWalletConnected);
  const dispatch = useDispatch();

  const [checkWalletRegistered, { isSuccess: checkWalletRegistrationSuccess }] = useCheckUserWalletRegistrationMutation();
  const [registerUserWallet, { error, isError, isSuccess: walletRegistrationSuccess, isLoading: isRegistering }] = useRegisterUserWalletMutation();

  const [isConnecting, setIsConnecting] = useState(false);

  async function initializeSigner() {
    // starting process of connection to browser wallet account, 
    // and subscribes to an event of changing account in wallet (or disconnect initialized from wallet interface)

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
    dispatch(setWalletDisconnected());
    setSigner(null);
    window.ethereum.removeAllListeners();
  }

  async function connect() {
    // connecting wallet process
    setIsConnecting(true);
    dispatch(setWalletDisconnected());
    const s = await provider.getSigner();
    setSigner(s);

    try {
      // checking is wallet registered on server
      await checkWalletRegistered(s.address).unwrap();
    } catch (error) {
      if (error.status === 404) {
        // signing message to proof server that user is owner of wallet address
        toast({
          title: 'Your wallet address is not registered on server.',
          description: 'Please sign message to proof that you are indeed an owner of this Ethereum address.',
          status: 'loading',
          duration: null,
          position: 'top',
        });
        const verifyAddressMessage = 'verify your address';
        let signature;
        try {
          signature = await s.signMessage(verifyAddressMessage);
        }
        catch (err) {
          console.error(err);
          toast.closeAll();
        }
        if (signature) registerUserWallet({
          message: verifyAddressMessage,
          signature: signature,
        });
      }
    }

    setIsConnecting(false);
  }

  async function onAccountChange(accounts) {
    // connecting to another wallet account if it's changed,
    // or disconnecting if wallet was disconnected from wallet interface
    if (accounts.length === 0) {
      disconnect();
    } else {
      await connect();
    }
  }

  function installMetamaskToast() {
    toast({
      title: 'Wallet is not installed',
      description: 'Please install Metamask to be able to interact with Ethereum.',
      status: 'error',
      isClosable: true,
      position: 'top',
    });
  }

  useEffect(() => {
    if (isError) {
      disconnect();
      toast.closeAll();
      toast({
        title: 'Error.',
        description: 'Some error occurs while registering wallet.',
        status: 'error',
        isClosable: true,
        position: 'top',
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (walletRegistrationSuccess || checkWalletRegistrationSuccess) {
      dispatch(setWalletConnected(signer.address.toLowerCase()));
      toast.closeAll();
    }
  }, [walletRegistrationSuccess, checkWalletRegistrationSuccess]);

  return <EtherConnector
    walletConnected={walletConnected}
    isRegistering={isRegistering}
    etherAddress={signer && signer.address.toLowerCase()}
    disconnect={disconnect}
    initializeSigner={initializeSigner}
    isConnecting={isConnecting}
    installMetamaskToast={installMetamaskToast}
  />
}