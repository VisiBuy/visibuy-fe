import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../app/routes/constants";
import { renderIcon } from "../../utils/iconMap";

interface QuickAction {
  label: string;
  icon: string;
  path: string;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Add Product",
    icon: "plus",
    path: "/products/create", // This might need to be added to routes
    description: "List a new product for sale",
  },
  {
    label: "View Orders",
    icon: "shopping-cart",
    path: "/orders", // This might need to be added to routes
    description: "Manage customer orders",
  },
  {
    label: "Analytics",
    icon: "chart-bar",
    path: "/analytics", // This might need to be added to routes
    description: "View detailed analytics",
  },
  {
    label: "Settings",
    icon: "settings",
    // path: ROUTES.USERS.LIST, // Using existing route for now
    path: "/settings",
    description: "Configure your account",
  },
];

interface QuickActionsProps {
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  className = "",
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}
    >
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        Quick Actions
      </h3>

      <div className='grid grid-cols-2 gap-4'>
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left group'
          >
            <div className='flex items-center gap-3 mb-2'>
              <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors'>
                {renderIcon(
                  action.icon,
                  "w-5 h-5 text-blue-600 dark:text-blue-400"
                )}
              </div>
              <span className='font-medium text-gray-900 dark:text-white'>
                {action.label}
              </span>
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
