import { baseApi } from "../../services/api/baseApi";
import { authActions } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, user, permissions, roles } = data;
          dispatch(
            authActions.setCredentials({
              accessToken,
              user,
              permissions,
              roles,
            })
          );
          // Mark as initialized after successful login
          dispatch(authActions.setInitialized(true));
        } catch {}
      },
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Clear auth state (including persisted data)
          dispatch(authActions.logout());
          // Mark as initialized so app doesn't get stuck
          dispatch(authActions.setInitialized(true));
        }
      },
    }),
    refresh: build.mutation<any, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshMutation } =
  authApi;
