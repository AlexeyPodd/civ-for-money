import NewGame from "./NewGame";
import withLoginOffer from "../../hoc/withLoginOffer";

function NewGameContainer() {
  return <NewGame />
}

export default withLoginOffer(NewGameContainer);