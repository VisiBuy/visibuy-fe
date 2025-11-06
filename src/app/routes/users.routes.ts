import { RouteConfig } from "./types";
import { createPermissionRoute, createLazyRoute } from "./builders";
import { ROUTES } from "./constants";

/**
 * Users feature routes
 */
export const usersRoutes: RouteConfig[] = [
  createPermissionRoute({
    path: ROUTES.USERS.LIST,
    requiredPermissions: ["users.read"],
    lazy: () => import("../../pages/Users/UsersPage"),
    meta: {
      title: "Users",
      showInNav: true,
      icon: "users",
    },
    
  }),
];
