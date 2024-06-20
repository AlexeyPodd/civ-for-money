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
    getAnotherUserData: build.query({
      query: (uuid) => `/auth/user-data/?uuid=${uuid}`,
    }),
    banUser: build.mutation({
      query: (uuid) => ({
        url: `auth/ban/`,
        method: 'POST',
        body: {uuid},
      })
    }),
    unbanUser: build.mutation({
      query: (uuid) => ({
        url: `auth/unban/`,
        method: 'POST',
        body: {uuid},
      })
    }),
    warnUser: build.mutation({
      query: ({uuid, description}) => ({
        url: '/auth/warn-user/',
        method: 'POST',
        body: {uuid, description},
      })
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
      query: ({ id, title, description }) => ({
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
          dispatch(ruleDeleted({ id: Number(arg) }));
        } catch (err) {
          console.error(err);
        }
      }
    }),
    getGameTypes: build.query({
      query: () => '/game-types/',
    }),
    createGame: build.mutation({
      query: ({ title, game, rules, game_index }) => ({
        url: '/games/',
        method: 'POST',
        body: { title, game, rules, game_index },
      })
    }),
    getGame: build.query({
      query: (gameID) => `/games/${gameID}/`,
    }),
    getLobbyGames: build.query({
      query: ({ pageNumber = 1, pageSize = 12 }) =>
        `/games/lobby/?page_number=${pageNumber}&page_size=${pageSize}`,
    }),
    getUserActualGames: build.query({
      query: ({ uuid, pageNumber = 1, pageSize = 12 }) =>
        `/games/user_actual_games/?uuid=${uuid}&page_number=${pageNumber}&page_size=${pageSize}`,
    }),
    getUserClosedGames: build.query({
      query: ({ uuid, pageNumber = 1, pageSize = 12 }) =>
        `/games/user_closed_games/?uuid=${uuid}&page_number=${pageNumber}&page_size=${pageSize}`,
    }),
    getDisputedGames: build.query({
      query: ({ pageNumber = 1, pageSize = 12 }) =>
        `/games/disputed_games/?page_number=${pageNumber}&page_size=${pageSize}`,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserDataQuery,
  useGetAnotherUserDataQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useWarnUserMutation,
  useRegisterUserWalletMutation,
  useGetUserRulesQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
  useGetGameTypesQuery,
  useCreateGameMutation,
  useGetGameQuery,
  useGetLobbyGamesQuery,
  useGetUserActualGamesQuery,
  useGetUserClosedGamesQuery,
  useGetDisputedGamesQuery,
} = api;
