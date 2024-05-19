import { selectWalletConnected } from "../redux/authSlice";
import ConnectWalletOffer from "../components/Offers/ConnectWalletOffer";
import { useSelector } from "react-redux";

export default function withConnectWallet(Component) {
  function ConnectWalletOfferComponent(props) {
    const walletConnected = useSelector(selectWalletConnected);

    if (!walletConnected) return <ConnectWalletOffer />
    return <Component {...props} />
  }

  return ConnectWalletOfferComponent;
}