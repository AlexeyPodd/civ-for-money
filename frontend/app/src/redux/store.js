import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import authReducer from './authSlice';
import rulesReducer from './rulesSlice';
import gamesReducer from './gamesSlice';
import {api} from './api';

export default configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    app: appReducer,
    auth: authReducer,
    rules: rulesReducer,
    games: gamesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});