import { Avatar, Button, Flex, Heading, Image, Link, VStack, Box, HStack, Text, List, ListItem, ListIcon, useDisclosure } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom"
import { useGetAnotherUserDataQuery } from "../../redux/api";
import Preloader from "../../components/Preloader/Preloader";
import SomeError from "../../components/SomeError/SomeError";
import steamLoginImg from '../../assets/images/steam-icon.webp';
import { useSelector } from "react-redux";
import { selectIsArbiter, selectUUID } from "../../redux/authSlice";
import { WarningIcon } from "@chakra-ui/icons";
import BanUserModal from "../../components/Modals/BanUserModal";
import UnbanUserModal from "../../components/Modals/UnbanUserModal";
import WarnUserModal from "../../components/Modals/WarningModal";

export default function Profile() {
  const navigate = useNavigate();

  const selfUUID = useSelector(selectUUID);
  const { uuid } = useParams();

  const isArbiter = useSelector(selectIsArbiter);

  const { data, error, isLoading, refetch } = useGetAnotherUserDataQuery(uuid);

  const { isOpen: isWarningModalOpen, onOpen: onWarningModalOpen, onClose: onWarningModalClose } = useDisclosure();
  const { isOpen: isBanModalOpen, onOpen: onBanModalOpen, onClose: onBanModalClose } = useDisclosure();
  const { isOpen: isUnbanModalOpen, onOpen: onUnbanModalOpen, onClose: onUnbanModalClose } = useDisclosure();

  if (isLoading) return <Preloader />
  if (error) return <SomeError error={error} />

  return (
    <Flex gap='10px' wrap="wrap" w='100%' my='10px' textAlign='center'>
      <Box minW='400px' flex='1' bg={data.banned ? 'red.50' : 'green.50'} border='1px' borderColor='gray.200' borderRadius='15px'>
        <VStack gap='20px' p='20px'>
          <Avatar size='3xl' name={data.username} src={data.avatar_full} />
          <Heading as='p' size='xl'>{data.username}</Heading>
          <Link href={`https://steamcommunity.com/profiles/${uuid}/`} isExternal >
            <Button colorScheme="green" >
              <Image h="25px" me="10px" src={steamLoginImg} />
              Steam Profile
            </Button>
          </Link>
          <Button colorScheme="green" onClick={() => navigate(selfUUID === uuid ? '/my-games' : 'games')} >
            {selfUUID === uuid ? "My Games" : "User Games"}
          </Button>
          {isArbiter && <Button isDisabled={data.banned} onClick={onWarningModalOpen} colorScheme="orange">Make Warning</Button>}
          {isArbiter && (data.banned
            ? <Button colorScheme="yellow" onClick={onUnbanModalOpen} >Unban User</Button>
            : <Button colorScheme="red" onClick={onBanModalOpen} >Ban User</Button>)}
        </VStack>
      </Box>
      <Box minW='400px' flex='5' p='10px' bg={data.banned ? 'red.50' : 'green.50'} border='1px' borderColor='gray.200' borderRadius='15px'>
        {data.banned && <Text color='red' fontSize='xl'>This User is Banned !!!</Text>}
        <Box m='20px' p='10px' bg={data.banned ? 'red.100' : 'green.100'} border='1px' borderColor='gray.200' borderRadius='15px'>
          <Heading as='p' size='lg'>Statistics</Heading>
          <HStack gap='10px' justify='space-evenly' fontSize='large' fontFamily='Verdana'>
            <Text>Victories: {data.victories}</Text>
            <Text>Defeats: {data.defeats}</Text>
            <Text>Draws: {data.draws}</Text>
          </HStack>
        </Box>
        {data.warnings.length > 0
          && <Box m='20px' p='10px' bg={data.banned ? 'red.100' : 'green.100'} border='1px' borderColor='gray.200' borderRadius='15px'>
            <Heading as='p' size='lg'>Warning Admonishments</Heading>
            <Text>(Arbiter can make this notes when user loses dispute)</Text>
            <List p='50px' fontSize='large' fontFamily='Verdana' textAlign='start'>
              {data.warnings.map(w => <ListItem key={w.id}>
                <ListIcon as={WarningIcon} color="red.500" />
                {w.reason}
              </ListItem>
              )}
            </List>
          </Box>
        }
      </Box>
      <BanUserModal
        username={data.username}
        uuid={data.uuid}
        refetch={refetch}
        isOpen={isBanModalOpen}
        onClose={onBanModalClose}
      />
      <UnbanUserModal
        username={data.username}
        uuid={data.uuid}
        refetch={refetch}
        isOpen={isUnbanModalOpen}
        onClose={onUnbanModalClose}
      />
      <WarnUserModal
        username={data.username}
        uuid={data.uuid}
        refetch={refetch}
        isOpen={isWarningModalOpen}
        onClose={onWarningModalClose}
      />
    </Flex>
  )
}
