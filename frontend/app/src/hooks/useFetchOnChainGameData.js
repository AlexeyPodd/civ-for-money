import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { onChainGameDataFetched } from "../redux/gameSlice";

export default function useFetchOnChainGameData(contractAPI) {
  // hook for fetching game parameters from blockchain
  // refetching on contractAPI is changing ot force using refetch
  // isLoading === true only on initial fetching
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const contractAPIRef = useRef(contractAPI);

  useEffect(() => {
    contractAPIRef.current = contractAPI;
  }, [contractAPI]);

  async function fetchOnChainGameData(isInitialFetch) {
    setIsLoading(isInitialFetch);
    setError(null);
    try {
      if (contractAPIRef.current) {
        const data = await contractAPIRef.current.getGameData();
        dispatch(onChainGameDataFetched(data));
      } else {
        throw new Error('Contract API is not available');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (contractAPI) {
      fetchOnChainGameData(true);
    }
  }, [contractAPI]);

  const refetch = useCallback(() => {
    fetchOnChainGameData(false);
  }, [contractAPI]);

  return { isLoading, error, refetch };
}