import { Button, Badge, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import timestampToDateRepresentation from "../../../utils/timestampToDateRepresentation";
import secondsDurationToRepresentation from "../../../utils/secondsDurationToRepresentation";

export default function ClosedGamesTable({ games }) {
  const navigate = useNavigate();

  return (
    <TableContainer h='70vh' overflowY='scroll'>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>Game</Th>
            <Th>Title</Th>
            <Th>Bet</Th>
            <Th>Play Period</Th>
            <Th>Started</Th>
            <Th>Host</Th>
            <Th>Second PLayer</Th>
            <Th>Winner</Th>
            <Th>Result Elicitation</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {games.map(g => (
            <Tr key={g.game_index}>
              <Td>{g.game_index}</Td>
              <Td>{g.game}</Td>
              <Td>{g.title}</Td>
              <Td>{`${g.bet / 10 ** 18} ETH`}</Td>
              <Td>{secondsDurationToRepresentation(g.play_period)}</Td>
              <Td>{g.started ? timestampToDateRepresentation(g.time_start) : "---"}</Td>
              <Td>{g.host.owner.username.length > 13
                ? g.host.owner.username.slice(0, 10) + "..."
                : g.host.owner.username}</Td>
              <Td>{g.player2
                ? (g.player2.owner.username.length > 13
                  ? g.player2.owner.username.slice(0, 10) + "..."
                  : g.player2.owner.username
                )
                : '---'}</Td>
              <Td>{g.started
                ? (g.winner
                  ? (g.winner.owner.username.length > 13
                    ? g.winner.owner.username.slice(0, 10) + "..."
                    : g.winner.owner.username)
                  : "Draw"
                )
                : "---"}
              </Td>
              <Td>
                {g.started
                  ? (g.dispute
                    ? <Badge colorScheme='red'>arbitrated</Badge>
                    : <Badge colorScheme='green'>consent</Badge>
                  )
                  : <Badge colorScheme='yellow'>canceled</Badge>
                  }
              </Td>
              <Td>
                <Button
                  colorScheme="yellow"
                  onClick={() => navigate(`/game/${g.game_index}`)}
                >
                  Game Page
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}