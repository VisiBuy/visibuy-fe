import { RouteConfig } from "./types";
import {
  createRouteGroup,
  createPermissionRoute,
  createLazyRoute,
} from "./builders";
import { ROUTES } from "./constants";

/**
 * API Keys feature routes
 */
export const apiKeysRoutes: RouteConfig[] = createRouteGroup({
  basePath: ROUTES.API_KEYS.LIST,
  defaultPermissions: ["api_keys.read"],
  meta: {
    title: "API Keys",
    showInNav: true,
    icon: "api-keys",
  },
  children: [
    createLazyRoute({
      path: "",
      // lazy: () => import("../../pages/Users/UsersPage"), // TODO: Create ApiKeysListPage
      lazy: () => import("../../pages/Settings/api/ApiPage"), 

      // lazy: () => import("../../pages/Verifications/CreateVerification"), 
      meta: {
        title: "API Keys",
        breadcrumb: "API Keys",
      },
    }),
    createPermissionRoute({
      path: "create",
      requiredPermissions: ["api_keys.create"],
      lazy: () => import("../../pages/Verifications/CreateVerification"), // TODO: Create ApiKeysCreatePage
      meta: {
        title: "Create API Key",
        breadcrumb: "Create",
        showInNav: false,
      },
    }),
    createPermissionRoute({
      path: ":id",
      requiredPermissions: ["api_keys.read"],
      lazy: () => import("../../pages/Verifications/CreateVerification"), // TODO: Create ApiKeysDetailPage
      meta: {
        title: "API Key Details",
        breadcrumb: "Details",
        showInNav: false,
      },
    }),
  ],
});
