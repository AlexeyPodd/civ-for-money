import { useDispatch, useSelector } from "react-redux";
import ClosedGamesTable from "../../components/GamesTables/ClosedGamesTable";
import { selectUUID } from "../../redux/authSlice";
import { clearUserGamesArchive, selectTotalUserGamesArchiveCount, selectUserGamesArchive, selectUserGamesArchivePageSize } from "../../redux/gamesSlice";
import { useGetUserClosedGamesQuery } from "../../redux/api";
import Preloader from "../../components/Preloader/Preloader";
import SomeError from "../../components/SomeError/SomeError";
import { useState } from "react";
import Paginator from "../../components/common/Paginator";
import NoGamesBanner from "../../components/Banners/NoGamesBanner";

export default function ClosedGamesTableContainer() {
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = useSelector(selectUserGamesArchivePageSize);

  const uuid = useSelector(selectUUID);

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

  if (totalGamesCount === 0) return <NoGamesBanner gamesKind='closed' />

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
