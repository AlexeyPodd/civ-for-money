import { useDispatch, useSelector } from "react-redux";
import ActualGamesTable from "../../components/GamesTables/ActualGamesTable";
import { selectUUID } from "../../redux/authSlice";
import { clearUserGames, selectTotalUserGamesCount, selectUserGames, selectUserGamesPageSize } from "../../redux/gamesSlice";
import { useGetUserActualGamesQuery } from "../../redux/api";
import Preloader from "../../components/Preloader/Preloader";
import SomeError from "../../components/SomeError/SomeError";
import Paginator from "../../components/common/Paginator";
import { useState } from "react";
import NoGamesBanner from "../../components/Banners/NoGamesBanner";

export default function ActualGamesTableContainer() {
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = useSelector(selectUserGamesPageSize);

  const uuid = useSelector(selectUUID);

  const { isLoading, error } = useGetUserActualGamesQuery(
    { uuid, pageNumber, pageSize },
    { refetchOnMountOrArgChange: true },
  );
  const games = useSelector(selectUserGames);
  const totalGamesCount = useSelector(selectTotalUserGamesCount);

  function changePage(pN) {
    dispatch(clearUserGames());
    setPageNumber(pN);
  }

  if (isLoading) return <Preloader />
  if (error) return <SomeError error={error} />

  if (totalGamesCount === 0) return <NoGamesBanner gamesKind='actual' />

  return <>
    <ActualGamesTable games={games} />
    <Paginator
      currentPageNumber={pageNumber}
      pageSize={pageSize}
      totalItemsCount={totalGamesCount}
      onPageChange={changePage}
    />
  </>
}
