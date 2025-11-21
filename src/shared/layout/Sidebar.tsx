import React, { useState } from "react";
import visibuyLogo from "../../assets/visiby-logo.png";
import { SidebarNavItem } from "./SidebarNavItem";

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    {
      name: "Home",
      path: "/dashboard",
      icon: <i className='fa-solid fa-house w-5'></i>,
    },
    {
      name: "Verifications",
      path: "/verifications",
      icon: <i className='fa-solid fa-file-circle-check w-5'></i>,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <i className='fa-solid fa-user w-5'></i>,
    },
    {
      name: "Billing & Credits",
      path: "/billing",
      icon: <i className='fa-solid fa-credit-card w-5'></i>,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <i className='fa-solid fa-gear w-5'></i>,
    },
  ];

  const bottomLinks = [
    {
      name: "Payment Methods",
      path: "/payment",
      icon: <i className='fa-solid fa-credit-card w-5'></i>,
    },
    {
      name: "Password & Security",
      path: "/security",
      icon: <i className='fa-solid fa-shield w-5'></i>,
    },
    {
      name: "Notification",
      path: "/notification",
      icon: <i className='fa-regular fa-bell w-5'></i>,
    },
  ];

  return (
    <div className='flex'>
      {/* ===== Desktop Sidebar ===== */}
      <aside className='hidden md:flex flex-col w-64 bg-white border-r shadow-sm'>
        <div className='flex items-center justify-between px-6 py-4 border-b'>
          <div className='flex items-center gap-2'>
            <img src={visibuyLogo} alt='Visibuy' />
            <span className='text-[10px] text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded'>
              Beta
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className='flex-1 px-6 py-4 space-y-2 text-[15px] font-medium'>
          <ul>
            {navLinks.map((link) => (
              <SidebarNavItem
                key={link.name}
                label={link.name}
                path={link.path}
                icon={link.icon}
              />
            ))}
          </ul>
        </nav>

        {/* Bottom Links */}
        <div className='px-6 py-4 border-t text-[15px] font-medium space-y-2'>
          <ul>
            {bottomLinks.map((link) => (
              <SidebarNavItem
                key={link.name}
                label={link.name}
                path={link.path}
                icon={link.icon}
              />
            ))}
          </ul>

          {/* Logout */}
          <button className='flex items-center gap-3 py-2 px-3 rounded-md text-black hover:bg-red-50 w-full transition-all duration-200'>
            <i className='fa-solid fa-right-from-bracket w-5'></i>
            LogOut
          </button>
        </div>
      </aside>

      {/* ===== Mobile Navbar ===== */}
      <div className='md:hidden fixed top-0 left-0 w-full bg-blue-600 text-white flex items-center justify-between px-4 py-3 z-40'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center'
        >
          {isOpen ? (
            <i className='fa-solid fa-xmark w-5'></i>
          ) : (
            <i className='fa-solid fa-bars w-5'></i>
          )}
        </button>
        <h1 className='text-base font-semibold'>Dashboard</h1>
        <div className='w-6'></div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-50 md:hidden'
          onClick={() => setIsOpen(false)}
        >
          <div
            className='absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col justify-between overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='flex items-center justify-between mb-8'>
              <img src={visibuyLogo} alt='Visibuy' />
              <button onClick={() => setIsOpen(false)}>
                <i className='fa-solid fa-xmark w-5'></i>
              </button>
            </div>

            {/* Links */}
            <nav className='space-y-4 flex-1'>
              <ul>
                {navLinks.concat(bottomLinks).map((link) => (
                  <SidebarNavItem
                    key={link.name}
                    label={link.name}
                    path={link.path}
                    icon={link.icon}
                    onClick={() => setIsOpen(false)}
                  />
                ))}
              </ul>
            </nav>

            {/* Logout */}
            <div className='mt-6 border-t pt-4'>
              <button className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-black hover:bg-red-50 transition-colors'>
                <i className='fa-solid fa-right-from-bracket w-5'></i>
                LogOut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
