// features/auth/authApi.ts
import { baseApi } from '../../services/api/baseApi';
import { authActions } from './authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, user, permissions, roles } = data;
          dispatch(authActions.setCredentials({ accessToken, user, permissions, roles }));
        } catch {}
      },
    }),

    register: build.mutation<any, { name: string; email: string; phone: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/register', 
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, user, permissions, roles } = data;
          dispatch(authActions.setCredentials({ accessToken, user, permissions, roles }));
        } catch {}
      },
    }),

    logout: build.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(authActions.logout());
        }
      },
    }),

    refresh: build.mutation<any, void>({
      query: () => ({ url: '/auth/refresh', method: 'POST' }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation,  
  useLogoutMutation, 
  useRefreshMutation 
} = authApi;