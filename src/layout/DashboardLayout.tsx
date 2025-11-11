import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import visibuyLogo from "../assets/visiby-logo.png";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // ===== Extract current route name for mobile title =====
  const getPageName = () => {
    const path = location.pathname.split("/").filter(Boolean).pop();
    if (!path || path === "dashboard") return "Home";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const navLinks = [
    {
      name: "Home",
      path: "/dashboard",
      icon: <i className="fa-solid fa-house w-5"></i>,
    },
    {
      name: "Verifications",
      path: "/dashboard/verifications",
      icon: <i className="fa-solid fa-file-circle-check w-5"></i>,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <i className="fa-solid fa-user w-5"></i>,
    },
    {
      name: "API",
      path: "/dashboard/api",
      icon: <i className="fa-solid fa-gear w-5"></i>,
    },
    {
      name: "Billing & Credits",
      path: "/dashboard/billing",
      icon: <i className="fa-solid fa-credit-card w-5"></i>,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <i className="fa-solid fa-gear w-5"></i>,
    },
  ];

  const bottomLinks = [
    {
      name: "Payment Methods",
      path: "/dashboard/payment",
      icon: <i className="fa-solid fa-credit-card w-5"></i>,
    },
    {
      name: "Password & Security",
      path: "/dashboard/security",
      icon: <i className="fa-solid fa-shield w-5"></i>,
    },
    {
      name: "Notification",
      path: "/dashboard/notification",
      icon: <i className="fa-regular fa-bell w-5"></i>,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ===== Desktop Sidebar ===== */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <img src={visibuyLogo} alt="Visibuy" />
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded">
              Beta
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-6 py-4 space-y-2 text-[15px] font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 ${
                location.pathname === link.path
                  ? "text-black bg-blue-50 font-semibold"
                  : "text-black hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <span className="w-5 flex items-center justify-center">
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="px-6 py-4 border-t text-[15px] font-medium space-y-2">
          {bottomLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 ${
                location.pathname === link.path
                  ? "text-black bg-blue-50 font-semibold"
                  : "text-black hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <span className="w-5 flex items-center justify-center">
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}

          {/* Logout */}
          <button className="flex items-center gap-3 py-2 px-3 rounded-md text-black hover:bg-red-50 w-full transition-all duration-200">
            <i className="fa-solid fa-right-from-bracket w-5"></i>
            LogOut
          </button>
        </div>
      </aside>

      {/* ===== Mobile Navbar ===== */}
      {/* ===== Mobile Navbar ===== */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-blue-600 text-white flex items-center justify-between px-4 py-3 z-40">
        {/* Menu Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Dynamic Page Title */}
        <h1 className="text-base font-semibold">{getPageName()}</h1>

        {/* Spacer to balance layout */}
        <div className="w-6"></div>
      </div>

      {/* ===== Mobile Drawer Menu ===== */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col justify-between overflow-y-auto"
        >
          {/* ===== Drawer Header ===== */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <img src={visibuyLogo} alt="Visibuy" />
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded">
                Beta
              </span>
            </div>
          </div>

          {/* ===== Drawer Navigation Links ===== */}
          <div className="space-y-6 flex-1 overflow-y-auto">
            <nav className="space-y-2 text-[15px] font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 ${
                    location.pathname === link.path
                      ? "text-black bg-blue-50 font-semibold"
                      : "text-black hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* ===== Drawer Footer (Bottom Links + Logout) ===== */}
          <div className="mt-6 border-t pt-4 space-y-2 text-[15px] font-medium">
            {bottomLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-black hover:bg-gray-100 hover:text-blue-600"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 py-2 px-3 rounded-md text-black hover:bg-red-50 w-full transition-all duration-200"
            >
              <i className="fa-solid fa-right-from-bracket w-5"></i>
              LogOut
            </button>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <main className="flex-1 mt-12 md:mt-0 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
