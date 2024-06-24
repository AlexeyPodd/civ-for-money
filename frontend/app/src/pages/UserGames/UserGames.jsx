import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import ActualGamesTableContainer from "../../components/GamesTables/ActualGamesTable/ActualGamesTableContainer";
import ClosedGamesTableContainer from "../../components/GamesTables/ClosedGamesTable/ClosedGamesTableContainer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUUID } from "../../redux/authSlice";
import { useEffect, useState } from "react";

export default function UserGames() {
  const { uuid: urlUUID } = useParams();
  const authUUID = useSelector(selectUUID);

  const navigate = useNavigate();
  const location = useLocation();

  const [isOwnGames, setIsOwnGames] = useState();

  useEffect(() => {
    if (urlUUID === authUUID) navigate('/my-games', {replace: true});
  }, [urlUUID, authUUID, navigate]);

  useEffect(() => {
    setIsOwnGames(location.pathname === "/my-games");
  }, [location])

  return (
    <Tabs colorScheme="yellow" size="lg" variant="enclosed" >
      <TabList>
        <Tab _selected={{ color: "white", bg: "yellow.600" }}>Actual</Tab>
        <Tab _selected={{ color: "white", bg: "yellow.600" }}>Closed</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <ActualGamesTableContainer uuid={urlUUID || authUUID} isOwnGame={isOwnGames} />
        </TabPanel>
        <TabPanel>
          <ClosedGamesTableContainer  uuid={urlUUID || authUUID} isOwnGames={isOwnGames} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}