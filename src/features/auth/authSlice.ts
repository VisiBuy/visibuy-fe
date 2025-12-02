import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = { id: string; email: string; name?: string; trustScore?: number };
type AuthState = {
  user: User | null;
  permissions: string[];
  accessToken: string | null;
  roles: string[];
  isInitialized: boolean;
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  permissions: [],
  accessToken: null,
  roles: [],
  isInitialized: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string | null;
        user?: User | null;
        permissions?: string[];
        roles?: string[];
      }>
    ) => {
      const { accessToken, user, permissions, roles } = action.payload;
      if (accessToken) state.accessToken = accessToken;
      if (user) state.user = user;
      if (permissions) state.permissions = permissions;
      if (roles) state.roles = roles;
    },
    logout: (state) => {
      state.user = null;
      state.permissions = [];
      state.accessToken = null;
      state.roles = [];
    },
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    setRoles: (state, action: PayloadAction<string[]>) => {
      state.roles = action.payload;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export default authReducer;
