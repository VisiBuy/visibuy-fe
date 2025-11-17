import React from "react";
// import { renderIcon } from "../../utils/iconMap";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  className = "",
}) => {
  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600 dark:text-green-400";
    if (change < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div
      className={`bg-white  rounded-lg shadow p-2 md:p-4 lg:p-6 border-2 border-gray-400 ${className}`}
    >
      <div>
        <div className='md:flex gap-4 items-center'>
          <div className='p-0 bg-blue-0 dark:bg-blue-00/0 rounded-full'>
            {/* {renderIcon(icon, "w-6 h-6 text-blue-600 dark:text-blue-400")} */}
            {icon}
          </div>
          <p className='text-2xl font-bold mt-1'>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {/*{change !== undefined && (
            <p className={`text-sm mt-1 ${getChangeColor(change)}`}>
              {formatChange(change)} {changeLabel || "from last month"}
            </p>
          )}*/}
        </div>
        <p className='text-[9px] md:text-sm font-medium '>{title}</p>
      </div>
    </div>
  );
};
