import { RouteConfig } from "./types";
import {
  createProtectedRoute,
  createLazyRoute,
  createPermissionRoute,
} from "./builders";
import { ROUTES } from "./constants";

/**
 * Dashboard routes
 * Dashboard is a protected route that serves as the main entry point
 */
export const dashboardRoutes: RouteConfig[] = [
  createProtectedRoute({
    path: ROUTES.DASHBOARD,
    lazy: () => import("../../pages/Dashboard/DashboardPage"),
    meta: {
      title: "Home",
      showInNav: true,
      icon: "dashboard",
    },
  }),
];
