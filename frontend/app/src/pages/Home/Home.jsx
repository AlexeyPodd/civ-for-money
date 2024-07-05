import { Box, Button, Flex, HStack, Heading, Image, Link, ListItem, OrderedList, Text, VStack } from "@chakra-ui/react";
import { useContext } from "react";
import { ToastContext } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const toast = useContext(ToastContext);
  const navigate = useNavigate();

  function copyArbiterEmail() {
    navigator.clipboard.writeText('qwq199313@gmail.com');
    toast({
      title: 'Email copied!',
      status: 'success',
      duration: 2000,
    })
  }

  return (
    <VStack mb='10px' gap='20px'>
      <Flex
        p='40px'
        borderWidth='20px'
        borderColor='green.100'
        borderRadius='40px'
        justify='center'
        gap='20px'
        wrap='wrap'
        w='100%'
      >
        <Image src='/chess.webp' alt='' />
        <Box p='20px' maxW='600px'>
          <Heading as='p'>Hello, fans of smart games!</Heading>
          <Text fontSize='lg'>
            On this site you can look for opponents to play for money without worrying about honesty.
            Payouts are guaranteed using the power of web3 technology!
          </Text>
        </Box>
      </Flex>
      <Flex
        p='40px'
        borderWidth='20px'
        borderColor='green.100'
        borderRadius='40px'
        justify='center'
        gap='20px'
        wrap='wrap'
        w='100%'
      >
        <Image src='/gamer.jpg' alt='' maxW='600px' />
        <Box p='20px' maxW='600px'>
          <Heading as='p'>So, how can I start playing?</Heading>
          <OrderedList>
            <ListItem>Yous should have Browser Ethereum Wallet (such as Metamask, etc).</ListItem>
            <ListItem>You should also have access to your Steam account.</ListItem>
            <ListItem>
              If you have both - you can browse for games on <Button variant='link' colorScheme="green" onClick={() => navigate('/lobby')}>lobby</Button> page, or <Button variant='link' colorScheme="green" onClick={() => navigate('/new-game')}>create</Button> a new one.
            </ListItem>
            <ListItem>
              If you are joining game - read game rules first.
              It is also strongly recommended to contact your opponent and make sure that he is not against your participation.
              (you can find the link to the Steam profile on the player’s profile page).
            </ListItem>
            <ListItem>Enjoy playing!</ListItem>
            <ListItem>But remember - if players disagree about match results, arbiter makes this decision. So it's better to have some evidence - video of your gameplay, or saving files, etc.</ListItem>
          </OrderedList>
        </Box>
      </Flex>
      <Flex
        p='20px'
        borderWidth='20px'
        borderColor='green.100'
        borderRadius='40px'
        justify='center'
        gap='20px'
        wrap='wrap'
        w='100%'
      >
        <Image src='/painting.jpg' alt='' maxW='600px' />
        <VStack p='25px' maxW='600px' gap='20px'>
          <Heading as='p'>Wait, if everything is guaranteed by web3 technologies, then why do we need an arbiter?</Heading>
          <Text>
            After the game, players report the result.
            If their readings match, winnings are distributed automatically on-chain, without participation of any third party.
          </Text>
          <Text>
            But if players do not agree on result, blockchain cannot know who actually won.
            That's why an arbitrator is needed.
            Technologies guarantee that the arbitrator will not be able to take possession of the prize fund and will not be able to send it to anyone other than the game participants.
          </Text>
          <Text>
            If a disagreement arises, you should provide your recording of the game to the arbiter:
          </Text>
          <HStack>
            <Link href="https://t.me/alexey_0000" isExternal>
              <Button colorScheme="green">
                Telegram
              </Button>
            </Link>
            <Button colorScheme="green" onClick={copyArbiterEmail}>
              Email
            </Button>
          </HStack>
          <Text>
            Win, record your games, don't forget to enter results to the chain before end of the voting period, and arbiter will be on your side!
          </Text>
        </VStack>
      </Flex>
    </VStack>
  )
}
