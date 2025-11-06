import { RouteConfig } from "./types";
import { createRoute, createLazyRoute } from "./builders";
import { ROUTES } from "./constants";

/**
 * Authentication-related routes (public)
 */
export const authRoutes: RouteConfig[] = [
  createLazyRoute({
    path: ROUTES.AUTH.LOGIN,
    lazy: () => import("../../pages/Auth/LoginPage"),
    meta: {
      title: "Login",
      showInNav: false,
    },
  }),
];
