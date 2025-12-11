// components/StatCard.tsx
import React from "react";

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <div className="rounded-2xl p-5 flex items-start gap-4 bg-white border border-[#D9D9D9] shadow-md">
      <div className="p-3">
        <img
          src={icon}
          alt={label}
          className="w-[39px] h-[40px]"
          draggable="false"
        />
      </div>
      <div>
        <div className="text-xl font-bold">{value}</div>
        <div className="text-xs text-gray-500 mt-1">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
