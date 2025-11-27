"use client";
import React from "react";

export default function KycVerificationPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 py-6 flex justify-center">
      <div className="w-full max-w-md">

        {/* ----------------------------- */}
        {/*         HEADER (Figma)        */}
        {/* ----------------------------- */}
        <div className="flex items-center justify-between mb-6 relative">
          {/* Back arrow */}
          <button
            onClick={() => window.history.back()}
            className="p-1 z-10"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#111827]"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Centered Title */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[20px] font-semibold text-[#111827]">
            Full KYC Verification
          </h1>

          {/* Placeholder to maintain center alignment */}
          <div className="w-6"></div>
        </div>

        {/* ----------------------------- */}
        {/*      FORM CONTAINER (CARD)    */}
        {/* ----------------------------- */}
        <div className="space-y-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">

          {/* Full Name */}
          <FormInput
            label="Full Name"
            placeholder="Enter full name"
          />

          {/* BVN / NIN */}
          <FormInput
            label="BVN / NIN"
            placeholder="Enter BVN or NIN"
          />

          {/* Valid ID Upload */}
          <UploadSection
            title="Valid ID Upload"
            description="Upload your NIN slip or Driver’s license / Passport"
          />

          {/* CAC Document */}
          <UploadSection
            title="CAC Document"
            description="Upload file here or browse"
          />

          {/* Selfie */}
          <UploadSection
            title="Selfie"
            description="Ensure to take photos in a well-lit environment"
          />

          {/* Submit */}
          <button
            className="w-full bg-[#0A0E27] text-white py-3 rounded-xl
                       text-[16px] font-medium mt-4 hover:bg-[#090c21] transition"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  );
}

/* -------------------------------
      Reusable Form Input
-------------------------------- */
interface FormInputProps {
  label: string;
  placeholder: string;
}

function FormInput({ label, placeholder }: FormInputProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-[14px] font-medium text-[#374151]">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-4 py-3 text-[14px]
                   focus:ring-2 focus:ring-[#005CEE] outline-none transition"
      />
    </div>
  );
}

/* -------------------------------
      Upload Section Component
-------------------------------- */
interface UploadProps {
  title: string;
  description: string;
}

function UploadSection({ title, description }: UploadProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-[#FAFAFA]">
      <p className="text-[14px] font-medium text-[#374151]">
        {title} <span className="text-red-500">*</span>
      </p>

      <div
        className="flex flex-col items-center justify-center border border-dashed 
                   border-gray-400 rounded-lg py-6 cursor-pointer bg-white"
      >
        <div className="text-gray-600 text-[13px] text-center px-4">
          {description}
        </div>
        <div className="text-gray-400 text-[12px] mt-1">Max file size is 5MB</div>
      </div>
    </div>
  );
}
