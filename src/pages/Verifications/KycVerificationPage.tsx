"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";

// REAL FIGMA ICON
import DocumentIcon from "../../assets/icons/line-md_document.svg";

interface FileState {
  file?: File | null;
  uploading: boolean;
  progress: number;
  uploaded: boolean;
}

interface UploadBoxProps {
  label: string;
  description: string;
  state: FileState;
  onFileSelect: (file: File | null) => void;
  onEdit: () => void;
  onView: () => void;
}

/* =======================
      UPLOAD BOX
========================== */
function UploadBox({
  label,
  description,
  state,
  onFileSelect,
  onEdit,
  onView,
}: UploadBoxProps) {
  const uploading = state.uploading;
  const uploaded = state.uploaded;

  return (
    <div className="w-full">
      <p className="text-[14px] font-medium text-[#111827] mb-2">
        {label} <span className="text-red-500">*</span>
      </p>

      <label
        className="
          block border border-gray-300 rounded-[16px]
          px-4 py-6 cursor-pointer bg-white transition
          hover:border-gray-400 text-center relative
        "
      >
        <input
          type="file"
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
        />

        {/* ===== DEFAULT STATE ===== */}
        {!uploading && !uploaded && (
          <>
            <img
              src={DocumentIcon}
              alt="upload icon"
              className="w-10 h-10 mx-auto mb-3 opacity-70"
            />
            <p className="text-[13px] text-black leading-tight">{description}</p>
            <p className="text-[12px] text-gray-500 mt-2">Max file size is 5MB</p>
          </>
        )}

        {/* ===== UPLOADING STATE ===== */}
        {uploading && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-14 h-14 mb-2">
              <svg className="w-full h-full">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#E5E7EB"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="#001F3F"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={150}
                  strokeDashoffset={150 - (150 * state.progress) / 100}
                  strokeLinecap="round"
                  className="transition-all"
                />
              </svg>
            </div>
            <p className="text-sm font-medium">{state.progress}%</p>
            <p className="text-xs text-gray-500">Uploading file...</p>
          </div>
        )}

        {/* ===== UPLOADED STATE ===== */}
        {uploaded && (
          <div className="flex flex-col items-center justify-center py-2">
            <img
              src={DocumentIcon}
              alt="file uploaded"
              className="w-10 h-10 mx-auto mb-2 opacity-70"
            />

            <p className="text-[13px] font-medium text-[#111827]">
              {state.file?.name ?? "File uploaded"}
            </p>

            <p className="text-[12px] text-gray-500 mb-3">
              Upload completed successfully
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onView}
                className="text-[13px] px-4 py-[6px] rounded-md border border-gray-300 bg-gray-50"
              >
                View
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="text-[13px] px-4 py-[6px] rounded-md border border-gray-300 bg-gray-50"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </label>

      <p className="text-[11px] text-gray-500 mt-2 leading-tight">
        Ensure to take photos in a well-lit environment for easier image verification.
      </p>
    </div>
  );
}

/* =======================
      MAIN PAGE
========================== */

export default function KycVerificationPage() {
  const navigate = useNavigate();

  // ========= Upload States ========= //
  const [validId, setValidId] = useState<FileState>({
    uploading: false,
    progress: 0,
    uploaded: false,
  });

  const [cacDoc, setCacDoc] = useState<FileState>({
    uploading: false,
    progress: 0,
    uploaded: false,
  });

  const [selfie, setSelfie] = useState<FileState>({
    uploading: false,
    progress: 0,
    uploaded: false,
  });

  // ========= Preview Modal State ========= //
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  // ========= Simulated Upload ========= //
  const simulateUpload = (
    file: File | null,
    setState: React.Dispatch<React.SetStateAction<FileState>>
  ) => {
    if (!file) return;

    setState({ file, uploading: true, progress: 0, uploaded: false });

    let p = 0;
    const interval = setInterval(() => {
      p += 8;
      if (p >= 100) {
        clearInterval(interval);
        setState({ file, uploading: false, progress: 100, uploaded: true });
      } else {
        setState((prev) => ({ ...prev, progress: p }));
      }
    }, 150);
  };

  // ========= Submit Handler ========= //
  const handleSubmit = () => {
    navigate("/verifications/kyc/success");
  };

  // ========= Handle View File ========= //
  const handleViewFile = (file?: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewFile(url);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FB] flex justify-center py-10 px-4 relative">
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

        {/* FORM */}
        <div className="bg-white px-6 py-6 rounded-[20px] shadow-sm space-y-6 border border-gray-100">

          {/* Full Name */}
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

          {/* BVN/NIN */}
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

          {/* Upload Boxes */}
          <UploadBox
            label="Valid ID Upload"
            description="Upload your NIN slip / Driver’s license / Passport here."
            state={validId}
            onFileSelect={(f) => simulateUpload(f, setValidId)}
            onEdit={() => setValidId({ uploading: false, progress: 0, uploaded: false })}
            onView={() => handleViewFile(validId.file)}
          />

          <UploadBox
            label="CAC Document"
            description="Upload file here or browse"
            state={cacDoc}
            onFileSelect={(f) => simulateUpload(f, setCacDoc)}
            onEdit={() => setCacDoc({ uploading: false, progress: 0, uploaded: false })}
            onView={() => handleViewFile(cacDoc.file)}
          />

          <UploadBox
            label="Selfie"
            description="Upload a clear photo of yourself."
            state={selfie}
            onFileSelect={(f) => simulateUpload(f, setSelfie)}
            onEdit={() => setSelfie({ uploading: false, progress: 0, uploaded: false })}
            onView={() => handleViewFile(selfie.file)}
          />

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            className="
              w-full bg-[#001021] text-white py-3 rounded-xl 
              text-[15px] font-medium mt-4 hover:bg-[#001a33] transition
            "
          >
            Submit
          </button>
        </div>
      </div>

      {/* ========= PREVIEW MODAL ========= */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] px-4">
          <div className="bg-white rounded-xl p-4 max-w-[90%] max-h-[90%] relative">
            <button
              onClick={() => setPreviewFile(null)}
              className="absolute top-3 right-3 p-1 bg-gray-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={previewFile}
              className="max-w-full max-h-[80vh] rounded-md object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
