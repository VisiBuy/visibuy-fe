import React from "react";

export default function BillingCredits() {
  return (
    <div className="bg-gray-100 p-5 mb-6 rounded-2xl">
      <h3 className="text-base font-semibold mb-4">Billing & Credits</h3>

      <div className="rounded-2xl bg-white shadow-md border-[#D9D9D9] p-5">
        <div className="mb-3 text-xs text-gray-500">Remaining Credits</div>

        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
          <div className="bg-blue-500 h-full" style={{ width: "85%" }}></div>
        </div>

        <div className="text-xs text-gray-500 mb-4">
          85,000 / 100,000 • Next Renewal: November 1, 2025
        </div>

        <button className="bg-[#000000] text-white py-2 w-full rounded-xl text-sm">
          Manage Billing
        </button>
      </div>
    </div>
  );
}
