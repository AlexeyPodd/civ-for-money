import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggingIn: false,
    isAuth: false,
    walletConnected: false,
    isArbiter: false,
    username: null,
    avatar: null,
    uuid: null,
    banned: null,
  },
  reducers: {
    tokenGotten: state => {
      state.isAuth = true;
    },
    tokenLost: state => {
      state.isAuth = false;
    },
    loggingInStarted: state => {
      state.isLoggingIn = true;
    },
    loggingInFinished: state => {
      state.isLoggingIn = false;
    },
    setWalletConnected: (state, action) => {
      state.walletConnected = true;
      if (action.payload == import.meta.env.VITE_ARBITER_ADDRESS.toLowerCase()) {
        state.isArbiter = true;
      }
    },
    setWalletDisconnected: state => {
      state.walletConnected = false;
      state.isArbiter = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.isAuth = true;
          state.username = payload.username;
          state.avatar = payload.avatar;
          state.uuid = payload.uuid;
          state.banned = payload.banned;
        }
      )
      .addMatcher(
        api.endpoints.logout.matchFulfilled,
        (state) => {
          state.isAuth = false;
          state.username = null;
          state.avatar = null;
          state.uuid = null;
          state.banned = null;
        }
      )
      .addMatcher(
        api.endpoints.getUserData.matchFulfilled,
        (state, { payload }) => {
          state.username = payload.username;
          state.avatar = payload.avatar;
          state.uuid = payload.uuid;
          state.banned = payload.banned;
        }
      )
  }
});

export const selectIsAuth = (state) => state.auth.isAuth;
export const selectWalletConnected = (state) => state.auth.walletConnected;
export const selectUsername = (state) => state.auth.username;
export const selectAvatar = (state) => state.auth.avatar;
export const selectUUID = (state) => state.auth.uuid;
export const selectIsLoggingIn = (state) => state.auth.isLoggingIn;
export const selectIsArbiter = (state) => state.auth.isArbiter;
export const selectBanned = (state) => state.auth.banned;

export const {
  tokenGotten,
  tokenLost,
  loggingInStarted,
  loggingInFinished,
  setWalletConnected,
  setWalletDisconnected,
} = authSlice.actions;

export default authSlice.reducer;
