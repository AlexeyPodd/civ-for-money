import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggingIn: false,
    isAuth: false,
    walletConnected: false,
    isStaff: false,
    username: null,
    avatar: null,
    uuid: null,
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
      state.walletConnected = action.payload.walletConnected;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.isAuth = true;
          state.isStaff = payload.isStaff;
          state.username = payload.username;
          state.avatar = payload.avatar;
          state.uuid = payload.uuid;
        }
      )
      .addMatcher(
        api.endpoints.logout.matchFulfilled,
        (state) => {
          state.isAuth = false;
          state.isStaff = false;
          state.username = null;
          state.avatar = null;
          state.uuid = null;
        }
      )
      .addMatcher(
        api.endpoints.getUserData.matchFulfilled,
        (state, { payload }) => {
          state.username = payload.username;
          state.avatar = payload.avatar;
          state.uuid = payload.uuid;
          state.isStaff = payload.isStaff;
        }
      )
      .addMatcher(
        api.endpoints.registerUserWallet.matchFulfilled,
        (state) => {
          state.walletConnected = true;
        }
      )
      .addMatcher(
        api.endpoints.registerUserWallet.matchRejected,
        (state) => {
          state.walletConnected = false;
        }
      )
  }
});

export const selectIsAuth = (state) => state.auth.isAuth;
export const selectWalletConnected = (state) => state.auth.walletConnected;
export const selectIsStaff = (state) => state.auth.isStaff;
export const selectUsername = (state) => state.auth.username;
export const selectAvatar = (state) => state.auth.avatar;
export const selectUUID = (state) => state.auth.uuid;
export const selectIsLoggingIn = (state) => state.auth.isLoggingIn;

export const {
  tokenGotten,
  tokenLost,
  loggingInStarted,
  loggingInFinished,
  setWalletConnected
} = authSlice.actions;

export default authSlice.reducer;
