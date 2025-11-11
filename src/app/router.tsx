import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { allRoutes, toRouteObjects } from "./routes";
import { ROUTES } from "./routes/constants";
import { ProtectedLayout } from "../shared/layout/ProtectedLayout";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";

// ⚙️ Settings Pages (added)
import SettingsPage from "../pages/Settings/SettingsPage";
import ProfilePage from "../pages/Settings/ProfilePage";
import SecurityPage from "../pages/Settings/SecurityPage";
import NotificationsPage from "../pages/Settings/NotificationsPage";
import PaymentPage from "../pages/Settings/PaymentPage";
import ApiPage from "../pages/Settings/ApiPage";
import HelpPage from "../pages/Settings/HelpPage";

/**
 * Main application router
 *
 * Combines auto-generated routes from src/app/routes
 * and manual routes for Settings and error pages.
 */
export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Public routes (auth, error pages) - no sidebar
      ...toRouteObjects(
        allRoutes.filter((route) => {
          const path = route.path;
          return (
            path === "/login" ||
            path.startsWith("/error") ||
            path.startsWith("/forgot-password") ||
            path.startsWith("/reset-password") ||
            path.startsWith("/signup")
          );
        })
      ),

      // Protected routes with sidebar layout
      {
        element: <ProtectedLayout />,
        children: [
          ...toRouteObjects(
            allRoutes.filter((route) => {
              const path = route.path;
              return (
                path !== "/login" &&
                !path.startsWith("/error") &&
                !path.startsWith("/forgot-password") &&
                !path.startsWith("/reset-password") &&
                !path.startsWith("/signup")
              );
            })
          ),

          // ✅ Settings routes
          {
            element: <ProtectedRoute />,
            children: [
              { path: "settings", element: <SettingsPage /> },
              { path: "settings/profile", element: <ProfilePage /> },
              { path: "settings/security", element: <SecurityPage /> },
              { path: "settings/notifications", element: <NotificationsPage /> },
              { path: "settings/payment", element: <PaymentPage /> },
              { path: "settings/api", element: <ApiPage /> },
              { path: "settings/help", element: <HelpPage /> },
            ],
          },
        ],
      },

      // Root redirect
      {
        path: "/",
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },

      // 404 catch-all
      {
        path: "*",
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
    ],
  },
]);
