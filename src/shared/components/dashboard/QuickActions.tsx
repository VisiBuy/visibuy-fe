import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../app/routes/constants";
import { renderIcon } from "../../utils/iconMap";

interface QuickAction {
  label: string;
  path: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Create Verification",
    path: "/verifications", // This might need to be added to routes
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
            <div className='flex items-center gap-3'>
              <span className='font-medium text-white md:text-2xl'>
                {action.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
