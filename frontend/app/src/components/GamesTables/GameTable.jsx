import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Link, Image, Text } from "@chakra-ui/react";
import secondsDurationToRepresentation from "../../utils/secondsDurationToRepresentation";
import timestampToDateRepresentation from "../../utils/timestampToDateRepresentation";

export default function GameTable({ game }) {
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
            <Td>{game.title}</Td>
          </Tr>
          <Tr>
            <Td>Game</Td>
            <Td>{game.game}</Td>
          </Tr>
          <Tr>
            <Td>Host</Td>
            <Td>
              <Link href={`https://steamcommunity.com/profiles/${game.host.uuid}/`} isExternal >
                <Button colorScheme="green" >
                  <Image borderRadius='full' src={game.host.avatar} alt='avatar' />
                  <Text ms='10px'>{game.host.username}</Text>
                </Button>
              </Link>
            </Td>
          </Tr>
          <Tr>
            <Td>Second Player</Td>
            <Td>
              {game.player2
                && <Link href={`https://steamcommunity.com/profiles/${game.player2.uuid}/`} isExternal >
                  <Button colorScheme="green" >
                    <Image borderRadius='full' src={game.player2.avatar} alt='avatar' />
                    <Text>{game.player2.username}</Text>
                  </Button>
                </Link>
              }
              <Button ms='5px' colorScheme="blue">Join</Button>
              <Button ms='5px' colorScheme="orange">Quit</Button>
              <Button ms='5px' colorScheme="red">Kick</Button>
            </Td>
          </Tr>
          <Tr>
            <Td>Rules</Td>
            <Td><Text>{game.rules.description}</Text></Td>
          </Tr>
          <Tr>
            <Td>Bet Size</Td>
            <Td>{`${Number(game.bet) / 10 ** 18} ETH`}</Td>
          </Tr>
          <Tr>
            <Td>Status</Td>
            <Td>
              {!game.started && !game.player2 && "Waiting for second player to connect"}
              {!game.started && game.player2 && "Waiting for host to start the game"}
              {game.started && !game.closed && !game.dispute && "The game is on now"}
              {game.started && !game.closed && game.dispute && "Dispute about result"}
              {game.closed && "Game is finished"}
            </Td>
          </Tr>
          <Tr>
            <Td>Play & Voting Period Duration</Td>
            <Td>{secondsDurationToRepresentation(Number(game.playPeriod))}</Td>
          </Tr>
          {game.started
            && <>
              <Tr>
                <Td>End of play & voting period</Td>
                <Td>{timestampToDateRepresentation(Number(game.timeStart) + Number(game.playPeriod))}</Td>
              </Tr>
              <Tr>
                <Td>Host Vote</Td>
                <Td>{votes[game.hostVote]}</Td>
              </Tr>
              <Tr>
                <Td>Second Player Vote</Td>
                <Td>{votes[game.player2Vote]}</Td>
              </Tr>
            </>}

        </Tbody>
      </Table>
    </TableContainer>
  )
}