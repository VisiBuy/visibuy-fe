// src/layouts/AppLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* FULL-WIDTH BLACK TOP BANNER */}
      <div className="w-full bg-black text-white text-sm px-6 py-2 text-center shrink-0">
        We just released the referral code feature on our dashboard →{" "}
        <span className="text-blue-400 underline cursor-pointer hover:text-blue-300 transition">
          To earn delivery point, Try it out.
        </span>
      </div>

      {/* MAIN LAYOUT: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (handles its own mobile state) */}
        <Sidebar />


        {/* Content Area */}
        <div className="flex flex-col flex-1">
          {/* BLUE HEADER – always visible */}
          <header className="bg-blue-600 text-white px-6 py-5 shadow-md shrink-0">
            {/* Page title is now handled inside each page component */}
          </header>

          {/* SCROLLABLE PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full p-6">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};