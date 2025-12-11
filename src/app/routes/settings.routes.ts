import { RouteConfig } from "./types";
import { createLazyRoute, createRouteGroup, createProtectedRoute } from "./builders";
import { ROUTES } from "./constants";


export const settingsRoutes: RouteConfig[] = createRouteGroup({
  basePath: ROUTES.SETTINGS.ROOT,
  protected: true,
  meta: {
    title: "Settings",
    showInNav: true,
    icon: "settings",
  },
  children: [
    createProtectedRoute({
      path: "",
      lazy: () => import("../../pages/Settings/SettingsPage"),
      meta: {
        title: "Settings",
        breadcrumb: "Settings",
        showInNav: true,
      },
    }),
    createProtectedRoute({
      path: "profile",
      lazy: () => import("../../pages/Settings/ProfilePage"),
      meta: {
        title: "Profile",
        breadcrumb: "Profile", 
        showInNav: false,
      },
    }),
    createProtectedRoute({
      path: "security",
      lazy: () => import("../../pages/Settings/SecurityPage"),
      meta: {
        title: "Security",
        breadcrumb: "Security",
        showInNav: false,
      },
    }),
    createProtectedRoute({
      path: "notifications",
      lazy: () => import("../../pages/Settings/NotificationPreferencesPage"),
      meta: {
        title: "Notifications",
        breadcrumb: "Notifications",
        showInNav: false,
      },
    }),
    createProtectedRoute({
      path: "payment",
      lazy: () => import("../../pages/Settings/PaymentPage"),
      meta: {
        title: "Payment",
        breadcrumb: "Payment",
        showInNav: false,
      },
    }),
    createProtectedRoute({
      path: "api",
      lazy: () => import("../../pages/Settings/ApiPage"),
      meta: {
        title: "API Access",
        breadcrumb: "API",
        showInNav: false,
      },
    }),
    createProtectedRoute({
      path: "help",
      lazy: () => import("../../pages/Settings/HelpPage"),
      meta: {
        title: "Help & Support",
        breadcrumb: "Help",
        showInNav: false,
      },
    }),
  ],
});
