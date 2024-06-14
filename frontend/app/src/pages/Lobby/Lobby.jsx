import LobbyTable from "../../components/GamesTables/LobbyTable";
import { useGetLobbyGamesQuery } from "../../redux/api";
import Preloader from "../../components/Preloader/Preloader";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectLobbyGamesPageSize, selectLobbyGames, selectTotalGamesCount } from "../../redux/gamesSlice";
import Paginator from "../../components/common/Paginator";
import SomeError from "../../components/SomeError/SomeError";

export default function Lobby() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = useSelector(selectLobbyGamesPageSize);

  const { isLoading, error } = useGetLobbyGamesQuery(
    { pageNumber, pageSize },
    { refetchOnMountOrArgChange: true },
  );
  const games = useSelector(selectLobbyGames);
  const totalGamesCount = useSelector(selectTotalGamesCount);

  if (isLoading) return <Preloader />
  if (error) return <SomeError error={error} />

  return (
    <>
      <LobbyTable games={games} />
      <Paginator
        currentPageNumber={pageNumber}
        pageSize={pageSize}
        totalItemsCount={totalGamesCount}
        onPageChange={(pN) => setPageNumber(pN)}
      />
    </>
  )
}
