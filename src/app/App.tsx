import React from "react";
import { Outlet } from "react-router-dom";
import { AuthInitializer } from "../shared/components/AuthInitializer";
import { Toaster } from 'react-hot-toast';

/**
 * Main App component
 * - Wrapped with AuthInitializer to handle auth state restoration
 * - Simple container for routing
 */
export default function App() {
  return (
    <AuthInitializer>
      <div>
        <Outlet />
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </AuthInitializer>
  );
}