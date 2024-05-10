import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

import RootLayout from './layouts/RootLayout';
import Lobby from "./pages/Lobby/Lobby";
import MyGames from "./pages/MyGames/MyGames";
import Game from "./pages/Game/Game";
import NewGame from "./pages/NewGame/NewGame";
import Disputes from "./pages/Disputes/Disputes";
import Login from "./pages/Login/Login";
import Preloader from "./components/Preloader/Preloader";
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import UseInitiation from "./hoosk/useInitiation.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Lobby />} />
      <Route path="my-games" element={<MyGames />} />
      <Route path="game/:gameId" element={<Game />} />
      <Route path="new-game" element={<NewGame />} />
      <Route path="disputes" element={<Disputes />} />
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<div>404 NOT FOUND</div>} />
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