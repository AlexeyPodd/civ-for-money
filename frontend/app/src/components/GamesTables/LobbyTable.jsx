import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import secondsDurationToRepresentation from "../../utils/secondsDurationToRepresentation";
import { useNavigate } from 'react-router-dom';


export default function LobbyTable({ games }) {
  const navigate = useNavigate();

  return (
    <TableContainer p='20px' overflowY='scroll' h='75vh' border='2px' borderColor='gray.100' borderRadius='10px'>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>Game</Th>
            <Th>Title</Th>
            <Th>Bet</Th>
            <Th>Play Period</Th>
            <Th>Host</Th>
            <Th>Host statistic </Th>
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
              <Td>{secondsDurationToRepresentation(g.play_period / 1000)}</Td>
              <Td>{g.host.owner.username}</Td>
              <Td>{g.host.owner.victories}/{g.host.owner.defeats}/{g.host.owner.draws}</Td>
              <Td><Button colorScheme="yellow" onClick={() => navigate(`/game/${g.game_index}`)}>Game Page</Button></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
