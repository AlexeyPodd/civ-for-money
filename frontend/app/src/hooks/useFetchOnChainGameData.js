import { useEffect, useState } from "react";
import DuelContractAPIManager from "../ethereumAPI/api";
import { useDispatch } from "react-redux";
import { onChainGameDataFetched } from "../redux/gameSlice";

export default function useFetchOnChainGameData(signer, gameID) {
  const dispatch = useDispatch();
  const [isFetchingOnChainGameData, setIsFetchingOnChainGameData] = useState(true);
  useEffect(() => {
    if (signer && gameID) {
      async function fetchOnChainGameData() {
        setIsFetchingOnChainGameData(true);
        const contractAPI = new DuelContractAPIManager(signer, Number(gameID));
        const data = await contractAPI.getGameData();
        dispatch(onChainGameDataFetched(data));
        setIsFetchingOnChainGameData(false);
      }

      fetchOnChainGameData();
    }
  }, [signer, gameID]);

  return isFetchingOnChainGameData;
}