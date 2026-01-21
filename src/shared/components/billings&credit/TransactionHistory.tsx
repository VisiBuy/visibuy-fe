import React from "react";
import { useGetCreditHistoryQuery } from "@/features/credits/creditApi";
import {
  Download,
  Loader,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const TransactionHistory = () => {
  const { data: history = [], isLoading, error } = useGetCreditHistoryQuery();

  // console.log("error", error);
  // console.log("history", history);
  // console.log("isloading", isLoading);
  // console.log("data", data);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-50 text-green-700";
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";
      case "FAILED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Completed";
      case "PENDING":
        return "Pending";
      case "FAILED":
        return "Failed";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExport = () => {
    // Convert history to CSV
    const headers = ["ID", "Date", "Credits", "Amount", "Status", "Reference"];
    const rows = history.map((item) => [
      item.id,
      item.createdAt,
      item.creditsAdded,
      `₦${item.amount.toLocaleString()}`,
      item.status,
      item.paymentReference,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credit-history-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-xl font-bold text-gray-900'>Transaction History</h2>
        <button
          onClick={handleExport}
          disabled={history.length === 0}
          className='flex items-center gap-2 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'
        >
          <Download className='w-4 h-4' />
          Export
        </button>
      </div>

      {isLoading ? (
        <div className='flex items-center justify-center py-12'>
          <Loader className='w-6 h-6 text-blue-600 animate-spin mr-2' />
          <p className='text-gray-600'>Loading transaction history...</p>
        </div>
      ) : error ? (
        <div className='flex items-center justify-center py-12 text-red-600'>
          <AlertCircle className='w-6 h-6 mr-2' />
          <p>Failed to load transaction history</p>
        </div>
      ) : history.length === 0 ? (
        <div className='text-center py-12'>
          <TrendingUp className='w-12 h-12 text-gray-300 mx-auto mb-4' />
          <p className='text-gray-600 font-medium'>No transactions yet</p>
          <p className='text-gray-500 text-sm'>
            Your credit purchases will appear here
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {history.map((transaction) => (
            <div
              key={transaction.id}
              className='p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors'
            >
              <div className='flex justify-between items-start mb-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <TrendingUp className='w-5 h-5 text-blue-600' />
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-900 text-sm'>
                      {transaction.creditsAdded} Credits Purchase
                    </h3>
                    <p className='text-gray-500 text-xs'>
                      via {transaction.paymentProvider}
                    </p>
                  </div>
                </div>
                <span
                  className={`font-bold text-xs tracking-wider px-3 py-1 rounded-lg ${getStatusColor(
                    transaction.status,
                  )}`}
                >
                  {getStatusLabel(transaction.status)}
                </span>
              </div>

              <div className='flex justify-between items-end'>
                <div>
                  <p className='text-gray-400 text-[10px] font-bold uppercase tracking-wider'>
                    {transaction.paymentReference}
                  </p>
                  <p className='text-gray-900 font-semibold text-sm mt-1'>
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-gray-900 font-bold text-lg'>
                    ₦{transaction.amount.toLocaleString()}
                  </p>
                  <p className='text-green-600 font-semibold text-sm'>
                    +{transaction.creditsAdded}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
