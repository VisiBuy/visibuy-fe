import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { allRoutes, toRouteObjects } from "./routes";
import { ROUTES } from "./routes/constants";
import { ProtectedLayout } from "../shared/layout/ProtectedLayout";

/**
 * Main application router
 *
 * This router is built from modular route configurations defined in
 * src/app/routes/. Routes are automatically converted to React Router
 * RouteObjects with proper protection, lazy loading, and metadata.
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
        ],
      },

      // Root redirect
      {
        path: "/",
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },

      // 404 catch-all - must be last
      {
        path: "*",
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
    ],
  },
]);
