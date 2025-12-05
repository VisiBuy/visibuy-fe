"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function KycApprovedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6">
      <CheckCircle className="text-green-600 w-20 h-20 mb-6" />

      <h1 className="text-[22px] font-semibold text-[#111827] mb-2">
        Congratulations!
      </h1>

      <p className="text-gray-600 text-center text-[15px] max-w-[280px] mb-8">
        Your full KYC verification has been approved.  
        You gained <span className="font-medium">15 trust points.</span>
      </p>

      <button
        onClick={() => navigate("/dashboard")}
        className="w-full max-w-[300px] bg-[#001021] text-white py-3 rounded-xl 
          text-[15px] font-medium hover:bg-[#001a33] transition"
      >
        Dashboard
      </button>
    </div>
  );
}
