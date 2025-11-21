import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../app/routes/constants";
import { renderIcon } from "../../utils/iconMap";

interface QuickAction {
  label: string;
  // icon: string;
  path: string;
  // description: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Create Verification",
    // icon: "",
    path: "/verifications", // This might need to be added to routes
    // description: "List a new product for sale",
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
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
        Quick Actions
      </h3>

      <div className='grid grid-cols-1 gap-4 place-items-center'>
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className='p-4 rounded-3xl bg-blue-500 hover:bg-blue-600 transition-colors flex justify-center w-full md:w-[80%]'
          >
            <div className='flex items-center gap-3 mb-2'>
              {/* <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors'>
                {renderIcon(
                  action.icon,
                  "w-5 h-5 text-blue-600 dark:text-blue-400"
                )}
              </div> */}
              <span className='font-medium text-white text-2xl'>
                {action.label}
              </span>
            </div>
            {/* <p className='text-sm text-gray-600 dark:text-gray-400'>
              {action.description}
            </p> */}
          </button>
        ))}
      </div>
    </div>
  );
};
