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
      className={`bg-neutral-white rounded-card shadow-card p-card-md border-2 border-neutral-400 ${className}`}
    >
      <div className="flex flex-col gap-space-16">
        <div className="flex items-center gap-space-12">
          <div className="flex-shrink-0">{icon}</div>
          <p className="text-h4-desktop md:text-h3-desktop font-bold text-neutral-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <p className="text-body-small font-medium text-neutral-700">{title}</p>
      </div>
    </div>
  );
};
