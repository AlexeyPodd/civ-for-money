import Game from './Game';
import { useContext } from "react";
import { SignerContext } from "../../context/SignerContext";
import { useParams } from 'react-router-dom';

export default function GameContainer() {
  const { signer } = useContext(SignerContext);
  const { gameID } = useParams();

  return <Game
    gameID={gameID}
  />
}
