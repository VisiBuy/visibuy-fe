import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { IoNotificationsOutline } from "react-icons/io5";

/**
 * Main application layout wrapper
 * Provides sidebar navigation and content area
 */
export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    switch (path) {
      case "/":
        return "Dashboard";
      // case "/settings":
      //   return "Settings";
      case "/verification":
        return "Verification";
      case "/reports":
        return "Reports";
      case "/settings":
        return "Settings";
      default:
        // Catch dynamic routes like /users/23 -> "Users"
        return (
          path.split("/")[1]?.charAt(0).toUpperCase() +
            path.split("/")[1]?.slice(1) || ""
        );
    }
  };

  const pageTitle = getPageTitle();

  return (
    <div className='flex h-screen '>
      {/* bg-gray-50 dark:bg-gray-950 */}
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto justify-center md:ml-64'>
        <div className='p-0 bg-blue-500 md:h-28'>
          {/* Mobile menu button */}
          <div className='flex md:hidden bg-blue-600 mb-4 h-14 p-0 items-center justify-between'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='md:hidden m-4 p-2 rounded-lg hover:bg-gray-50'
              aria-label='Open sidebar'
            >
              <svg
                className='w-6 h-6 text-white text-white'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path d='M4 6h16M4 12h16M4 18h16'></path>
              </svg>
            </button>
            <div className='flex item-center justify-center'>
              <span className='font-bold text-xl text-white'>{pageTitle}</span>
            </div>
            <div className='w-12'>
              <IoNotificationsOutline className='w-6 h-6 text-white' />
            </div>
          </div>

          {/* Page Content */}
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};
