/**
 * Centralized route path constants
 * Use these constants instead of hardcoded strings for better maintainability
 */
export const ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: "/login",
    SIGNUP: "/signup",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  // Dashboard
  DASHBOARD: "/dashboard",

  // Users
  USERS: {
    LIST: "/users",
    CREATE: "/users/create",
    DETAIL: (id: string) => `/users/${id}`,
    EDIT: (id: string) => `/users/${id}/edit`,
  },

  // Verifications
  VERIFICATIONS: {
    LIST: "/verifications",
    CREATE: "/verifications/create",
    DETAIL: (id: string) => `/verifications/${id}`,
    EDIT: (id: string) => `/verifications/${id}/edit`,
  },

  // Media
  MEDIA: {
    LIST: "/media",
    UPLOAD: "/media/upload",
    DETAIL: (id: string) => `/media/${id}`,
  },

  // Escrows
  ESCROWS: {
    LIST: "/escrows",
    DETAIL: (id: string) => `/escrows/${id}`,
  },

  // API Keys
  API_KEYS: {
    LIST: "/settings/api-keys",
    CREATE: "/settings/api-keys/create",
    DETAIL: (id: string) => `/settings/api-keys/${id}`,
  },

  // Settings
  SETTINGS: {
    ROOT: "/settings",
    PROFILE: "/settings/profile",
    SECURITY: "/settings/security",
    NOTIFICATIONS: "/settings/notifications",
    PAYMENT: "/settings/payment",
    API: "/settings/api",
    HELP: "/settings/help",
    API_KEYS: "/settings/api-keys",
  },
  //Seller Pages
  SELLER_PROFILE: "/seller/profile",
  // Edit Seller Profile
  SELLER_PROFILE_EDIT: "/seller/profile/edit", 
  // Seller Public Profile
  SELLER_PUBLIC_PROFILE: "/seller/public/:username",
  // Error pages
  ERROR: {
    NOT_FOUND: "/404",
    UNAUTHORIZED: "/error/401",
    FORBIDDEN: "/error/403",
    SERVER_ERROR: "/error/500",
  },
} as const;

/**
 * Helper function to generate route paths with parameters
 */
export const createRoutePath = {
  users: {
    detail: (id: string) => `/users/${id}`,
    edit: (id: string) => `/users/${id}/edit`,
  },
  verifications: {
    detail: (id: string) => `/verifications/${id}`,
    edit: (id: string) => `/verifications/${id}/edit`,
  },
  media: {
    detail: (id: string) => `/media/${id}`,
  },
  escrows: {
    detail: (id: string) => `/escrows/${id}`,
  },
  apiKeys: {
    detail: (id: string) => `/settings/api-keys/${id}`,
  },
};
