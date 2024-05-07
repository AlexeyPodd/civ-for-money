import { useSelector } from "react-redux";
import { selectAvatar, selectIsAuth, selectUsername } from "../../../redux/authSlice";
import AuthBar from "./AuthBar";
import createSteamLoginLink from "../../../utils/createSteamLoginLink";
import { useLogoutMutation } from "../../../redux/api";


export default function AuthBarContainer() {
  const isAuth = useSelector(selectIsAuth);
  const username = useSelector(selectUsername);
  const avatar = useSelector(selectAvatar);

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
    steamLink={createSteamLoginLink()}
    isAuth={isAuth}
    avatar={avatar}
    username={username}
    logout={logout}
    isLoggingOut={isLoggingOut}
  />
}