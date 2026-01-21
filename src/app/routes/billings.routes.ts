import { RouteConfig } from "./types";
import {
  createPermissionRoute,
  createLazyRoute,
  createRouteGroup,
  createProtectedRoute,
} from "./builders";
import { ROUTES } from "./constants";

/**
 * Users feature routes
 */
export const billingsRoutes: RouteConfig[] = createRouteGroup({
  basePath: ROUTES.BILLLING.ROOT,

  children: [
    createProtectedRoute({
      path: "",
      // requiredPermissions: ["billings.read"],
      lazy: () => import("../../pages/Billing&Credit/Billing&Credit"),
      meta: {
        title: "Billing & Credit",
        showInNav: true,
        icon: "credit-card",
      },
    }),
  ],
});
