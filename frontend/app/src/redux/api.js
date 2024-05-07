import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
    }),
    logout: build.mutation({
      query: () => ({
        url: '/auth/logout/',
        method: 'DELETE',
      })
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = api;