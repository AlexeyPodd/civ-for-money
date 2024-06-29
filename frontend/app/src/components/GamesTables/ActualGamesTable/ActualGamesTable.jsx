import { Button, Badge, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import timestampToDateRepresentation from "../../../utils/timestampToDateRepresentation";


export default function ActualGamesTable({ games }) {
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
            <Th>Status</Th>
            <Th>Started</Th>
            <Th>Deadline</Th>
            <Th>Host</Th>
            <Th>Second PLayer</Th>
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
              <Td>
                {g.player2 === null && <Badge colorScheme='green'>waiting for player2</Badge>}
                {g.player2 != null && !g.started && <Badge colorScheme='pink'>not started</Badge>}
                {g.started && !g.host_vote && !g.player2_vote && <Badge colorScheme='teal'>playing</Badge>}
                {(g.host_vote === 0 && g.player2_vote != 0 || g.host_vote != 0 && g.player2_vote === 0)
                  && <Badge colorScheme='purple'>voting</Badge>}
                {g.dispute && <Badge colorScheme='red'>dispute</Badge>}
              </Td>
              <Td>{g.time_start ? timestampToDateRepresentation(g.time_start) : '---'}</Td>
              <Td>{g.time_start ? timestampToDateRepresentation(g.time_start + g.play_period) : '---'}</Td>
              <Td>{g.host.owner.username.length > 13
                ? g.host.owner.username.slice(0, 10) + "..."
                : g.host.owner.username}
              </Td>
              <Td>{g.player2 ? (g.player2.owner.username.length > 13
                ? g.player2.owner.username.slice(0, 10) + "..."
                : g.player2.owner.username) : '---'}</Td>
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