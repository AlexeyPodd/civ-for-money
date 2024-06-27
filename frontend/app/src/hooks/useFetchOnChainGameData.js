import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onChainGameDataFetched } from "../redux/gameSlice";

export default function useFetchOnChainGameData(contractAPI) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchOnChainGameData() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contractAPI.getGameData();
      dispatch(onChainGameDataFetched(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (contractAPI) {
      fetchOnChainGameData();
    }
  }, [contractAPI]);

  const refetch = useCallback(() => {
    fetchOnChainGameData();
  }, [contractAPI]);

  return {isLoading, error, refetch};
}