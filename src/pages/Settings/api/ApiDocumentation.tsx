import React from "react";
import { Button } from "antd"; 
import { Link } from "react-router-dom"; 

export default function ApiDocumentation() {
  return (
    <div className="bg-gray-100 rounded-2xl p-5 mb-6">
      <h3 className="text-base font-semibold mb-3">API Documentation</h3>

      <div className="rounded-2xl shadow-md border-[#D9D9D9] p-5 bg-white">
        <p className="text-xs text-gray-600 mb-4">
          Check out our detailed documentation to integrate the API
        </p>

        <Link to="/dashboard">
          <button className="bg-[#000000] text-white py-2 w-full rounded-xl text-sm">
            View Documentation
          </button>
        </Link>

      </div>
    </div>
  );
}