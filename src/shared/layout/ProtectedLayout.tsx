import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useGetKycStatusQuery } from "@/features/kyc/kycApi";
import { getKycRedirectPath } from "@/shared/utils/kycCheck";
import { ROUTES } from "@/app/routes/constants";
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

  // Check KYC status if user is authenticated
  const { data: kycStatus, isLoading: isKycLoading } = useGetKycStatusQuery(
    undefined,
    {
      skip: !user,
    }
  );

  // Wait for auth initialization to complete
  if (!isInitialized || isLoading || (user && isKycLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-space-16"></div>
          <p className="text-neutral-600 text-body-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show sidebar on auth pages
  const isAuthPage =
    location.pathname === ROUTES.AUTH.LOGIN ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname === ROUTES.AUTH.SOFT_KYC ||
    location.pathname === ROUTES.AUTH.EMAIL_VERIFICATION_SUCCESS;

  // Check KYC status and redirect if needed (only for authenticated users on non-auth pages)
  // Don't redirect if already on the soft KYC page or success page
  if (user && !isAuthPage && kycStatus) {
    const kycRedirectPath = getKycRedirectPath(kycStatus);
    if (
      kycRedirectPath &&
      location.pathname !== kycRedirectPath &&
      location.pathname !== ROUTES.AUTH.EMAIL_VERIFICATION_SUCCESS
    ) {
      return <Navigate to={kycRedirectPath} replace />;
    }
  }

  // Allow authenticated users to access soft KYC pages (they're in public routes but need auth)
  if (
    user &&
    isAuthPage &&
    (location.pathname === ROUTES.AUTH.SOFT_KYC ||
      location.pathname === ROUTES.AUTH.EMAIL_VERIFICATION_SUCCESS)
  ) {
    return <Outlet />;
  }

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
