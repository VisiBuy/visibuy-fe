import { RouteConfig } from "./types";
import { createRoute, createLazyRoute } from "./builders";
import { ROUTES } from "./constants";

/**
 * Authentication-related routes (public)
 */
export const authRoutes: RouteConfig[] = [
  createLazyRoute({
    path: ROUTES.AUTH.LOGIN,
    lazy: () => import("../../pages/Auth/LoginScreen"),
    meta: {
      title: "Login",
      showInNav: false,
    },
  }),
  createLazyRoute({
    path: ROUTES.AUTH.SIGNUP,
    lazy: () => import("../../pages/Auth/SignupScreen"),
    meta: {
      title: "Login",
      showInNav: false,
    },
  }),
  createLazyRoute({
    path: ROUTES.AUTH.FORGOT_PASSWORD,
    lazy: () => import("../../pages/Auth/ForgotPasswordScreen"),
    meta: {
      title: "Login",
      showInNav: false,
    },
  }),
  createLazyRoute({
    path: ROUTES.AUTH.RESET_PASSWORD,
    lazy: () => import("../../pages/Auth/ResetPasswordScreen"),
    meta: {
      title: "Login",
      showInNav: false,
    },
  }),
];
