import { useDispatch, useSelector } from "react-redux";
import { clearUserGamesArchive, selectTotalUserGamesArchiveCount, selectUserGamesArchive, selectUserGamesArchivePageSize } from "../../../redux/gamesSlice";
import { useGetUserClosedGamesQuery } from "../../../redux/api";
import Preloader from "../../Preloader/Preloader";
import SomeError from "../../SomeError/SomeError";
import { useState } from "react";
import Paginator from "../../common/Paginator";
import NoGamesBanner from "../../Banners/NoGamesBanner";
import ClosedGamesTable from "./ClosedGamesTable";

export default function ClosedGamesTableContainer({ uuid, isOwnGames }) {
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = useSelector(selectUserGamesArchivePageSize);

  const { isLoading, error } = useGetUserClosedGamesQuery(
    { uuid, pageNumber, pageSize },
    { refetchOnMountOrArgChange: true },
  );
  const games = useSelector(selectUserGamesArchive);
  const totalGamesCount = useSelector(selectTotalUserGamesArchiveCount);

  function changePage(pN) {
    dispatch(clearUserGamesArchive());
    setPageNumber(pN);
  }

  if (isLoading) return <Preloader />
  if (error) return <SomeError error={error} />

  if (totalGamesCount === 0) return <NoGamesBanner gamesKind='closed' isOwnGames={isOwnGames} />

  return <>
    <ClosedGamesTable games={games} />
    <Paginator
      currentPageNumber={pageNumber}
      pageSize={pageSize}
      totalItemsCount={totalGamesCount}
      onPageChange={changePage}
    />
  </>
}
