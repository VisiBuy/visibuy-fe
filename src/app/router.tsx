import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import LoginPage from "../pages/Auth/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import UsersPage from "../pages/Users/UsersPage";
import Error401 from "../pages/ErrorPages/401";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";

// ⚙️ Settings Pages (added)
import SettingsPage from "../pages/Settings/SettingsPage";
import ProfilePage from "../pages/Settings/ProfilePage";
import SecurityPage from "../pages/Settings/SecurityPage";
import NotificationsPage from "../pages/Settings/NotificationsPage"; // ✅ corrected name
import PaymentPage from "../pages/Settings/PaymentPage";
import ApiPage from "../pages/Settings/ApiPage";
import HelpPage from "../pages/Settings/HelpPage";

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

      // ✅ Settings routes (added cleanly here)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/settings", element: <SettingsPage /> },
          { path: "/settings/profile", element: <ProfilePage /> },
          { path: "/settings/security", element: <SecurityPage /> },
          { path: "/settings/notifications", element: <NotificationsPage /> },
          { path: "/settings/payment", element: <PaymentPage /> },
          { path: "/settings/api", element: <ApiPage /> },
          { path: "/settings/help", element: <HelpPage /> },
        ],
      },

      { path: "/error/401", element: <Error401 /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
