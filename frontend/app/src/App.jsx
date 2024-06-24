import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

import RootLayout from './layouts/RootLayout';
import Lobby from "./pages/Lobby/Lobby";
import GameContainer from "./pages/Game/GameContainer";
import Disputes from "./pages/Disputes/Disputes";
import Login from "./pages/Login/Login";
import Preloader from "./components/Preloader/Preloader";
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import UseInitiation from "./hooks/useInitiation.js";
import UserGames from "./pages/UserGames/UserGames.jsx";
import NewGameContainer from "./pages/NewGame/NewGameContainer.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import MyGames from "./pages/UserGames/MyGames.jsx";
import Page404 from "./pages/Page404.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Lobby />} />
      <Route path="my-games" element={<MyGames />} />
      <Route path="game/:gameID" element={<GameContainer />} />
      <Route path="new-game" element={<NewGameContainer />} />
      <Route path="disputes" element={<Disputes />} />
      <Route path="login" element={<Login />} />
      <Route path="profile/:uuid" element={<Profile />} />
      <Route path="profile/:uuid/games" element={<UserGames />} />
      <Route path="/*" element={<Page404 />} />
    </Route>
  )
)

function App() {
  const initialized = UseInitiation();

  if (!initialized) {
    return <Preloader />
  }
  return (
    <RouterProvider router={router} />
  )
}

export default function CivForMoneyApp() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
  )
}