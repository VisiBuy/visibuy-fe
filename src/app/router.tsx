import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { allRoutes, toRouteObjects } from "./routes";
import { ROUTES } from "./routes/constants";
import UsersPage from "@/pages/Verifications/CreateVerification";
import { ProtectedLayout } from "../shared/layout/ProtectedLayout";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";

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
      ...toRouteObjects(
        allRoutes.filter((route) => {
          const path = route.path;
          return (
            path === "/login" ||
            path.startsWith("/error") ||
            path.startsWith("/forgot-password") ||
            path.startsWith("/reset-password") ||
            path.startsWith("/signup") ||
            path === ROUTES.AUTH.SOFT_KYC ||
            path === ROUTES.AUTH.EMAIL_VERIFICATION_SUCCESS
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

      // 404 catch-all
      {
        path: "*",
        element: <Navigate to={ROUTES.ERROR.NOT_FOUND} replace />,
      },
    ],
  },
]);
