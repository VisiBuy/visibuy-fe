import React from "react";
import { useAppSelector } from "@/app/hooks";
import { StatsCard } from "@/shared/components/dashboard/StatsCard";
import { RecentVerifications } from "@/shared/components/dashboard/RecentVerifications";
import { QuickActions } from "@/shared/components/dashboard/QuickActions";
import { useGetDashboardStatsQuery } from "@/features/dashboard/dashboardApi";
import { useGetVerificationsQuery } from "@/features";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { SunSolid } from "@/ui/icons/SunSolid";
import { PageWrapper } from "@/shared/components/layout/PageWrapper";

// ✅ ADD
import { DashboardTour } from "@/shared/components/dashboard/DashboardTour";

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  const { data: verificationsData, isLoading: verificationsLoading } =
    useGetVerificationsQuery();

  const totalVerifications = verificationsData?.total || stats?.total || 0;

  const activeVerifications =
    verificationsData?.items?.filter(
      (v) => v.status === "approved" || v.status === "pending"
    ).length ||
    stats?.totalOrders ||
    0;

  const trustScore = user?.trustScore || 0;

  return (
    <PageWrapper isScrollable={true}>
      <div className="w-full">
        <div className="flex flex-col pt-space-24 md:pt-space-32 relative z-[100]">
          {/* ✅ ADD: dashboard explanation tour */}
          <DashboardTour
            onCreateVerification={() => {
              // This scrolls to the Create Verification action.
              // You must add id="tour-create-verification" inside QuickActions.
              const el = document.getElementById("tour-create-verification");
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-16 md:gap-space-20 mb-space-24 md:mb-space-32">
            {/* ✅ ADD anchors for tour */}
            <div id="tour-total-verifications">
              <StatsCard
                title="Total Verifications"
                value={totalVerifications}
                icon={<FaCheckCircle className="w-6 h-6 text-primary-green" />}
                className={
                  statsLoading || verificationsLoading ? "animate-pulse" : ""
                }
              />
            </div>

            <div id="tour-active-verifications">
              <StatsCard
                title="Active"
                value={activeVerifications}
                icon={<SunSolid className="w-6 h-6 text-primary-blue" />}
                className={
                  statsLoading || verificationsLoading ? "animate-pulse" : ""
                }
              />
            </div>

            <div id="tour-trust-score">
              <StatsCard
                title="Trust Score"
                value={trustScore}
                icon={<FaArrowTrendUp className="w-6 h-6 text-primary-blue" />}
                className={statsLoading ? "animate-pulse" : ""}
              />
            </div>
          </div>

          <div className="mt-space-8 md:mt-space-12 pb-space-24">
            <QuickActions />
          </div>

          <div className="relative mb-space-24 md:mb-space-32">
            {verificationsLoading ? (
              <div className="border border-neutral-300 rounded-card bg-neutral-white shadow-card p-card-md animate-pulse">
                <div className="h-8 bg-neutral-200 rounded mb-space-16"></div>
                <div className="space-y-space-12">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-neutral-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <RecentVerifications
                verifications={verificationsData?.items?.slice(0, 3) || []}
              />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
