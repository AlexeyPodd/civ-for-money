import { useDispatch, useSelector } from "react-redux";
import { selectAvatar, selectIsAuth, selectUsername, selectIsLoggingIn, setWalletConnected } from "../../../redux/authSlice";
import AuthBar from "./AuthBar";

import { useLogoutMutation } from "../../../redux/api";
import { SignerContext } from "../../../context/SignerContext";
import { useContext } from "react";


export default function AuthBarContainer() {
  const isAuth = useSelector(selectIsAuth);
  const username = useSelector(selectUsername);
  const avatar = useSelector(selectAvatar);
  const isLoggingIn = useSelector(selectIsLoggingIn);
  const { setSigner } = useContext(SignerContext);
  const dispatch = useDispatch();

  const [logoutTrigger, { isLoading: isLoggingOut }] = useLogoutMutation();

  async function logout() {
    logoutTrigger().unwrap()
      .then((response) => {
        if (response.logout_complete) {
          localStorage.removeItem("auth_token");
          setSigner(null);
          dispatch(setWalletConnected(false));
        }
      });
  }

  return <AuthBar
    isAuth={isAuth}
    avatar={avatar}
    username={username}
    logout={logout}
    isLoggingIn={isLoggingIn}
    isLoggingOut={isLoggingOut}
  />
}