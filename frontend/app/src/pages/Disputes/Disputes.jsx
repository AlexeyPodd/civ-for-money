import { useDispatch, useSelector } from "react-redux";
import { selectIsArbiter } from "../../redux/authSlice";
import Page404 from "../Page404";
import { useGetDisputedGamesQuery } from "../../redux/api";
import { useState } from "react";
import { selectDisputeGames, selectTotalDisputeGamesCount, selectUserGamesPageSize } from "../../redux/gamesSlice";
import DisputedGamesTable from "../../components/GamesTables/DisputedGamesTable";
import Paginator from "../../components/common/Paginator";
import Preloader from "../../components/Preloader/Preloader";
import SomeError from "../../components/SomeError/SomeError";
import NoGamesBanner from "../../components/Banners/NoGamesBanner";

export default function Disputes() {
  const isArbiter = useSelector(selectIsArbiter);

  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = useSelector(selectUserGamesPageSize);

  const { isLoading, error } = useGetDisputedGamesQuery(
    { pageNumber, pageSize },
    { refetchOnMountOrArgChange: true },
  );

  const games = useSelector(selectDisputeGames);
  const totalGamesCount = useSelector(selectTotalDisputeGamesCount);

  function changePage(pN) {
    dispatch(clearDisputeGames());
    setPageNumber(pN);
  }

  if (!isArbiter) return <Page404 />
  if (isLoading) return <Preloader />
  if (error) return <SomeError error={error} />

  if (totalGamesCount === 0) return <NoGamesBanner gamesKind='disputed' isOwnGames={true} />

  return (
    <>
      <DisputedGamesTable games={games} />
      <Paginator
        currentPageNumber={pageNumber}
        pageSize={pageSize}
        totalItemsCount={totalGamesCount}
        onPageChange={changePage}
      />
    </>
  )
}