import { useParams } from "react-router-dom";

export default function UserGames() {
  const { uuid } = useParams();

  return (
    <div>UserGames ({uuid})</div>
  )
}
