// src/layouts/AppLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-neutral-100">
      {/* FULL-WIDTH BLACK TOP BANNER */}
      <div className="w-full bg-neutral-black text-neutral-white text-body-small px-space-24 py-space-8 text-center shrink-0">
        We just released the referral code feature on our dashboard →{" "}
        <span className="text-primary-blue underline cursor-pointer hover:text-primary-blue/80 transition-standard">
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
          <header className="bg-primary-blue text-neutral-white px-space-24 py-space-20 shadow-elevation-1 shrink-0">
            {/* Page title is now handled inside each page component */}
          </header>

          {/* SCROLLABLE PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full p-space-24">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};