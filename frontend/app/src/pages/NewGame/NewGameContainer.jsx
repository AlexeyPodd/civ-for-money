import { useSelector } from "react-redux";
import NewGame from "./NewGame";
import { selectIsAuth } from "../../redux/authSlice";

export default function NewGameContainer() {
  const isAuth = useSelector(selectIsAuth);
  return <NewGame isAuth={isAuth} />
}
