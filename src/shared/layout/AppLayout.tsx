import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

/**
 * Main application layout wrapper
 * Provides sidebar navigation and content area
 */
export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen '>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto justify-center'>
        <div className='p-0'>
          {/* Page Content */}
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};
