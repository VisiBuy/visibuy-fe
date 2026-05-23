import React from "react";

import { useGetCreditHistoryQuery } from "@/features/credits/creditApi";

import {
  Loader,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

const TransactionHistory = () => {

  const {
    data: history = [],
    isLoading,
    error,
  } =
    useGetCreditHistoryQuery();

  // =====================================================
  // STATUS COLORS
  // =====================================================

  const getStatusColor = (
    status: string
  ) => {

    switch (status) {

      case "COMPLETED":
        return `
          bg-green-50
          text-green-700
          border
          border-green-100
        `;

      case "PENDING":
        return `
          bg-yellow-50
          text-yellow-700
          border
          border-yellow-100
        `;

      case "FAILED":
        return `
          bg-red-50
          text-red-600
          border
          border-red-100
        `;

      default:
        return `
          bg-gray-50
          text-gray-700
          border
          border-gray-100
        `;
    }
  };

  // =====================================================
  // STATUS LABELS
  // =====================================================

  const getStatusLabel = (
    status: string
  ) => {

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

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (
    dateString: string
  ) => {

    const date =
      new Date(dateString);

    return date.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="
        bg-white
        rounded-[30px]
        p-8
        border
        border-gray-100
        shadow-xl
        shadow-gray-200/40
      "
    >

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="mb-8">

        <h2
          className="
            text-xl
            font-bold
            text-gray-900
          "
        >
          Verification Activity
        </h2>

        <p
          className="
            text-sm
            text-gray-500
            mt-2
            max-w-[340px]
            leading-relaxed
          "
        >
          Recent verification credit
          activity connected to your
          account.
        </p>

      </div>

      {/* ========================================= */}
      {/* LOADING */}
      {/* ========================================= */}

      {isLoading ? (

        <div
          className="
            flex
            items-center
            justify-center
            py-12
          "
        >

          <Loader
            className="
              w-6
              h-6
              text-blue-600
              animate-spin
              mr-2
            "
          />

          <p className="text-gray-600">
            Loading verification
            activity...
          </p>

        </div>

      ) : error ? (

        /* ========================================= */
        /* ERROR */
        /* ========================================= */

        <div
          className="
            flex
            items-center
            justify-center
            py-12
            text-gray-500
          "
        >

          <AlertCircle
            className="
              w-6
              h-6
              mr-2
            "
          />

          <p>
            Unable to load
            verification activity.
          </p>

        </div>

      ) : history.length === 0 ? (

        /* ========================================= */
        /* EMPTY */
        /* ========================================= */

        <div className="text-center py-14">

          <div
            className="
              w-16
              h-16
              rounded-3xl
              bg-gray-100
              flex
              items-center
              justify-center
              mx-auto
              mb-5
            "
          >

            <ShieldCheck
              className="
                w-8
                h-8
                text-gray-400
              "
            />

          </div>

          <p
            className="
              text-gray-800
              font-semibold
            "
          >
            No verification activity yet
          </p>

          <p
            className="
              text-gray-500
              text-sm
              mt-2
              max-w-[260px]
              mx-auto
              leading-relaxed
            "
          >
            Your verification credit
            activity will appear here
            after purchasing credits.
          </p>

        </div>

      ) : (

        /* ========================================= */
        /* HISTORY LIST */
        /* ========================================= */

        <div className="space-y-4">

          {history.map(
            (transaction) => (

              <div
                key={transaction.id}
                className="
                  p-5
                  rounded-[24px]
                  border
                  border-gray-100
                  hover:border-gray-200
                  transition-colors
                  bg-white
                "
              >

                {/* TOP */}
                <div
                  className="
                    flex
                    justify-between
                    items-start
                    gap-4
                    mb-4
                  "
                >

                  {/* LEFT */}
                  <div
                    className="
                      flex
                      items-start
                      gap-4
                    "
                  >

                    {/* ICON */}
                    <div
                      className="
                        w-11
                        h-11
                        rounded-2xl
                        bg-blue-50
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >

                      <ShieldCheck
                        className="
                          w-5
                          h-5
                          text-blue-600
                        "
                      />

                    </div>

                    {/* TEXT */}
                    <div>

                      <h3
                        className="
                          font-semibold
                          text-gray-900
                          text-sm
                        "
                      >
                        Verification
                        Credits Added
                      </h3>

                      <p
                        className="
                          text-gray-500
                          text-xs
                          mt-1
                        "
                      >
                        {formatDate(
                          transaction.createdAt
                        )}
                      </p>

                    </div>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`
                      text-[11px]
                      font-semibold
                      tracking-wide
                      px-3
                      py-1.5
                      rounded-xl
                      ${getStatusColor(
                        transaction.status
                      )}
                    `}
                  >
                    {getStatusLabel(
                      transaction.status
                    )}
                  </span>

                </div>

                {/* BOTTOM */}
                <div
                  className="
                    flex
                    justify-between
                    items-end
                    gap-4
                  "
                >

                  {/* REFERENCE */}
                  <div>

                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-wider
                        text-gray-400
                        font-semibold
                      "
                    >
                      Reference
                    </p>

                    <p
                      className="
                        text-xs
                        text-gray-600
                        mt-1
                        break-all
                      "
                    >
                      {
                        transaction.paymentReference
                      }
                    </p>

                  </div>

                  {/* AMOUNT */}
                  <div className="text-right">

                    <p
                      className="
                        text-lg
                        font-bold
                        text-gray-900
                      "
                    >
                      ₦
                      {transaction.amount.toLocaleString()}
                    </p>

                    <p
                      className="
                        text-sm
                        text-blue-600
                        font-medium
                        mt-1
                      "
                    >
                      {
                        transaction.creditsAdded
                      }
                      {" "}
                      credits added
                    </p>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}
    </div>
  );
};

export default TransactionHistory;