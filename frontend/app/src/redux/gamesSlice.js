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
    userGames: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [],
    },
    userGamesArchive: {
      pageSize: 10,
      totalGamesCount: 0,
      games: [],
    },
    disputeGames: {
      pageSize: 12,
      totalGamesCount: 0,
      games: [],
    },
  },
  reducers: {
    clearLobbyGames: state => {
      state.lobbyGames.games = [];
    },
    clearUserGames: state => {
      state.userGames.games = [];
    },
    clearUserGamesArchive: state => {
      state.userGamesArchive.games = [];
    },
    clearDisputeGames: state => {
      state.disputeGames.games = [];
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
      .addMatcher(
        api.endpoints.getUserActualGames.matchFulfilled,
        (state, { payload }) => {
          state.userGames.games = payload.results;
          state.userGames.totalGamesCount = payload.count;
        }
      )
      .addMatcher(
        api.endpoints.getUserClosedGames.matchFulfilled,
        (state, { payload }) => {
          state.userGamesArchive.games = payload.results;
          state.userGamesArchive.totalGamesCount = payload.count;
        }
      )
      .addMatcher(
        api.endpoints.getDisputedGames.matchFulfilled,
        (state, { payload }) => {
          state.disputeGames.games = payload.results;
          state.disputeGames.totalGamesCount = payload.count;
        }
      )
  }
});

export const selectLobbyGamesPageSize = state => state.games.lobbyGames.pageSize;
export const selectLobbyGames = state => state.games.lobbyGames.games;
export const selectTotalLobbyGamesCount = state => state.games.lobbyGames.totalGamesCount;
export const selectUserGamesPageSize = state => state.games.userGames.pageSize;
export const selectUserGames = state => state.games.userGames.games;
export const selectTotalUserGamesCount = state => state.games.userGames.totalGamesCount;
export const selectUserGamesArchivePageSize = state => state.games.userGamesArchive.pageSize;
export const selectUserGamesArchive = state => state.games.userGamesArchive.games;
export const selectTotalUserGamesArchiveCount = state => state.games.userGamesArchive.totalGamesCount;
export const selectDisputeGamesPageSize = state => state.games.disputeGames.pageSize;
export const selectDisputeGames = state => state.games.disputeGames.games;
export const selectTotalDisputeGamesCount = state => state.games.disputeGames.totalGamesCount;

export const {
  clearLobbyGames,
  clearUserGames,
  clearUserGamesArchive,
  clearDisputeGames,
} = gamesSlice.actions;

export default gamesSlice.reducer;