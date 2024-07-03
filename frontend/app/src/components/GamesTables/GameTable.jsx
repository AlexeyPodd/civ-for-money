import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Image, Text } from "@chakra-ui/react";
import secondsDurationToRepresentation from "../../utils/secondsDurationToRepresentation";
import timestampToDateRepresentation from "../../utils/timestampToDateRepresentation";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GameTable({
  walletIsWrong,
  isWalletConnected,
  serverGameData,
  onChainGameData,
  isHost,
  player2Joined,
  isPlayer2,
  gameStarted,
  isBanned,
  onModalOpen,
  setChosenMethod,
}) {
  const navigate = useNavigate();

  // display winner from server source or from event, dispatched to onChainGameData
  const [winner, setWinner] = useState(null);
  useEffect(() => {
    if (serverGameData.winner) setWinner(serverGameData.winner)
    else if (onChainGameData.winner) {
      setWinner(onChainGameData.winner === serverGameData.host.address ? serverGameData.host : serverGameData.player2);
    }
  }, [serverGameData, onChainGameData])

  const votes = ["Not Voted", "Victory", "Loss", "Draw"]
  const onChainDataSource = isWalletConnected ? onChainGameData : serverGameData;

  function onMethodModalOpen(method) {
    setChosenMethod(method);
    onModalOpen();
  }

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Title</Td>
            <Td>{serverGameData.title}</Td>
          </Tr>
          <Tr>
            <Td>Game</Td>
            <Td>{serverGameData.game}</Td>
          </Tr>
          <Tr>
            <Td>Host</Td>
            <Td>
              <Button colorScheme="green" onClick={() => navigate(`/profile/${serverGameData.host.uuid}`)}>
                <Image borderRadius='full' src={serverGameData.host.avatar} alt='avatar' />
                <Text ms='10px'>{
                  serverGameData.host.username.length > 13
                    ? serverGameData.host.username.slice(0, 10) + "..."
                    : serverGameData.host.username
                }</Text>
              </Button>
            </Td>
          </Tr>
          <Tr>
            <Td>Second Player</Td>
            <Td>
              {player2Joined
                && (!serverGameData.player2
                  ? onChainGameData.player2
                  : <Button colorScheme="green" onClick={() => navigate(`/profile/${serverGameData.player2.uuid}`)}>
                    <Image borderRadius='full' src={serverGameData.player2.avatar} alt='avatar' />
                    <Text ms='10px'>{
                      serverGameData.player2.username.length > 13
                        ? serverGameData.player2.username.slice(0, 10) + "..."
                        : serverGameData.player2.username
                    }</Text>
                  </Button>
                )
              }
              {isWalletConnected && !player2Joined && !isHost
                && <>
                  <Button ms='5px' colorScheme="blue" isDisabled={isBanned} onClick={() => onMethodModalOpen("join")}>Join</Button>
                  {isBanned && <Text color='red'>Your account is banned!</Text>}
                </>
              }
              {isWalletConnected && player2Joined && isPlayer2 && !onChainDataSource.closed
                && <Button ms='5px' colorScheme="orange" isDisabled={walletIsWrong || gameStarted} onClick={() => onMethodModalOpen("quit")}>Quit</Button>
              }
              {isWalletConnected && player2Joined && isHost && !onChainDataSource.closed
                && <Button ms='5px' colorScheme="red" isDisabled={walletIsWrong || gameStarted} onClick={() => onMethodModalOpen("kick")}>Kick</Button>
              }
            </Td>
          </Tr>
          <Tr>
            <Td>Rules</Td>
            <Td><Text>{serverGameData.rules.description}</Text></Td>
          </Tr>
          <Tr>
            <Td>Bet Size</Td>
            <Td>{`${onChainDataSource.bet / 10 ** 18} ETH`}</Td>
          </Tr>
          <Tr>
            <Td>Status</Td>
            <Td>
              {!onChainDataSource.started && !player2Joined && !onChainDataSource.closed && "Waiting for second player to connect"}
              {!onChainDataSource.started && player2Joined && !onChainDataSource.closed && "Waiting for host to start the game"}
              {onChainDataSource.started && !onChainDataSource.closed && (isWalletConnected ? !onChainGameData.disagreement : serverGameData.dispute)
                && "The game is on now"}
              {onChainDataSource.started && !onChainDataSource.closed && (isWalletConnected ? onChainGameData.disagreement : serverGameData.dispute)
                && "Dispute about result"}
              {onChainDataSource.closed && onChainDataSource.started && "Game is finished"}
              {onChainDataSource.closed && !onChainDataSource.started && "Game was canceled"}
            </Td>
          </Tr>
          <Tr>
            <Td>Play & Voting Period Duration</Td>
            <Td>{secondsDurationToRepresentation((isWalletConnected ? onChainGameData.playPeriod : serverGameData.play_period) / 1_000)}</Td>
          </Tr>
          {onChainDataSource.started
            && <>
              <Tr>
                <Td>End of play & voting period</Td>
                <Td>{timestampToDateRepresentation(
                  (isWalletConnected ? onChainGameData.timeStart : serverGameData.time_start)
                  + (isWalletConnected ? onChainGameData.playPeriod : serverGameData.play_period)
                )}
                </Td>
              </Tr>
              <Tr>
                <Td>Host Vote</Td>
                <Td>{votes[isWalletConnected ? onChainGameData.hostVote : serverGameData.host_vote]}</Td>
              </Tr>
              <Tr>
                <Td>Second Player Vote</Td>
                <Td>{votes[isWalletConnected ? onChainGameData.player2Vote : serverGameData.player2_vote]}</Td>
              </Tr>
            </>}
          {onChainDataSource.started && onChainDataSource.closed
            && <Tr>
              <Td>Winner</Td>
              <Td>
                {winner
                  ? <Button colorScheme="green" onClick={() => navigate(`/profile/${winner.uuid}`)}>
                    <Image borderRadius='full' src={winner.avatar} alt='avatar' />
                    <Text ms='10px'>{
                      winner.username.length > 13
                        ? winner.username.slice(0, 10) + "..."
                        : winner.username
                    }</Text>
                  </Button>
                  : "Draw"
                }
              </Td>
            </Tr>}
        </Tbody>
      </Table>
    </TableContainer>
  )
}