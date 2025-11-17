import React from "react";
import { SalesData } from "../../../features/dashboard/dashboardApi";

interface SalesChartProps {
  data: SalesData[];
  className?: string;
}

export const SalesChart: React.FC<SalesChartProps> = ({
  data,
  className = "",
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}
      >
        <p className='text-gray-500 dark:text-gray-400 text-center'>
          No sales data available
        </p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const maxOrders = Math.max(...data.map((d) => d.orders));

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}
    >
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        Sales Overview
      </h3>

      <div className='space-y-4'>
        {data.map((item, index) => (
          <div key={item.date} className='flex items-center justify-between'>
            <div className='flex-1'>
              <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1'>
                <span>{new Date(item.date).toLocaleDateString()}</span>
                <span>{item.orders} orders</span>
              </div>
              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                <div
                  className='bg-blue-600 h-2 rounded-full'
                  style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                ></div>
              </div>
              <div className='text-right text-sm font-medium text-gray-900 dark:text-white mt-1'>
                ₦{item.revenue.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
        <div className='grid grid-cols-2 gap-4 text-center'>
          <div>
            <p className='text-2xl font-bold text-gray-900 dark:text-white'>
              {data.reduce((sum, item) => sum + item.orders, 0)}
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Total Orders
            </p>
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-900 dark:text-white'>
              ₦
              {data
                .reduce((sum, item) => sum + item.revenue, 0)
                .toLocaleString()}
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Total Revenue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
