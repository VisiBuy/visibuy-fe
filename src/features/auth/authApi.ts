import { baseApi } from "@/services/api/baseApi";
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
          console.log(data.accessToken)
          dispatch(
            authActions.setCredentials({
              accessToken,
              user,
              permissions,
              roles,
            })
          );
          dispatch(authActions.setInitialized(true));
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
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(authActions.logout());
          dispatch(authActions.setInitialized(true));
        }
      },
    }),

    refresh: build.mutation<any, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
    }),

    // Add forgot password endpoints
    forgotPassword: build.mutation<any, { email: string }>({
      query: (credentials) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),

    verifyResetToken: build.mutation<any, { token: string }>({
      query: (credentials) => ({
        url: "/auth/verify-reset-token",
        method: "POST",
        body: credentials,
      }),
    }),

    resetPassword: build.mutation<any, { 
      token: string; 
      newPassword: string; 
      confirmPassword: string;
    }>({
      query: (credentials) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation,  
  useLogoutMutation, 
  useRefreshMutation,
  useForgotPasswordMutation,
  useVerifyResetTokenMutation,
  useResetPasswordMutation
} = authApi;