import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { loggingInFinished, loggingInStarted } from './authSlice';
import { ruleDeleted } from './rulesSlice';

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
    createRule: build.mutation({
      query: ({ title, description }) => ({
        url: '/rules/',
        method: 'POST',
        body: { title, description },
      })
    }),
    updateRule: build.mutation({
      query: ({id, title, description}) => ({
        url: `/rules/${id}/`,
        method: 'PUT',
        body: { title, description },
      })
    }),
    deleteRule: build.mutation({
      query: (id) => ({
        url: `/rules/${id}/`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(ruleDeleted({id: Number(arg)}));
        } catch(err) {
          console.error(err);
        }
      }
    }),
    getGameTypes: build.query({
      query: () => '/game-types/',
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserDataQuery,
  useRegisterUserWalletMutation,
  useGetUserRulesQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
  useGetGameTypesQuery,
} = api;
