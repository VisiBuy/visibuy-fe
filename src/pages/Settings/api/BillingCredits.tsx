import React from "react";
import { useGetCreditsBalanceQuery } from "@/features/auth/apiKeyApi";

export default function BillingCredits() {
  const { data: creditsData, isLoading, error } = useGetCreditsBalanceQuery();

  const formatNumber = (num: number) => {
    return num?.toLocaleString() || '0';
  };

  const calculatePercentage = () => {
    if (!creditsData || creditsData.totalCredits === 0) return 0;
    return (creditsData.balance / creditsData.totalCredits) * 100;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-5 mb-6 rounded-2xl">
        <h3 className="text-base font-semibold mb-4">Billing & Credits</h3>
        <div className="rounded-2xl bg-white shadow-md border-[#D9D9D9] p-5">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="w-full bg-gray-200 h-3 rounded-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 p-5 mb-6 rounded-2xl">
        <h3 className="text-base font-semibold mb-4">Billing & Credits</h3>
        <div className="rounded-2xl bg-white shadow-md border-[#D9D9D9] p-5">
          <div className="text-red-500 text-sm mb-4">
            Failed to load credits data
          </div>
          <button className="bg-[#000000] text-white py-2 w-full rounded-xl text-sm">
            Manage Billing
          </button>
        </div>
      </div>
    );
  }

  const percentage = calculatePercentage();
  const displayBalance = formatNumber(creditsData?.balance || 0);
  const displayTotal = formatNumber(creditsData?.totalCredits || 100000);
  const nextRenewal = creditsData?.nextRenewal ? formatDate(creditsData.nextRenewal) : 'November 1, 2025';

  return (
    <div className="bg-gray-100 p-5 mb-6 rounded-2xl">
      <h3 className="text-base font-semibold mb-4">Billing & Credits</h3>

      <div className="rounded-2xl bg-white shadow-md border-[#D9D9D9] p-5">
        <div className="mb-3 text-xs text-gray-500">Remaining Credits</div>

        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-blue-500 h-full transition-all duration-300" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="text-xs text-gray-500 mb-4">
          {displayBalance} / {displayTotal} • Next Renewal: {nextRenewal}
        </div>

        <button className="bg-[#000000] text-white py-2 w-full rounded-xl text-sm hover:bg-gray-800 transition-colors">
          Manage Billing
        </button>
      </div>
    </div>
  );
}