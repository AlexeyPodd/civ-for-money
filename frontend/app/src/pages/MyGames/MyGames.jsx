import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ActualGamesTableContainer from "./ActualGamesTableContainer";
import ClosedGamesTableContainer from "./ClosedGamesTableContainer";
import withLoginOffer from "../../hoc/withLoginOffer";

function MyGames() {
  return (
    <Tabs colorScheme="yellow" size="lg" variant="enclosed" >
      <TabList>
        <Tab _selected={{ color: "white", bg: "yellow.600" }}>Actual</Tab>
        <Tab _selected={{ color: "white", bg: "yellow.600" }}>Closed</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <ActualGamesTableContainer />
        </TabPanel>
        <TabPanel>
          <ClosedGamesTableContainer />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default withLoginOffer(MyGames);