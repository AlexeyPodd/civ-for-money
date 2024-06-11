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
        const formattedData = {
          host: data.host.toLowerCase(),
          player2: data.player2.toLowerCase(),
          bet: Number(data.bet),
          timeStart: Number(data.timeStart),
          playPeriod: Number(data.playPeriod),
          started: data.started,
          closed: data.closed,
          disagreement: data.disagreement,
          hostVote: Number(data.hostVote),
          player2Vote: Number(data.player2Vote),
        }
        dispatch(onChainGameDataFetched(formattedData));
        setIsFetchingOnChainGameData(false);
      }

      fetchOnChainGameData();
    }
  }, [signer, gameID]);

  return isFetchingOnChainGameData;
}