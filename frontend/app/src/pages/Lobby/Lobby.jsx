import LobbyTable from "../../components/GamesTables/LobbyTable";
import { useGetLobbyGamesQuery } from "../../redux/api";
import Preloader from "../../components/Preloader/Preloader";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLobbyGamesPageSize, selectLobbyGames, selectTotalGamesCount, clearLobbyGames } from "../../redux/gamesSlice";
import Paginator from "../../components/common/Paginator";
import SomeError from "../../components/SomeError/SomeError";
import { Button, HStack, Spacer } from "@chakra-ui/react";
import { RepeatClockIcon } from "@chakra-ui/icons";

export default function Lobby() {
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = useSelector(selectLobbyGamesPageSize);

  const { isLoading, error, refetch } = useGetLobbyGamesQuery(
    { pageNumber, pageSize },
    { refetchOnMountOrArgChange: true },
  );
  const games = useSelector(selectLobbyGames);
  const totalGamesCount = useSelector(selectTotalGamesCount);

  if (isLoading) return <Preloader />
  if (error) return <SomeError error={error} />

  function refreshLobby() {
    dispatch(clearLobbyGames());
    refetch();
  }

  function changeLobbyPage(pN) {
    dispatch(clearLobbyGames());
    setPageNumber(pN);
  }

  return (
    <>
      <LobbyTable games={games} />
      <HStack justify='center'>
      <Spacer />
        <Paginator
          currentPageNumber={pageNumber}
          pageSize={pageSize}
          totalItemsCount={totalGamesCount}
          onPageChange={changeLobbyPage}
        />
        <Spacer />
        <Button 
        onClick={refreshLobby} 
        leftIcon={<RepeatClockIcon />}
        colorScheme="green"
        variant="outline"
        >Refresh</Button>
      </HStack>
    </>
  )
}
