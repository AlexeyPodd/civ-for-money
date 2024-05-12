import MyGames from "./MyGames";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/authSlice";

export default function MyGamesContainer() {
  const isAuth = useSelector(selectIsAuth);
  return <MyGames isAuth={isAuth} />
}
