import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useLogoutMutation } from "../../features/auth/authApi";
import { useNavigationItems } from "../hooks/useNavigationItems";
import { SidebarNavItem } from "./SidebarNavItem";
import { SidebarProps } from "../types/navigation";
import { renderIcon } from "../utils/iconMap";

/**
 * Main sidebar navigation component
 * Responsive, collapsible sidebar with permission-based navigation items
 */
export const Sidebar: React.FC<SidebarProps> = ({
  isOpen: controlledIsOpen,
  onToggle,
  className = "",
  showUserProfile = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [logout] = useLogoutMutation();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use controlled or internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleSidebar = onToggle || (() => setInternalIsOpen(!internalIsOpen));

  const navItems = useNavigationItems();

  // Check if a nav item is active (matches current path)
  const isItemActive = (itemPath: string): boolean => {
    if (location.pathname === itemPath) return true;
    // Check if current path starts with item path (for nested routes)
    return location.pathname.startsWith(itemPath + "/");
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
          z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto
          w-64 flex flex-col
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              VisiBuy
            </h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
            aria-label="Toggle sidebar"
          >
            {renderIcon("close", "w-5 h-5")}
          </button>
        </div>

        {/* User Profile Section */}
        {showUserProfile && user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.path}
                item={item}
                isActive={isItemActive(item.path)}
                onClick={toggleSidebar} // Close sidebar on mobile when item clicked
              />
            ))}
          </ul>
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            {renderIcon("logout", "w-5 h-5")}
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

