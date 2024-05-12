import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import GamesTable from "../../components/GamesTable/GamesTable";
import LoginOffer from "../../components/LoginOffer/LoginOffer";

export default function MyGames({ isAuth }) {
  if (!isAuth) return <LoginOffer />
  return (
    <Tabs colorScheme="yellow" p="20px" size="lg" variant="enclosed" >
      <TabList>
        <Tab _selected={{ color: "white", bg: "yellow.600" }}>Actual</Tab>
        <Tab _selected={{ color: "white", bg: "yellow.600" }}>Closed</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <GamesTable />
        </TabPanel>
        <TabPanel>
          <GamesTable />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}
