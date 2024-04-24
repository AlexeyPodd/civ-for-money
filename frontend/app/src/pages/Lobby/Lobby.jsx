import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export default function Lobby() {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>Game</Th>
            <Th>Title</Th>
            <Th>Players</Th>
            <Th>Host</Th>
            <Th>Host statistic </Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>#1</Td>
            <Td>Civ V</Td>
            <Td>duel all dlc</Td>
            <Td>1 / 2</Td>
            <Td>J. Galt</Td>
            <Td>325/214/42</Td>
            <Td><Button colorScheme="yellow">Enter</Button></Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}
