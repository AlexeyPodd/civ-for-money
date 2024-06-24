import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import timestampToDateRepresentation from "../../utils/timestampToDateRepresentation";

export default function DisputedGamesTable({ games }) {
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
            <Th>Started</Th>
            <Th>Deadline</Th>
            <Th>Host</Th>
            <Th>Host Vote</Th>
            <Th>Second PLayer</Th>
            <Th>Second PLayer Vote</Th>
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
              <Td>{timestampToDateRepresentation(g.time_start)}</Td>
              <Td>{timestampToDateRepresentation(g.time_start + g.play_period)}</Td>
              <Td>{g.host.owner.username}</Td>
              <Td>{["Not Voted", "Victory", "Loss", "Draw"][g.host_vote]}</Td>
              <Td>{g.player2.owner.username}</Td>
              <Td>{["Not Voted", "Victory", "Loss", "Draw"][g.player2_vote]}</Td>
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
