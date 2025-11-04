import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import LoginPage from "../pages/Auth/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import UsersPage from "../pages/Users/UsersPage";
import Error401 from "../pages/ErrorPages/401";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import LoginScreen from "@/pages/Auth/LoginScreen";
import SignupScreen from "@/pages/Auth/SignupScreen";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
        { path: "/login", element: <LoginScreen /> },
      { path: "/signup", element: <SignupScreen /> }, 
      {
        element: <ProtectedRoute />,
        children: [{ index: true, element: <DashboardPage /> }],
      },
      {
        element: <ProtectedRoute requiredPermissions={["VIEW_USERS"]} />,
        children: [{ path: "/users", element: <UsersPage /> }],
      },
      { path: "/error/401", element: <Error401 /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
