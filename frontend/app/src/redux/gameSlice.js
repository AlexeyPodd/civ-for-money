import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    game: {},
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.getGame.matchFulfilled,
        (state, {payload}) => {
          state.game = payload;
        }
      )
  }
});


export const selectGame = (state) => state.game.game;

export default gameSlice.reducer;
