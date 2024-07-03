import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { api } from "./api";
import { ethers } from "ethers";

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
      state.onChainGameData = {
        ...state.onChainGameData,
        ...action.payload,
      };
    },
    player2JoinedEventEmitted: (state, action) => {
      state.onChainGameData.player2 = action.payload.toLowerCase();
    },
    slotFreedEventEmitted: (state) => {
      state.serverGameData.player2 = null;
      state.onChainGameData.player2 = ethers.ZeroAddress;
    },
    gameCancelEventEmitted: (state) => {
      state.serverGameData.closed = true;
      state.onChainGameData.closed = true;
    },
    victoryEventEmitted: (state, { payload }) => {
      state.onChainGameData.winner = payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          api.endpoints.getGame.matchFulfilled,
          api.endpoints.updateGame.matchFulfilled,
        ),
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
            winner: payload.winner && {
              ...payload.winner.owner,
              address: payload.winner.address.toLowerCase()
            },
          };
        }
      )
      .addMatcher(
        api.endpoints.getAnotherUserDataByAddress.matchFulfilled,
        (state, { payload }) => {
          state.serverGameData.player2 = {
            ...payload.owner,
            address: payload.address.toLowerCase(),
          };
        }
      )
  }
});

export const {
  gameCreatingStarted,
  gameCreatingFinished,
  onChainGameDataFetched,
  player2JoinedEventEmitted,
  slotFreedEventEmitted,
  gameCancelEventEmitted,
  victoryEventEmitted,
} = gameSlice.actions;


export const selectIsCreatingGame = (state) => state.game.isCreatingGame;
export const selectServerGameData = (state) => state.game.serverGameData;
export const selectOnChanGameData = (state) => state.game.onChainGameData;

export default gameSlice.reducer;
