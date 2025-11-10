import React from "react";
import { useNavigate } from "react-router-dom";

export default function ApiPage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pb-16">
      <div className="w-full bg-blue-500 text-white py-4 sm:py-5 md:py-6 px-5 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 text-white text-lg"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
          API Management
        </h1>
      </div>

      <div className="w-full max-w-[720px] px-6 py-8">
        <p className="text-gray-700 text-sm sm:text-base">
          Placeholder: create/revoke API keys and manage integrations.
        </p>
        {/* TODO: Add API key list & creation UI */}
      </div>
    </div>
  );
}
