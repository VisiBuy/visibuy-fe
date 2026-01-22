"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function KycSubmissionSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6">
      {/* Green Check Icon */}
      <CheckCircle className="text-green-600 w-20 h-20 mb-6" />

      {/* Title */}
      <h1 className="text-[22px] font-semibold text-[#111827] mb-2">
        Submission Successful!
      </h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-center text-[15px] max-w-[280px] mb-8">
        Your details are under review, and will be verified within 24 hours.
      </p>

      {/* Dashboard Button */}
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
