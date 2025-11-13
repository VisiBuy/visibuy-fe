import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

type ProtectedRouteProps = {
  requiredPermissions?: string[];
  redirectPath?: string;
  children?: React.ReactNode;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredPermissions,
  redirectPath = "/login",
  children,
}) => {
  const user = useAppSelector((s) => s.auth.user);
  const permissions = useAppSelector((s) => s.auth.permissions);
  const isInitialized = useAppSelector((s) => s.auth.isInitialized);
  const isLoading = useAppSelector((s) => s.auth.isLoading);

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

  // After initialization, check if user exists
  if (!user) return <Navigate to={redirectPath} replace />;

  // Check permissions if required
  if (requiredPermissions && requiredPermissions.length > 0) {
    const allowed = requiredPermissions.some((p) => permissions.includes(p));
    if (!allowed) return <Navigate to="/error/401" replace />;
  }

  // If children are provided, render them directly (for wrapping)
  // Otherwise, use Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};