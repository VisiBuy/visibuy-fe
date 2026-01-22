import React from "react";
import { VerificationDto } from "@/types/api";
import { ROUTES } from "@/app/routes/constants";
import { useNavigate } from "react-router-dom";
import FormatDate from "@/shared/hooks/FormatDate";
import { toast } from "react-hot-toast";

interface RecentVerificationProps {
  verifications: VerificationDto[];
  className?: string;
}

export const RecentVerifications: React.FC<RecentVerificationProps> = ({
  verifications,
  className = "",
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-primary-green";
      case "pending":
        return "bg-[#FFB62E]";
      case "active":
        return "bg-primary-blue";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-neutral-600";
    }
  };

  const formatVerificationCode = (publicToken: string): string => {
    if (publicToken.includes("-")) {
      return publicToken;
    }
    return publicToken.slice(0, 8).toUpperCase();
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "approved":
        return "Completed";
      case "rejected":
        return "Rejected";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // =============================
  // EMPTY STATE
  // =============================
  if (!verifications || verifications.length === 0) {
    return (
      <div
        className={`border border-neutral-300 rounded-card bg-neutral-white shadow-card w-full ${className}`}
      >
        <div className="p-card-md">
          <div className="flex items-center justify-between mb-space-16">
            <h3 className="text-h5-desktop md:text-h4-desktop font-bold text-neutral-900">
              Recent Verifications
            </h3>
          </div>
          <p className="text-body-medium text-neutral-600 text-center py-space-32">
            No recent verifications
          </p>
        </div>
      </div>
    );
  }

  // =============================
  // WITH VERIFICATIONS
  // =============================
  return (
    <div
      className={`border border-neutral-300 rounded-card bg-neutral-white shadow-card w-full ${className}`}
    >
      <div className="p-card-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-space-24">
          <h3 className="text-h5-desktop md:text-h4-desktop font-bold text-neutral-900">
            Recent Verifications
          </h3>

          <button
            onClick={() => navigate(ROUTES.VERIFICATIONS.LIST)}
            className="text-primary-blue hover:text-primary-blue/80 transition-standard text-body-small font-medium"
          >
            View All
          </button>
        </div>

        {/* List */}
        <div className="space-y-space-12">
          {verifications.map((verification) => {
            const verificationLink = `https://verify.visibuy.com.ng/v/${verification.publicToken}`;

            return (
              <div
                key={verification.id}
                className="p-space-16 border border-neutral-200 rounded-input hover:bg-neutral-50 transition-standard space-y-space-12"
              >
                {/* Top Row */}
                <div className="flex items-center justify-between gap-space-16">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-medium font-semibold text-neutral-900 truncate mb-space-4">
                      {verification.productTitle}
                    </h4>

                    <p className="text-caption text-neutral-600">
                      {formatVerificationCode(verification.publicToken)}
                    </p>

                    <div className="flex items-center gap-space-12 mt-space-8">
                      <span
                        className={`px-space-12 py-space-4 rounded-btn-small text-neutral-white text-caption font-semibold ${getStatusColor(
                          verification.status
                        )}`}
                      >
                        {getStatusLabel(verification.status)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-body-medium font-semibold text-neutral-900 mb-space-4">
                      {verification.price
                        ? new Intl.NumberFormat("en-NG", {
                            style: "currency",
                            currency: "NGN",
                            minimumFractionDigits: 2,
                          }).format(verification.price)
                        : "N/A"}
                    </p>
                    <p className="text-caption text-neutral-600">
                      {FormatDate(verification.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Bottom Row – Verification Link */}
                <div className="flex items-center gap-space-8 bg-neutral-100 border border-neutral-300 rounded-input px-space-12 py-space-8">
                  <input
                    type="text"
                    readOnly
                    value={verificationLink}
                    className="flex-1 bg-transparent outline-none text-caption text-neutral-700 truncate"
                  />

                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(verificationLink);
                        toast.success("Link copied!");
                      } catch (err) {
                        toast.error("Failed to copy link");
                      }
                    }}
                    className="flex-shrink-0 p-space-4 hover:bg-neutral-200 rounded-input transition-standard min-h-tap-target min-w-tap-target"
                    title="Copy verification link"
                  >
                    {/* Copy icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-neutral-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-2M8 7h8a2 2 0 012 2v3m-6-6V5a2 2 0 012-2h3a2 2 0 012 2v3M8 7h1"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
