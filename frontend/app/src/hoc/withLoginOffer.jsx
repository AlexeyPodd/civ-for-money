import { selectIsAuth } from "../redux/authSlice";
import LoginOffer from "../components/Offers/LoginOffer";
import { useSelector } from "react-redux";

export default function withLoginOffer(Component) {
  function LoginOfferComponent(props) {
    const isAuth = useSelector(selectIsAuth);

    if (!isAuth) return <LoginOffer />
    return <Component {...props} />
  }

  return LoginOfferComponent;
}