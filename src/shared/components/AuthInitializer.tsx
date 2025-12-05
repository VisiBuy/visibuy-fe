import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { authActions } from "../../features/auth/authSlice";
import { useRefreshMutation } from "../../features/auth/authApi";

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * AuthInitializer component handles authentication state restoration on app load.
 *
 * - Checks persisted user data on mount
 * - If user data exists, calls refresh endpoint (token in httpOnly cookie)
 * - Updates auth state with fresh data from server
 * - Sets isInitialized flag when done
 * - Shows loading state during initialization
 */
export const AuthInitializer: React.FC<AuthInitializerProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const [refresh] = useRefreshMutation();
  const { user, isInitialized, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const initializeAuth = async () => {
      // If already initialized, skip
      if (isInitialized) return;

      dispatch(authActions.setLoading(true));

      try {
        // If we have persisted user data, try to refresh to get fresh data
        // The token is in httpOnly cookie and will be sent automatically
        if (user) {
          try {
            const result = await refresh().unwrap();
            const { accessToken, user: freshUser, permissions, roles } = result;

            // Update state with fresh data from server
            dispatch(
              authActions.setCredentials({
                accessToken,
                user: freshUser,
                permissions,
                roles,
              })
            );
          } catch (error) {
            // Refresh failed - token might be expired or invalid
            // Clear persisted state
            dispatch(authActions.logout());
          }
        }
        // If no user data exists, that's fine - user is not logged in
      } finally {
        dispatch(authActions.setLoading(false));
        dispatch(authActions.setInitialized(true));
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Show loading state during initialization
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
