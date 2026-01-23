import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = { id: string; email: string; name?: string };
type AuthState = {
  user: User | null;
  permissions: string[];
  accessToken: string | null;
  roles: string[];
  isInitialized: boolean;
  isLoading: boolean;
};

const loadInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      permissions: [],
      accessToken: null,
      roles: [],
      isInitialized: false,
      isLoading: false,
    };
  }

  try {
    const stored = localStorage.getItem('authState');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        isInitialized: false, 
        isLoading: false,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
    localStorage.removeItem('authState');
  }

  return {
    user: null,
    permissions: [],
    accessToken: null,
    roles: [],
    isInitialized: false,
    isLoading: false,
  };
};

const saveStateToStorage = (state: AuthState) => {
  if (typeof window === 'undefined') return;
  
  try {
    const stateToSave = {
      user: state.user,
      permissions: state.permissions,
      accessToken: state.accessToken,
      roles: state.roles,
      isInitialized: state.isInitialized,
    };
    localStorage.setItem('authState', JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save auth state to localStorage:', error);
  }
};

const initialState: AuthState = loadInitialState();

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
      
      saveStateToStorage(state);
    },
    logout: (state) => {
      state.user = null;
      state.permissions = [];
      state.accessToken = null;
      state.roles = [];
      state.isInitialized = true;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authState');
      }
    },
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
      saveStateToStorage(state);
    },
    setRoles: (state, action: PayloadAction<string[]>) => {
      state.roles = action.payload;
      saveStateToStorage(state);
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
      saveStateToStorage(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearPersistedState: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authState');
      }
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;
export default authReducer;