import { RouteConfig } from "./types";
import { createProtectedRoute } from "./builders";
import { ROUTES } from "./constants";

/**
 * Notification feature routes
 */
export const notificationRoutes: RouteConfig[] = [
  createProtectedRoute({
    path: ROUTES.NOTIFICATION,
    lazy: () => import("../../pages/NotificationPreferences/NotificationPreferencesPage"),
    meta: {
      title: "Notification",
      showInNav: true,
      icon: "notification",
    },
  }),
];

