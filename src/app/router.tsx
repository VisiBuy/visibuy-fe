import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { allRoutes, toRouteObjects } from "./routes";
import { ROUTES } from "./routes/constants";
import UsersPage from "@/pages/Users/UsersPage";
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
      { path: "/login", element: <LoginScreen /> },
      { path: "/signup", element: <SignupScreen /> },
      { path: "/forgot-password", element: <ForgotPasswordScreen /> },
      { path: "/auth/reset-password", element: <ResetPasswordScreen /> },

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
      {
        path: "/verification/:id",
        element: <VerificationDetailsPage />,
      },

      // 404 catch-all
      {
        path: "*",
        element: <Navigate to={ROUTES.ERROR.NOT_FOUND} replace />,
      },
    ],
  },
]);
