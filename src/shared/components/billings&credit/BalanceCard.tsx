import React from "react";
import type { CreditBalanceDto } from "@/types/api";

interface BalanceCardProps {
  balance?: CreditBalanceDto;
  isLoading: boolean;
  isError: boolean;
}

const MAX_CREDITS = 100_000;

const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  isLoading,
  isError,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-black text-white rounded-[30px] p-8 md:p-10 shadow-2xl relative overflow-hidden animate-pulse">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-800 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="h-4 w-32 bg-gray-800 rounded-full" />
          <div className="h-10 w-48 bg-gray-800 rounded-lg" />
          <div className="h-3 w-full bg-gray-800/70 rounded-full" />
          <div className="h-4 w-2/3 bg-gray-800 rounded-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-black text-white rounded-[30px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm text-red-400 font-medium">
            Unable to load your credit balance. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // Safe defaults
  const totalCredits = balance?.totalCredits ?? 0;

  // Progress based on 100,000 max
  const rawProgress = (totalCredits / MAX_CREDITS) * 100;
  const progress = Math.max(0, Math.min(100, rawProgress));

  const formattedCredits = new Intl.NumberFormat("en-NG").format(totalCredits);
  const formattedMaxCredits = new Intl.NumberFormat("en-NG").format(MAX_CREDITS);

  return (
    <div className="bg-black text-white rounded-[30px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gray-800 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-sm font-medium text-gray-300">
            Current Balance
          </h2>
        </div>

        {/* Credits Value */}
        <div className="flex items-baseline gap-4 mb-8">
          <span className="text-5xl font-bold tracking-tighter">
            {formattedCredits}
          </span>
          <span className="text-gray-400 text-md font-medium">
            credits remaining
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-gray-800/50 rounded-full mb-5 overflow-hidden backdrop-blur-sm">
          <div
            className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Meta info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-500 gap-2">
          <p>
            Capacity: {formattedMaxCredits} credits
          </p>
          <div className="hidden md:block w-px h-4 bg-gray-800" />
          <p>
            You&apos;ve used{" "}
            <span className="text-gray-300 font-semibold">
              {Math.round(progress)}%
            </span>{" "}
            of your credit capacity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
