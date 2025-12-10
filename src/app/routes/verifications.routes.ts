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
    // Default Verifications List Page
    createProtectedRoute({
      path: "",
      lazy: () => import("../../pages/Verifications/VerificationListPage"), // Implemented VerificationsListPage
      meta: {
        title: "Verifications",
        breadcrumb: "Verifications",
        showInNav: true,
      },
    }),

    // ⭐ KYC Verification Page
    createPermissionRoute({
      path: "kyc",
      requiredPermissions: ["verifications.read"],
      lazy: () =>
        import("../../pages/Verifications/KycVerificationPage"),
      meta: {
        title: "KYC Verification",
        breadcrumb: "KYC",
        showInNav: false,
      },
    }),

    // ⭐ NEW: KYC Submission Success Page
    createPermissionRoute({
      path: "kyc/success",
      requiredPermissions: ["verifications.read"],
      lazy: () =>
        import("../../pages/Verifications/KycSubmissionSuccessPage"),
      meta: {
        title: "KYC Success",
        breadcrumb: "Success",
        showInNav: false,
      },
    }),

    // ⭐ NEW: KYC Approved Page
    createPermissionRoute({
      path: "kyc/approved",
      requiredPermissions: ["verifications.read"],
      lazy: () =>
        import("../../pages/Verifications/KycApprovedPage"),
      meta: {
        title: "KYC Approved",
        breadcrumb: "Approved",
        showInNav: false,
      },
    }),

    // Create Verification
    createPermissionRoute({
      path: "create",
      requiredPermissions: ["verifications.create"],
      lazy: () => import("../../pages/Verifications/CreateVerification"), // TODO: Create VerificationsCreatePage
      meta: {
        title: "Create Verification",
        breadcrumb: "Create",
        showInNav: false,
      },
    }),

    // View Verification Details
    createPermissionRoute({
      path: ":id",
      requiredPermissions: ["verifications.read"],
      lazy: () => import("../../pages/Verifications/VerificationDetailsPage"), // TODO: Create VerificationsDetailPage
      meta: {
        title: "Verification Details",
        breadcrumb: "Details",
        showInNav: false,
      },
    }),

    // Edit Verification
    createPermissionRoute({
      path: ":id/edit",
      requiredPermissions: ["verifications.update"],
      lazy: () => import("../../pages/Verifications/CreateVerification"), // TODO: Create VerificationsEditPage
      meta: {
        title: "Edit Verification",
        breadcrumb: "Edit",
        showInNav: false,
      },
    }),
  ],
});
