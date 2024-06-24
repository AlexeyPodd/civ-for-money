import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Image, Text } from "@chakra-ui/react";
import secondsDurationToRepresentation from "../../utils/secondsDurationToRepresentation";
import timestampToDateRepresentation from "../../utils/timestampToDateRepresentation";
import { useNavigate } from "react-router-dom";

export default function GameTable({
  walletIsWrong,
  serverGameData,
  onChainGameData,
  isHost,
  player2Joined,
  isPlayer2,
  gameStarted,
  isBanned,
}) {
  const votes = ["Not Voted", "Victory", "Loss", "Draw"]
  const navigate = useNavigate();

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
              {serverGameData.player2
                && <Button colorScheme="green" onClick={() => navigate(`/profile/${serverGameData.player2.uuid}`)}>
                  <Image borderRadius='full' src={serverGameData.player2.avatar} alt='avatar' />
                  <Text ms='10px'>{
                    serverGameData.player2.username.length > 13
                      ? serverGameData.player2.username.slice(0, 10) + "..."
                      : serverGameData.player2.username
                  }</Text>
                </Button>
              }
              {!player2Joined && !isHost
                && <>
                  <Button ms='5px' colorScheme="blue" isDisabled={isBanned}>Join</Button>
                  {isBanned && <Text color='red'>Your account is banned!</Text>}
                </>
              }
              {player2Joined && isPlayer2
                && <Button ms='5px' colorScheme="orange" isDisabled={walletIsWrong || gameStarted} >Quit</Button>
              }
              {player2Joined && isHost
                && <Button ms='5px' colorScheme="red" isDisabled={walletIsWrong || gameStarted} >Kick</Button>
              }
            </Td>
          </Tr>
          <Tr>
            <Td>Rules</Td>
            <Td><Text>{serverGameData.rules.description}</Text></Td>
          </Tr>
          <Tr>
            <Td>Bet Size</Td>
            <Td>{`${onChainGameData.bet / 10 ** 18} ETH`}</Td>
          </Tr>
          <Tr>
            <Td>Status</Td>
            <Td>
              {!onChainGameData.started && !player2Joined && "Waiting for second player to connect"}
              {!onChainGameData.started && player2Joined && "Waiting for host to start the game"}
              {onChainGameData.started && !onChainGameData.closed && !onChainGameData.dispute && "The game is on now"}
              {onChainGameData.started && !onChainGameData.closed && onChainGameData.dispute && "Dispute about result"}
              {onChainGameData.closed && "Game is finished"}
            </Td>
          </Tr>
          <Tr>
            <Td>Play & Voting Period Duration</Td>
            <Td>{secondsDurationToRepresentation(onChainGameData.playPeriod)}</Td>
          </Tr>
          {onChainGameData.started
            && <>
              <Tr>
                <Td>End of play & voting period</Td>
                <Td>{timestampToDateRepresentation(onChainGameData.timeStart + onChainGameData.playPeriod)}</Td>
              </Tr>
              <Tr>
                <Td>Host Vote</Td>
                <Td>{votes[onChainGameData.hostVote]}</Td>
              </Tr>
              <Tr>
                <Td>Second Player Vote</Td>
                <Td>{votes[onChainGameData.player2Vote]}</Td>
              </Tr>
            </>}
          {onChainGameData.closed
            && <Tr>
              <Td>Winner</Td>
              <Td>{serverGameData.winner.username}</Td>
            </Tr>}
        </Tbody>
      </Table>
    </TableContainer>
  )
}