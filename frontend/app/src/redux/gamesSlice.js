import { createSlice } from "@reduxjs/toolkit";

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    isCreatingGame: false,
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
  }
});

export const selectIsCreatingGame = (state) => state.games.isCreatingGame;

export const {
  gameCreatingStarted,
  gameCreatingFinished,
} = gamesSlice.actions;

export default gamesSlice.reducer;