import BannedBanner from "../components/Banners/BannedBanner";
import { selectBanned } from "../redux/authSlice";
import { useSelector } from "react-redux";

export default function withNotBanned(Component) {
  function NotBannedComponent(props) {
    const banned = useSelector(selectBanned);

    if (banned) return <BannedBanner />
    return <Component {...props} />
  }

  return NotBannedComponent;
}