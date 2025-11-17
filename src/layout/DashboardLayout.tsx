import React from "react";
import { Sidebar } from "../shared/layout/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className='w-full'>
      <div className='bg-blue-700 h-20'></div>
      <div className='md:absolute md:top-[-10]'>
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
};
// <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
//   {/* <Sidebar /> */}

//   {/* Main content */}
//   <div className='lg:pl-64'>
//     <main className='p-6'>{children}</main>
//   </div>
// </div>
