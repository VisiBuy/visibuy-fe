import { RouteConfig } from "./types";
import { createRoute, createLazyRoute } from "./builders";
import { ROUTES } from "./constants";

/**
 * Error page routes (public)
 */
export const errorRoutes: RouteConfig[] = [
  createLazyRoute({
    path: ROUTES.ERROR.UNAUTHORIZED,
    lazy: () => import("../../pages/ErrorPages/401"),
    meta: {
      title: "Unauthorized",
      showInNav: false,
    },
  }),
];
