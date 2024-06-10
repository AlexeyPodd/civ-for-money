import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    serverGameData: {},
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.getGame.matchFulfilled,
        (state, {payload}) => {
          state.serverGameData = payload;
        }
      )
  }
});


export const selectServerGameData = (state) => state.game.serverGameData;

export default gameSlice.reducer;
