import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import authReducer from './authSlice';
import {api} from './api';

export default configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    app: appReducer,
    auth: authReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});