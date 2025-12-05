import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { AppLayout } from "./AppLayout";

/**
 * Protected layout wrapper
 * Shows AppLayout (sidebar + content) only for authenticated users
 * Redirects to login for unauthenticated users
 */
export const ProtectedLayout: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user);
  const isInitialized = useAppSelector((s) => s.auth.isInitialized);
  const isLoading = useAppSelector((s) => s.auth.isLoading);
  const location = useLocation();

  // Wait for auth initialization to complete
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show sidebar on auth pages
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password");

  // Redirect to login if not authenticated (except on auth pages)
  if (!user && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // Show AppLayout for authenticated users (except auth pages)
  if (user && !isAuthPage) {
    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  }

  // For auth pages, just render outlet without sidebar
  return <Outlet />;
};
