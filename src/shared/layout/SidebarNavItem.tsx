import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarNavItemProps } from "../types/navigation";
import { renderIcon } from "../utils/iconMap";

/**
 * Individual navigation item component
 */
export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isActive,
  onClick,
  className = "",
}) => {
  const location = useLocation();
  const isExactMatch = location.pathname === item.path;

  const hasChildren = Array.isArray(item.children) && item.children.length > 0;

  // Determine if any child is active to auto-expand
  const isAnyChildActive = useMemo(() => {
    if (!hasChildren) return false;
    return item.children!.some(
      (child) =>
        location.pathname === child.path ||
        location.pathname.startsWith(child.path + "/")
    );
  }, [hasChildren, item.children, location.pathname]);

  const [expanded, setExpanded] = useState<boolean>(isAnyChildActive);

  // When route changes to a child, ensure expanded state follows
  React.useEffect(() => {
    if (isAnyChildActive && !expanded) setExpanded(true);
  }, [isAnyChildActive, expanded]);

  if (hasChildren) {
    const parentActive = isActive || isExactMatch || isAnyChildActive;
    return (
      <li>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
            ${
              parentActive
                ? "bg-blue-100 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-300"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }
            ${className}
          `}
          title={item.label}
          aria-expanded={expanded}
        >
          {item.icon && (
            <span className="flex-shrink-0">
              {renderIcon(item.icon, "w-5 h-5")}
            </span>
          )}
          <span className="flex-1 truncate text-left">{item.label}</span>
          <span
            className={`transition-transform ${expanded ? "rotate-90" : ""}`}
          >
            {renderIcon("chevronRight", "w-4 h-4")}
          </span>
        </button>

        {expanded && (
          <ul className="mt-1 ml-3 pl-3 border-l border-gray-200 dark:border-gray-800 space-y-1">
            {item.children!.map((child) => {
              const childActive =
                location.pathname === child.path ||
                location.pathname.startsWith(child.path + "/");
              return (
                <SidebarNavItem
                  key={child.path}
                  item={child}
                  isActive={childActive}
                  onClick={onClick}
                />
              );
            })}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        to={item.path}
        onClick={onClick}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
          ${
            isActive || isExactMatch
              ? "bg-blue-100 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-300"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          }
          ${className}
        `}
        title={item.label}
      >
        {item.icon && (
          <span className="flex-shrink-0">
            {renderIcon(item.icon, "w-5 h-5")}
          </span>
        )}
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge && (
          <span className="flex-shrink-0 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  );
};
