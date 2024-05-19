import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loggingInFinished, loggingInStarted } from './authSlice';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API_URL,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    prepareHeaders: (headers, { getState }) => {
      if (getState().auth.isAuth) {
        headers.set(
          'Authorization',
          `Token ${localStorage.getItem("auth_token")}`,
        )
      }
      return headers;
    }
  }),
  endpoints: build => ({
    login: build.mutation({
      query: (steamData) => ({
        url: '/auth/login/',
        method: 'POST',
        body: steamData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(loggingInStarted());
        try {
          await queryFulfilled;
        } finally {
          dispatch(loggingInFinished());
        }
      }
    }),
    logout: build.mutation({
      query: () => ({
        url: '/auth/logout/',
        method: 'DELETE',
      })
    }),
    getUserData: build.query({
      query: () => '/auth/user-data/',
    }),
    registerUserWallet: build.mutation({
      query: ({ message, signature }) => ({
        url: '/auth/register-wallet/',
        method: 'POST',
        body: { message, signature },
      })
    }),
    getUserRules: build.query({
      query: () => '/rules/',
    }),
    deleteRule: build.mutation({
      query: (id) => ({
        url: `/rules/${id}/`,
        method: 'DELETE',
      })
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserDataQuery,
  useRegisterUserWalletMutation,
  useGetUserRulesQuery,
  useDeleteRuleMutation,
} = api;
