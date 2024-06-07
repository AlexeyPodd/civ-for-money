import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Link, Image, Text } from "@chakra-ui/react";

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
              <Link href={`https://steamcommunity.com/profiles/${game.host.owner.uuid}/`} >
                <Button colorScheme="green" >
                  <Image borderRadius='full' src={game.host.owner.avatar} alt='avatar' />
                  <Text ms='10px'>{game.host.owner.username}</Text>
                </Button>
              </Link>
            </Td>
          </Tr>
          <Tr>
            <Td>Second Player</Td>
            <Td>
              {game.player2
                && <Link href={`https://steamcommunity.com/profiles/${game.player2.owner.uuid}/`} >
                  <Button colorScheme="green" >
                    <Image borderRadius='full' src={game.player2.owner.avatar} alt='avatar' />
                    <Text>{game.player2.owner.username}</Text>
                  </Button>
                </Link>
              }
            </Td>
          </Tr>
          <Tr>
            <Td>Rules</Td>
            <Td><Text>{game.rules.description}</Text></Td>
          </Tr>
          <Tr>
            <Td>Bet Size</Td>
            <Td>{game.bet}</Td>
          </Tr>
          <Tr>
            <Td>Status</Td>
            <Td>
              {!game.started && !game.player2 && "Waiting for second player to connect"}
              {!game.started && game.player2 && "Waiting sor host to start the game"}
              {game.started && !game.closed && !game.dispute && "Waiting for second player to connect"}
              {game.started && !game.closed && game.dispute && "Dispute about result"}
              {game.closed && "Game is finished"}
            </Td>
          </Tr>
          <Tr>
            <Td>Play & Voting Period Duration</Td>
            <Td></Td>
          </Tr>
          {game.started
            && <>
              <Tr>
                <Td>End of play & voting period</Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td>Host Vote</Td>
                <Td>{votes[game.host_vote]}</Td>
              </Tr>
              <Tr>
                <Td>Second Player Vote</Td>
                <Td>{votes[game.player2_vote]}</Td>
              </Tr>
            </>}

        </Tbody>
      </Table>
    </TableContainer>
  )
}