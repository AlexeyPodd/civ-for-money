import { createSlice } from "@reduxjs/toolkit";
import { api } from "./api";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth: false,
    username: null,
    avatar: null,
    uuid: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.isAuth = true;
        state.username = payload.username;
        state.avatar = payload.avatar;
        state.uuid = payload.uuid;
      }
    )
    .addMatcher(
      api.endpoints.logout.matchFulfilled,
      (state) => {
        state.isAuth = false;
        state.username = null;
        state.avatar = null;
        state.uuid = null;
      }
    )
  }
});

export const selectIsAuth = (state) => state.auth.isAuth;
export const selectUsername = (state) => state.auth.username;
export const selectAvatar = (state) => state.auth.avatar;
export const selectUUID = (state) => state.auth.uuid;

export default authSlice.reducer;
