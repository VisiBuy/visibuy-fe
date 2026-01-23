"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import DocumentIcon from "../../assets/icons/line-md_document.svg";

interface FileState {
  file?: File | null;
  uploading: boolean;
  progress: number;
  uploaded: boolean;
  error?: string | null;
}

interface UploadBoxProps {
  label: string;
  description: string;
  state: FileState;
  onFileSelect: (file: File | null) => void;
  onEdit: () => void;
  onView: () => void;
}

/* ============================================================
                       UPLOAD BOX
============================================================ */
function UploadBox({
  label,
  description,
  state,
  onFileSelect,
  onEdit,
  onView,
}: UploadBoxProps) {
  const { uploading, uploaded, error } = state;

  return (
    <div className="w-full">
      <p className="text-[14px] md:text-[15px] font-medium text-[#111827] mb-2">
        {label} <span className="text-red-500">*</span>
      </p>

      <label
        className={`
          block rounded-xl
          px-4 py-4 md:py-5
          cursor-pointer
          transition text-center relative
          flex flex-col items-center justify-center

          /* 🔥 Slightly faint cell styling */
          bg-[#FAFAFA]
          border ${error ? "border-red-500" : "border-[#ECECEC] hover:border-[#D5D5D5]"}

          h-[150px] md:h-[160px] lg:h-[170px]
        `}
      >
        <input
          type="file"
          className="hidden"
          onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
        />

        {/* DEFAULT */}
        {!uploading && !uploaded && !error && (
          <>
            <img
              src={DocumentIcon}
              alt="upload icon"
              className="w-10 h-10 mx-auto opacity-70 mb-2"
            />
            <p className="text-[13px]">{description}</p>
            <p className="text-[12px] text-gray-500 mt-1">Max file size is 5MB</p>
          </>
        )}

        {/* ERROR */}
        {error && (
          <>
            <img
              src={DocumentIcon}
              alt="upload icon"
              className="w-10 h-10 mx-auto opacity-50 mb-2"
            />
            <p className="text-red-600 text-[13px] mt-1 font-medium">{error}</p>
          </>
        )}

        {/* UPLOADING */}
        {uploading && !error && (
          <div className="flex flex-col items-center">
            <div className="relative w-14 h-14 mb-2">
              <svg className="w-full h-full">
                <circle cx="28" cy="28" r="24" stroke="#E5E7EB" strokeWidth="4" fill="none" />
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
            <p className="text-xs text-gray-500">Uploading...</p>
          </div>
        )}

        {/* UPLOADED */}
        {uploaded && !error && (
          <>
            <img
              src={DocumentIcon}
              alt="uploaded"
              className="w-10 h-10 mx-auto opacity-70 mb-2"
            />

            <p className="text-[13px] font-medium">{state.file?.name}</p>
            <p className="text-[12px] text-gray-500 mb-2">Upload completed</p>

            <div className="flex gap-3">
              <button
                onClick={onView}
                className="text-[13px] px-4 py-[6px] rounded-md border border-[#ECECEC] bg-gray-50"
              >
                View
              </button>
              <button
                onClick={onEdit}
                className="text-[13px] px-4 py-[6px] rounded-md border border-[#ECECEC] bg-gray-50"
              >
                Edit
              </button>
            </div>
          </>
        )}
      </label>

      <p className="text-[11px] md:text-[12px] text-gray-500 mt-2 leading-tight">
        Ensure to take photos in a well-lit environment for easier verification.
      </p>
    </div>
  );
}

