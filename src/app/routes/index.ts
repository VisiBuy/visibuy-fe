/**
 * Central export for all route configurations
 * Import this file to get all routes for the router
 */

import { RouteConfig } from "./types";
import { authRoutes } from "./auth.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { usersRoutes } from "./users.routes";
import { verificationRoutes } from "./verifications.routes";
import { mediaRoutes } from "./media.routes";
import { escrowRoutes } from "./escrow.routes";
import { apiKeysRoutes } from "./apiKeys.routes";
import { settingsRoutes } from "./settings.routes";
import { errorRoutes } from "./error.routes";

/**
 * All application routes combined
 * Routes are ordered by priority (more specific routes should come first)
 * Note: Order matters - more specific routes should come before less specific ones
 */
export const allRoutes: RouteConfig[] = [
  // Public routes
  ...authRoutes,
  ...errorRoutes,

  // Protected routes (order: specific to general)
  ...dashboardRoutes, // Dashboard should be last as it's often a catch-all
  ...verificationRoutes,
  ...apiKeysRoutes,
  ...mediaRoutes,
  ...settingsRoutes,
  ...escrowRoutes,
  ...usersRoutes,
];

// Re-export types and utilities for convenience
export * from "./types";
export * from "./constants";
export * from "./builders";

// Re-export individual route modules for advanced use cases
export { authRoutes } from "./auth.routes";
export { dashboardRoutes } from "./dashboard.routes";
export { usersRoutes } from "./users.routes";
export { verificationRoutes } from "./verifications.routes";
export { mediaRoutes } from "./media.routes";
export { escrowRoutes } from "./escrow.routes";
export { apiKeysRoutes } from "./apiKeys.routes";
export { settingsRoutes } from "./settings.routes";
export { errorRoutes } from "./error.routes";
