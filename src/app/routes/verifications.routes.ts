import { RouteConfig } from "./types";
import {
  createPermissionRoute,
  createLazyRoute,
  createRouteGroup,
  createProtectedRoute,
} from "./builders";
import { ROUTES } from "./constants";

/**
 * Verification feature routes
 * All routes require verifications.read permission by default
 */
export const verificationRoutes: RouteConfig[] = createRouteGroup({
  basePath: ROUTES.VERIFICATIONS.LIST,
  defaultPermissions: ["verifications.read"],
  meta: {
    title: "Verifications",
    showInNav: true,
    icon: "verifications",
  },
  children: [
    createProtectedRoute({
      path: "verification-list", 
      lazy: () => import("../../pages/Verifications/VerificationListPage"), // Implemented VerificationsListPage
      meta: {
        title: "Verifications",
        breadcrumb: "Verifications",
        showInNav: true,
      },
    }),
    createPermissionRoute({
      path: "create", // Relative to basePath
      requiredPermissions: ["verifications.create"],
      lazy: () => import("../../pages/Users/UsersPage"), // TODO: Create VerificationsCreatePage
      meta: {
        title: "Create Verification",
        breadcrumb: "Create",
        showInNav: false,
      },
    }),
    createPermissionRoute({
      path: ":id", // Relative to basePath
      requiredPermissions: ["verifications.read"],
      lazy: () => import("../../pages/Users/UsersPage"), // TODO: Create VerificationsDetailPage
      meta: {
        title: "Verification Details",
        breadcrumb: "Details",
        showInNav: false,
      },
    }),
    createPermissionRoute({
      path: ":id/edit", // Relative to basePath
      requiredPermissions: ["verifications.update"],
      lazy: () => import("../../pages/Users/UsersPage"), // TODO: Create VerificationsEditPage
      meta: {
        title: "Edit Verification",
        breadcrumb: "Edit",
        showInNav: false,
      },
    }),
  ],
});
