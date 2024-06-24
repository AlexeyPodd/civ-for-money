import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    isCreatingGame: false,
    serverGameData: {},
    onChainGameData: {},
  },
  reducers: {
    gameCreatingStarted: state => {
      state.isCreatingGame = true;
      window.onbeforeunload = () => true;
    },
    gameCreatingFinished: state => {
      state.isCreatingGame = false;
      window.onbeforeunload = undefined;
    },
    onChainGameDataFetched: (state, action) => {
      state.onChainGameData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.getGame.matchFulfilled,
        (state, { payload }) => {
          state.serverGameData = {
            ...payload,
            host: {
              ...payload.host.owner,
              address: payload.host.address.toLowerCase()
            },
            player2: payload.player2 && {
              ...payload.player2.owner,
              address: payload.player2.address.toLowerCase()
            },
            player2: payload.winner && {
              ...payload.winner.owner,
              address: payload.winner.address.toLowerCase()
            },
          };
        }
      )
  }
});

export const {
  gameCreatingStarted,
  gameCreatingFinished,
  onChainGameDataFetched
} = gameSlice.actions;


export const selectIsCreatingGame = (state) => state.game.isCreatingGame;
export const selectServerGameData = (state) => state.game.serverGameData;
export const selectOnChanGameData = (state) => state.game.onChainGameData;

export default gameSlice.reducer;
