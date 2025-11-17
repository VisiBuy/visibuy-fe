import React from "react";
import { RecentOrder } from "../../../features/dashboard/dashboardApi";
import { renderIcon } from "../../utils/iconMap";

interface RecentOrdersProps {
  orders: RecentOrder[];
  className?: string;
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  className = "",
}) => {
  const getStatusColor = (status: RecentOrder["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "cancelled":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h3 className='text-lg font-semibold text-black dark:text-black mb-4'>
          Recent Verifications
        </h3>
        <p className='text-black dark:text-black text-center'>
          No recent Verifications
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}
    >
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        Recent Verifications
      </h3>

      <div className='space-y-3'>
        {orders.slice(0, 5).map((order) => (
          <div
            key={order.id}
            className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
          >
            <div className='flex-1'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                  {renderIcon(
                    "shopping-cart",
                    "w-4 h-4 text-blue-600 dark:text-blue-400"
                  )}
                </div>
                <div>
                  <p className='font-medium text-gray-900 dark:text-white'>
                    {order.customerName}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className='text-right'>
              <p className='font-semibold text-gray-900 dark:text-white'>
                ₦{order.amount.toLocaleString()}
              </p>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {orders.length > 5 && (
        <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <button className='w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium'>
            View all orders →
          </button>
        </div>
      )}
    </div>
  );
};
