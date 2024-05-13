import MyGames from "./MyGames";
import withLoginOffer from "../../hoc/withLoginOffer";

function MyGamesContainer() {
  return <MyGames />
}

export default withLoginOffer(MyGamesContainer);