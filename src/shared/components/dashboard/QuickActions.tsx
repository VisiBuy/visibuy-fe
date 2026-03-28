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
    path: ROUTES.VERIFICATIONS.CREATE,
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
      className={`bg-neutral-white rounded-card shadow-card p-card-md ${className}`}
    >
      <h3 className="text-h5-desktop font-semibold text-neutral-900 mb-space-16">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 gap-space-16 place-items-center">
        {quickActions.map((action) => (
          <button
            key={action.label}

            // ✅ ADD THIS LINE (anchor for dashboard tour)
            id="tour-create-verification"

            onClick={() => navigate(action.path)}
            className="p-space-16 rounded-btn-large bg-primary-blue hover:bg-primary-blue/90 transition-standard flex justify-center w-full md:w-[80%] min-h-tap-target"
          >
            <div className="flex items-center gap-space-12">
              <span className="font-medium text-neutral-white md:text-h4-desktop">
                {action.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
