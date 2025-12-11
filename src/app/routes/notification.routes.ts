import { RouteConfig } from "./types";
import { createProtectedRoute } from "./builders";
import { ROUTES } from "./constants";

/**
 * Notification feature routes
 */
export const notificationRoutes: RouteConfig[] = [
  createProtectedRoute({
    path: ROUTES.SETTINGS.NOTIFICATIONS,
    lazy: () => import("../../pages/NotificationPreferences/NotificationPreferencesPage"),
    meta: {
      title: "Notifications",
      showInNav: true,
      icon: "notification",
    },
  }),
];