/* ============================================================
                       MAIN PAGE
============================================================ */
export default function KycVerificationPage() {
  const navigate = useNavigate();

  const [validId, setValidId] = useState<FileState>({
    uploading: false,
    progress: 0,
    uploaded: false,
    error: null,
  });
  const [cacDoc, setCacDoc] = useState<FileState>({
    uploading: false,
    progress: 0,
    uploaded: false,
    error: null,
  });
  const [selfie, setSelfie] = useState<FileState>({
    uploading: false,
    progress: 0,
    uploaded: false,
    error: null,
  });

  const [previewFile, setPreviewFile] = useState<string | null>(null);

  /* Upload Simulation */
  const simulateUpload = (
    file: File | null,
    setState: React.Dispatch<React.SetStateAction<FileState>>
  ) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return setState({
        file: null,
        uploading: false,
        progress: 0,
        uploaded: false,
        error: "File too large! Max 5MB allowed.",
      });
    }

    setState({
      file,
      uploading: true,
      progress: 0,
      uploaded: false,
      error: null,
    });

    let p = 0;
    const interval = setInterval(() => {
      p += 8;
      if (p >= 100) {
        clearInterval(interval);
        setState({
          file,
          uploading: false,
          progress: 100,
          uploaded: true,
          error: null,
        });
      } else {
        setState((prev) => ({ ...prev, progress: p }));
      }
    }, 150);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FB] flex justify-center px-4 md:px-6 lg:px-8 py-10">

      {/* OUTER CONTAINER */}
      <div
        className="
          w-full
          max-w-full
          md:max-w-[720px]
          lg:max-w-[1080px]
          xl:max-w-[1200px]
          mt-6
        "
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6 md:mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <h1 className="text-[20px] md:text-[24px] font-semibold text-[#111827] mx-auto">
            Full KYC Verification
          </h1>
        </div>

        {/* FORM CARD */}
        <div
          className="
            bg-white 
            px-6 py-6 
            rounded-[20px] 
            shadow-sm 
            space-y-6 
            border border-gray-100 

            md:px-8 md:py-8
            lg:px-10 lg:py-10
            xl:px-12 xl:py-12

            max-w-[760px]
            xl:max-w-[820px]
            mx-auto
          "
        >
          {/* INPUT FIELD TEMPLATE */}
          <div className="space-y-2">
            <label className="text-[14px] md:text-[15px] font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className="
                w-full px-4 py-3 text-[14px] rounded-xl
                bg-[#FAFAFA] 
                border border-[#ECECEC]
                placeholder-gray-500
                outline-none focus:ring-2 focus:ring-[#005CEE]
              "
            />
          </div>

          {/* BVN */}
          <div className="space-y-2">
            <label className="text-[14px] md:text-[15px] font-medium">
              BVN / NIN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter BVN or NIN"
              className="
                w-full px-4 py-3 text-[14px] rounded-xl
                bg-[#FAFAFA] 
                border border-[#ECECEC]
                placeholder-gray-500
                outline-none focus:ring-2 focus:ring-[#005CEE]
              "
            />
          </div>

          {/* UPLOAD BOXES */}
          <UploadBox
            label="Valid ID Upload"
            description="Upload your NIN slip / Driver’s license / Passport here."
            state={validId}
            onFileSelect={(f) => simulateUpload(f, setValidId)}
            onEdit={() =>
              setValidId({ uploading: false, progress: 0, uploaded: false, error: null })
            }
            onView={() =>
              setPreviewFile(validId.file ? URL.createObjectURL(validId.file) : null)
            }
          />

          <UploadBox
            label="CAC Document"
            description="Upload file here or browse"
            state={cacDoc}
            onFileSelect={(f) => simulateUpload(f, setCacDoc)}
            onEdit={() =>
              setCacDoc({ uploading: false, progress: 0, uploaded: false, error: null })
            }
            onView={() =>
              setPreviewFile(cacDoc.file ? URL.createObjectURL(cacDoc.file) : null)
            }
          />

          <UploadBox
            label="Selfie"
            description="Upload a clear photo of yourself."
            state={selfie}
            onFileSelect={(f) => simulateUpload(f, setSelfie)}
            onEdit={() =>
              setSelfie({ uploading: false, progress: 0, uploaded: false, error: null })
            }
            onView={() =>
              setPreviewFile(selfie.file ? URL.createObjectURL(selfie.file) : null)
            }
          />

          {/* SUBMIT */}
          <button
            onClick={() => navigate("/verifications/kyc/success")}
            className="
              w-full bg-[#001021] text-white py-3 rounded-xl 
              text-[15px] font-medium mt-4 hover:bg-[#001a33]
            "
          >
            Submit
          </button>
        </div>
      </div>

      {/* PREVIEW */}
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
