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
    if (change > 0) return "text-primary-green";
    if (change < 0) return "text-danger";
    return "text-neutral-600";
  };

  return (
    <div
      className={`bg-neutral-white rounded-card shadow-card p-card-sm md:p-card-md lg:p-card-md border-2 border-neutral-400 ${className}`}
    >
      <div>
        <div className='md:flex gap-space-16 items-center'>
          <div className='p-0 rounded-full'>
            {icon}
          </div>
          <p className='text-h4-desktop font-bold mt-space-4'>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <p className='text-caption md:text-body-small font-medium text-neutral-700'>{title}</p>
      </div>
    </div>
  );
};
