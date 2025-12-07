import React, { useState, useMemo } from "react";
import { useGetVerificationsQuery } from "@/features";
import { VerificationDto } from "@/types/api";
import ProductCard from "@/shared/components/verification/ProductCard";
import { PageWrapper } from "@/shared/components/layout/PageWrapper";

const VERIFICATION_STATUSES = [
  "all",
  "approved",
  "rejected",
  "pending",
  "expired",
];

export default function VerificationsListPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { data: verificationResponse, isLoading } = useGetVerificationsQuery();

  // Extract items from paginated response
  const allVerifications = verificationResponse?.items || [];

  const filteredVerifications = useMemo(() => {
    if (!Array.isArray(allVerifications) || allVerifications.length === 0) {
      return [];
    }

    if (activeTab === "all") {
      return allVerifications;
    }
    // Filter the list to match the current active tab
    return allVerifications.filter((v) => v.status === activeTab);
  }, [activeTab, allVerifications]);

  const handleTabClick = (status: string) => {
    setActiveTab(status);
  };

  const hasVerifications =
    Array.isArray(filteredVerifications) && filteredVerifications.length > 0;

  return (
    <PageWrapper isScrollable={false}>
    <div className="relative -mt-[60px] md:-mt-[50px] z-[100]">
      {/* Overlapping section positioned absolutely to escape overflow context */}
      <section
        className="border border-neutral-300 rounded-card bg-neutral-white shadow-card w-full relative z-[100]"
       
      >
        <div className="p-card-md md:p-card-md">
          <div className="md:flex items-center justify-between mb-space-16">
            <h2 className="text-h5-desktop md:text-h4-desktop font-bold mb-space-20 md:mb-0 hidden md:inline-block text-neutral-900">
              Recent Verifications
            </h2>
            <div className="flex items-center gap-space-20 flex-wrap overflow-y-auto">
              {VERIFICATION_STATUSES.map((status) => {
                const isActive = activeTab === status;
                const buttonClasses = `text-body-small gap-space-20 px-space-16 py-space-4 border border-neutral-300 rounded-input transition-standard ${
                  isActive
                    ? "text-neutral-white bg-primary-blue border-primary-blue"
                    : "text-neutral-600 bg-neutral-white hover:bg-neutral-100"
                }`;
                return (
                  <button
                    key={status}
                    className={buttonClasses}
                    onClick={() => handleTabClick(status)}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center h-[80vh]">
              <p className="text-body-large font-semibold text-neutral-600">
                Loading data...
              </p>
            </div>
          ) : (
            <div className="mt-space-24">
              {!hasVerifications ? (
                <div className="flex items-center justify-center h-[80vh]">
                  <p className="text-body-large font-semibold text-neutral-600">
                    No {activeTab === "all" ? "" : activeTab} verifications
                    found.
                  </p>
                </div>
              ) : (
                <div className="space-y-space-8">
                  {filteredVerifications.map(
                    (verification: VerificationDto) => (
                      <ProductCard
                        key={verification.id}
                        verification={verification}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      {/* Spacer to prevent content from going under the overlapping section */}
      <div style={{ height: "60px", marginTop: "60px" }}></div>
    </div>
    </PageWrapper>
  );
}
