import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
// import { IoNotificationsOutline } from "react-icons/io5";

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
      {/* bg-gray-50 dark:bg-gray-950 */}
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto justify-center'>
        <div className='p-6'>
          {/* Mobile menu button */}
          {/* <div className='md:hidden bg-blue-600 mb-4 h-14 p-0 items-center justify-between'> */}
          {/* <button
            onClick={() => setSidebarOpen(true)}
            // className='md:hidden m-4 p-2 rounded-lg hover:bg-gray-50'
            className='md:hidden mb-4 p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
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
          </button> */}
          {/* </div> */}

          {/* Page Content */}
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};
