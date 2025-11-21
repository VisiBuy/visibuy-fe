import React, { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { StatsCard } from "@/shared/components/dashboard/StatsCard";
import { SalesChart } from "@/shared/components/dashboard/SalesChart";
import { RecentOrders } from "@/shared/components/dashboard/RecentOrders";
import { QuickActions } from "@/shared/components/dashboard/QuickActions";
import {
  useGetDashboardStatsQuery,
  useGetSalesDataQuery,
  useGetRecentOrdersQuery,
} from "@/features/dashboard/dashboardApi";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowTrendUp } from "react-icons/fa6";
import { SunSolid } from "@/ui/icons/SunSolid";

type Period = "7d" | "30d" | "90d";

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  console.log(user);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("30d");

  const { data: stats, isLoading: statsLoading } = useGetDashboardStatsQuery();
  console.log(stats);
  const { data: salesData, isLoading: salesLoading } = useGetSalesDataQuery({
    period: selectedPeriod,
  });
  const { data: recentOrders, isLoading: ordersLoading } =
    useGetRecentOrdersQuery();

  const periodOptions: { value: Period; label: string }[] = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
  ];

  return (
    <div className='w-full flex justify-center'>
      <div className='space-y-6 absolute top-[60px] md:top-[20px] w-100vw lg:w-[calc(100%-16rem)] md:w-70vw p-0 md:p-8 lg:p-12 flex flex-col justify-center'>
        {/* Stats Cards */}
        <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6'>
          <StatsCard
            title='Total Verifications'
            value={stats?.total || 0}
            change={stats?.revenueChange}
            icon={
              <FaCheckCircle className='w-6 h-6 text-gray-600 dark:text-gray-400' />
            }
            className={statsLoading ? "animate-pulse" : ""}
          />
          <StatsCard
            title='Active'
            value={stats?.totalOrders || 0}
            change={stats?.ordersChange}
            icon={
              <SunSolid className='w-6 h-6 text-gray-600 dark:text-gray-400' />
            }
            className={statsLoading ? "animate-pulse" : ""}
          />
          <StatsCard
            title='Trust Score'
            value={user?.trustScore || 0}
            change={stats?.productsChange}
            icon={
              <FaArrowTrendUp className='w-6 h-6 text-gray-600 dark:text-gray-400' />
            }
            className={statsLoading ? "animate-pulse" : ""}
          />
        </div>

        <div>
          {/* Recent Orders */}
          <div>
            {ordersLoading ? (
              <div className='bg-white rounded-lg shadow p-6 animate-pulse'>
                <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4'></div>
                <div className='space-y-3'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className='h-16 bg-gray-200 dark:bg-gray-700 rounded'
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <RecentOrders orders={recentOrders || []} />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}
