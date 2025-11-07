import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import LoginPage from "../pages/Auth/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import UsersPage from "../pages/Users/UsersPage";
import Error401 from "../pages/ErrorPages/401";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import SettingsPage from "../pages/Settings/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/login", element: <LoginPage /> },

      {
        element: <ProtectedRoute />,
        children: [{ index: true, element: <DashboardPage /> }],
      },

      {
        element: <ProtectedRoute />,
        children: [{ path: "/users", element: <UsersPage /> }],
      },

      {
        element: <ProtectedRoute />,
        children: [{ path: "/settings", element: <SettingsPage /> }],
      },

      { path: "/error/401", element: <Error401 /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
