import { useSelector } from "react-redux";
import { selectAvatar, selectIsAuth, selectUsername, selectIsLoggingIn } from "../../../redux/authSlice";
import AuthBar from "./AuthBar";

import { useLogoutMutation } from "../../../redux/api";


export default function AuthBarContainer() {
  const isAuth = useSelector(selectIsAuth);
  const username = useSelector(selectUsername);
  const avatar = useSelector(selectAvatar);
  const isLoggingIn = useSelector(selectIsLoggingIn);

  const [logoutTrigger, { isLoading: isLoggingOut }] = useLogoutMutation();

  async function logout() {
    logoutTrigger().unwrap()
      .then((response) => {
        if (response.logout_complete) {
          localStorage.removeItem("auth_token");
        }
      })

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