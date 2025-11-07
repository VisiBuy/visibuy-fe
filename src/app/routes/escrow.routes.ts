import { RouteConfig } from "./types";
import {
  createRouteGroup,
  createPermissionRoute,
  createLazyRoute,
} from "./builders";
import { ROUTES } from "./constants";

/**
 * Escrow feature routes (read-only for vendors)
 */
export const escrowRoutes: RouteConfig[] = createRouteGroup({
  basePath: ROUTES.ESCROWS.LIST,
  defaultPermissions: ["escrows.read"],
  meta: {
    title: "Escrows",
    showInNav: true,
    icon: "escrow",
  },
  children: [
    createLazyRoute({
      path: "",
      lazy: () => import("../../pages/Users/UsersPage"), // TODO: Create EscrowsListPage
      meta: {
        title: "Escrows",
        breadcrumb: "Escrows",
      },
    }),
    createPermissionRoute({
      path: ":id",
      requiredPermissions: ["escrows.read"],
      lazy: () => import("../../pages/Users/UsersPage"), // TODO: Create EscrowsDetailPage
      meta: {
        title: "Escrow Details",
        breadcrumb: "Details",
        
      },
    }),
  ],
});
