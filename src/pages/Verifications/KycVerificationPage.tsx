"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

// EXACT FIGMA SVG ICON
import DocumentIcon from "../../assets/icons/line-md_document.svg";

interface UploadBoxProps {
  label: string;
  description: string;
  onFileSelect?: (file: File | null) => void;
}

function UploadBox({ label, description, onFileSelect }: UploadBoxProps) {
  return (
    <div className="w-full space-y-2">
      {/* LABEL */}
      <p className="text-[14px] font-medium text-[#111827]">
        {label} <span className="text-red-500">*</span>
      </p>

      {/* UPLOAD CELL */}
      <label
        className="
          block border border-gray-300 rounded-[16px]
          px-5 py-8 cursor-pointer bg-white
          hover:border-gray-400 transition text-center
        "
      >
        <input
          type="file"
          className="hidden"
          onChange={(e) => onFileSelect?.(e.target.files?.[0] ?? null)}
        />

        {/* FIGMA ICON */}
        <img
          src={DocumentIcon}
          alt="upload icon"
          className="w-[38px] h-[38px] mx-auto mb-4 opacity-70"
        />

        {/* UPLOAD TEXT */}
        <p className="text-[14px] text-black leading-tight font-normal mb-2">
          {description}
        </p>

        {/* FILE SIZE */}
        <p className="text-[12px] text-gray-500">Max file size is 5MB</p>
      </label>

      {/* FIGMA FOOTER TEXT */}
      <p className="text-[12px] text-gray-500 leading-snug">
        Ensure to take photos in a well lit environment for easier image
        verification.
      </p>
    </div>
  );
}

export default function KycVerificationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#F8F9FB] flex justify-center py-10 px-4">
      <div className="w-full max-w-[450px]">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <h1 className="text-[20px] font-semibold text-[#111827] mx-auto">
            Full KYC Verification
          </h1>
        </div>

        {/* FORM CARD */}
        <div className="bg-white px-6 py-6 rounded-[20px] shadow-sm space-y-6 border border-gray-100">

          {/* FULL NAME */}
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[#111827]">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="
                border border-gray-300 rounded-lg px-4 py-3 text-[14px]
                w-full outline-none focus:ring-2 focus:ring-[#005CEE]
                text-black placeholder-black
              "
            />
          </div>

          {/* BVN / NIN */}
          <div className="space-y-2">
            <label className="text-[14px] font-medium text-[#111827]">
              BVN / NIN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter BVN or NIN"
              className="
                border border-gray-300 rounded-lg px-4 py-3 text-[14px]
                w-full outline-none focus:ring-2 focus:ring-[#005CEE]
                text-black placeholder-black
              "
            />
          </div>

          {/* UPLOAD BOXES */}
          <UploadBox
            label="Valid ID Upload"
            description="Upload your NIN slip / Driver’s license / Passport here."
            onFileSelect={(f) => console.log("Valid ID:", f)}
          />

          <UploadBox
            label="CAC Document"
            description="Upload file here or browse"
            onFileSelect={(f) => console.log("CAC Document:", f)}
          />

          <UploadBox
            label="Selfie"
            description="Upload a clear photo of yourself."
            onFileSelect={(f) => console.log("Selfie:", f)}
          />

          {/* SUBMIT BUTTON */}
          <button
            className="
              w-full bg-[#001021] text-white py-3 rounded-xl
              text-[15px] font-medium mt-4 hover:bg-[#001a33] transition
            "
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
