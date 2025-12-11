import React from "react";

export default function RecentCalls() {
  return (
    <div className="bg-gray-100 p-5 mb-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold">Recent Calls</h3>
        <button className="text-[#007AFF] text-sm font-bold">
          View All
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center border rounded-xl p-4 bg-white">
          <div>
            <div className="font-medium text-sm">POST /verifications</div>
            <div className="text-xs text-gray-500">October 9, 2025</div>
          </div>
          <span className="bg-[#28A745] text-white px-3 py-1 rounded-lg text-sm">
            Success
          </span>
        </div>

        <div className="flex justify-between items-center border rounded-xl p-4 bg-white">
          <div>
            <div className="font-medium text-sm">
              PUT /verifications/VB-002
            </div>
            <div className="text-xs text-gray-500">October 8, 2025</div>
          </div>
          <span className="bg-[#F41414] text-red-100 px-3 py-1 rounded-lg text-sm">
            Error
          </span>
        </div>
      </div>
    </div>
  );
}
