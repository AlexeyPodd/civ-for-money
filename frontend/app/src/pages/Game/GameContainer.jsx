import Game from './Game';
import { useContext } from "react";
import { SignerContext } from "../../context/SignerContext";
import { useParams } from 'react-router-dom';
import { useGetGameQuery } from '../../redux/api';
import Preloader from '../../components/Preloader/Preloader';
import { useSelector } from 'react-redux';
import { selectGame } from '../../redux/gameSlice';
import SomeError from '../../components/SomeError/SomeError';

export default function GameContainer() {
  const { signer } = useContext(SignerContext);
  const { gameID } = useParams();

  const { error, isLoading } = useGetGameQuery(gameID);

  const game = useSelector(selectGame);

  if (isLoading) return <Preloader />
  if (error) return <SomeError error={error} />

  return <Game
    game={game}
  />
}
