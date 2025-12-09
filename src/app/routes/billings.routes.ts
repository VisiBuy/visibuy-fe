import { RouteConfig } from "./types";
import {
  createPermissionRoute,
  createLazyRoute,
  createRouteGroup,
} from "./builders";
import { ROUTES } from "./constants";

/**
 * Users feature routes
 */
export const billingsRoutes: RouteConfig[] = createRouteGroup({
  basePath: ROUTES.BILLLING.ROOT,

  children: [
    createPermissionRoute({
      path: "",
      requiredPermissions: ["users.read"],
      lazy: () => import("../../pages/Verifications/CreateVerification"),
      meta: {
        title: "Users",
        showInNav: true,
        icon: "users",
      },
    }),
  ],
});
