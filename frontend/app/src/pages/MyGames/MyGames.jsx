import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import GamesTable from "../../components/GamesTable/GamesTable";

export default function MyGames() {
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
