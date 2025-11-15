import React from "react";
import { Outlet } from "react-router-dom";
import { AuthInitializer } from "../shared/components/AuthInitializer";

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
      </div>
    </AuthInitializer>
  );
}
