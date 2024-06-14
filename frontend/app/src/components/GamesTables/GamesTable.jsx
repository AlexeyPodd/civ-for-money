import { Button, Badge, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export default function GamesTable() {
  return (
    <TableContainer>
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
          <Tr>
            <Td>#1</Td>
            <Td>Civ V</Td>
            <Td>duel all dlc</Td>
            <Td>0.075 ETH</Td>
            <Td><Badge colorScheme='green'>playing</Badge></Td>
            <Td>01.01.2024 10:00</Td>
            <Td>07.01.2024 10:00</Td>
            <Td>J. Galt</Td>
            <Td>Coolcat</Td>
            <Td><Button colorScheme="yellow">Details</Button></Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  )
}