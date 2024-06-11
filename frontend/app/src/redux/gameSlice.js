import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    serverGameData: {},
    onChainGameData: {},
  },
  reducers: {
    onChainGameDataFetched: (state, action) => {
      state.onChainGameData = action.payload;
    }
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
          };
        }
      )
  }
});


export const { onChainGameDataFetched } = gameSlice.actions;


export const selectServerGameData = (state) => state.game.serverGameData;
export const selectOnChanGameData = (state) => state.game.onChainGameData;

export default gameSlice.reducer;
