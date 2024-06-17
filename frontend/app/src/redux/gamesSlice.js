import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    lobbyGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [],
    },
    myGames: {
      pageSize: 30,
      totalGamesCount: 0,
      games: [],
    },
    myGamesArchive: {
      pageSize: 30,
      totalGamesCount: 0,
      games: [],
    },
    disputeGames: {
      pageSize: 30,
      totalGamesCount: 0,
      games: [],
    },
  },
  reducers: {
    clearLobbyGames: state => {
      state.lobbyGames.games = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.getLobbyGames.matchFulfilled,
        (state, { payload }) => {
          state.lobbyGames.games = payload.results;
          state.lobbyGames.totalGamesCount = payload.count;
        }
      )
  }
});

export const selectLobbyGamesPageSize = state => state.games.lobbyGames.pageSize;
export const selectLobbyGames = state => state.games.lobbyGames.games;
export const selectTotalGamesCount = state => state.games.lobbyGames.totalGamesCount;

export const {
  clearLobbyGames,
} = gamesSlice.actions;

export default gamesSlice.reducer;