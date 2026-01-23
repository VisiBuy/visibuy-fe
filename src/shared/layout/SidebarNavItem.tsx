import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarNavItemProps {
  label: string;
  path: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  label,
  path,
  icon,
  onClick,
}) => {
  return (
    <li> 
      <NavLink
        to={path}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-200 ${
            isActive
              ? "text-black bg-blue-50 font-semibold"
              : "text-black hover:bg-gray-100 hover:text-blue-600"
          }`
        }
      >
        {icon}
        {label}
      </NavLink>
    </li>
  );
};
