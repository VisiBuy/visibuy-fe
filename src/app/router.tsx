import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import PasswordForgotPage from "../pages/PasswordForgotPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import UsersPage from "../pages/Users/UsersPage";
import Error401 from "../pages/ErrorPages/401";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },
      { path: "/password-recovery", element: <PasswordForgotPage /> },
      { path: "/password-reset", element: <PasswordResetPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "/dashboard", element: <DashboardPage /> },
        ],
      },
      {
        element: <ProtectedRoute requiredPermissions={["VIEW_USERS"]} />,
        children: [{ path: "/users", element: <UsersPage /> }],
      },
      { path: "/error/401", element: <Error401 /> },
      { path: "*", element: <Navigate to='/dashboard' replace /> },
    ],
  },
]);
