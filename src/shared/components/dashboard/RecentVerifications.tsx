import React from "react";
import { VerificationDto } from "@/types/api";
import { ROUTES } from "@/app/routes/constants";
import { useNavigate } from "react-router-dom";
import FormatDate from "@/shared/hooks/FormatDate";

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

  if (!verifications || verifications.length === 0) {
    return (
      <>
        <div
          className={`border border-neutral-300 rounded-card bg-neutral-white shadow-card w-full relative z-[100] ${className}`}
          style={{
            position: "absolute",
            top: "-60px",
            left: "0",
            right: "0",
            zIndex: 100,
          }}
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
        {/* Spacer to prevent content from going under the overlapping section */}
        <div className="h-[100px] md:h-[140px]"></div>
      </>
    );
  }

  return (
    <>
      <div
        className={`border border-neutral-300 rounded-card bg-neutral-white shadow-card w-full relative z-[100] ${className}`}
        style={{
          position: "absolute",
          top: "-60px",
          left: "0",
          right: "0",
          zIndex: 100,
          marginTop: "0",
        }}
      >
        <div className="p-card-md">
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

          <div className="space-y-space-12">
            {verifications.map((verification) => (
              <div
                key={verification.id}
                className="flex items-center justify-between p-space-16 border border-neutral-200 rounded-input hover:bg-neutral-50 transition-standard"
              >
                <div className="flex-1 min-w-0 pr-space-16">
                  <h4 className="text-body-medium font-semibold text-neutral-900 truncate mb-space-8">
                    {verification.productTitle}
                  </h4>
                  <p className="text-caption text-neutral-600 mb-space-8">
                    {formatVerificationCode(verification.publicToken)}
                  </p>
                  <div className="flex items-center gap-space-12">
                    <span
                      className={`px-space-12 py-space-4 rounded-btn-small text-neutral-white text-caption font-semibold ${getStatusColor(
                        verification.status
                      )}`}
                    >
                      {getStatusLabel(verification.status)}
                    </span>
                    <span className="text-caption text-neutral-600">
                      {Math.floor(Math.random() * 50) + 1} views
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-body-medium font-semibold text-neutral-900 mb-space-8">
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
            ))}
          </div>
        </div>
      </div>
      {/* Spacer to prevent content from going under the overlapping section */}
      <div className="h-[100px] md:h-[140px]"></div>
    </>
  );
};
