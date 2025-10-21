import { baseApi } from "../../services/api/baseApi";
import { authActions } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
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
        } catch {}
      },
    }),

    register: build.mutation<
      any,
      {
        fullName: string;
        email: string;
        password: string;
        phone: string;
        address: string;
      }
    >({
      query: (userData) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    forgotPassword: build.mutation<any, { email: string }>({
      query: (data) => ({
        url: "/api/v1/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: build.mutation<
      any,
      {
        password: string;
        confirmPassword: string;
        resetToken: string;
      }
    >({
      query: (data) => ({
        url: "/api/v1/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "/api/v1/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(authActions.logout());
        }
      },
    }),
    refresh: build.mutation<any, void>({
      query: () => ({ url: "/api/v1/auth/refresh", method: "POST" }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useRefreshMutation,
} = authApi;
