import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Link, Image, Text } from "@chakra-ui/react";
import secondsDurationToRepresentation from "../../utils/secondsDurationToRepresentation";
import timestampToDateRepresentation from "../../utils/timestampToDateRepresentation";

export default function GameTable({
  walletIsWrong,
  serverGameData,
  onChainGameData,
  isHost,
  player2Joined,
  isPlayer2,
  gameStarted,
}) {
  const votes = ["Not Voted", "Victory", "Loss", "Draw"]

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
              <Link href={`https://steamcommunity.com/profiles/${serverGameData.host.uuid}/`} isExternal >
                <Button colorScheme="green" >
                  <Image borderRadius='full' src={serverGameData.host.avatar} alt='avatar' />
                  <Text ms='10px'>{serverGameData.host.username}</Text>
                </Button>
              </Link>
            </Td>
          </Tr>
          <Tr>
            <Td>Second Player</Td>
            <Td>
              {serverGameData.player2
                && <Link href={`https://steamcommunity.com/profiles/${serverGameData.player2.uuid}/`} isExternal >
                  <Button colorScheme="green" >
                    <Image borderRadius='full' src={serverGameData.player2.avatar} alt='avatar' />
                    <Text>{serverGameData.player2.username}</Text>
                  </Button>
                </Link>
              }
              {!player2Joined && !isHost
                && <Button ms='5px' colorScheme="blue">Join</Button>
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

        </Tbody>
      </Table>
    </TableContainer>
  )
}