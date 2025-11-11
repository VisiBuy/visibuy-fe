import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { allRoutes, toRouteObjects } from "./routes";
import { ROUTES } from "./routes/constants";
import { ProtectedLayout } from "../shared/layout/ProtectedLayout";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import LoginScreen from "@/pages/Auth/LoginScreen";
import SignupScreen from "@/pages/Auth/SignupScreen";
import OnboardingPage from "@/pages/Auth/onbaording/OnboardingPage";
import ForgotPasswordScreen from "@/pages/Auth/ForgotPasswordScreen";
import ResetPasswordScreen from "@/pages/Auth/ResetPasswordScreen";



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
                        { path: "/reset-password", element: <ResetPasswordScreen /> }, 


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

      // 404 catch-all
      {
        path: "*",
        element: <Navigate to={ROUTES.ERROR.NOT_FOUND} replace />,
      },
    ],
  },
]);
