import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    initialized: false,
  },
  reducers: {
    initializedSuccess: state => {
      state.initialized = true;
    }
  }
});

export const {initializedSuccess} = appSlice.actions;

export const selectInitialized = (state) => state.app.initialized;

export default appSlice.reducer;
