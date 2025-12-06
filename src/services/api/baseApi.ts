import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authActions } from "../../features/auth/authSlice";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://visibuy-staging-api.onrender.com/api/v1";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: { accessToken?: string | null } };
    const token = state.auth?.accessToken ?? null;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
  credentials: "include",
});

type RefreshResponse = {
  accessToken: string;
  user: any;
  permissions: string[];
  roles: string[];
};

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );
    const data = refreshResult?.data as RefreshResponse | undefined;
    if (data) {
      const { accessToken, user, permissions, roles = [] } = data;
      api.dispatch(
        authActions.setCredentials({ accessToken, user, permissions, roles })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(authActions.logout());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    "Auth",
    "User",
    "Verification",
    "Escrow",
    "Credit",
    "Payment",
    "Audit",
    "Payout",
    "Role",
    "Permission",
    "Dashboard",
    "sellerProfile",
    "Kyc",
  ],
});
