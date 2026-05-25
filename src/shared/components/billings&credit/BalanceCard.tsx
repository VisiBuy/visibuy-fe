import React from "react";
import type { CreditBalanceDto } from "@/types/api";

interface BalanceCardProps {
  balance?: CreditBalanceDto;
  isLoading: boolean;
  isError: boolean;
}

const BalanceCard: React.FC<
  BalanceCardProps
> = ({
  balance,
  isLoading,
  isError,
}) => {

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return (
      <div
        className="
          bg-black
          text-white
          rounded-[30px]
          p-8
          md:p-10
          shadow-2xl
          relative
          overflow-hidden
          animate-pulse
        "
      >
        <div
          className="
            absolute
            top-0
            right-0
            w-96
            h-96
            bg-gray-800
            rounded-full
            blur-3xl
            opacity-20
            -mr-20
            -mt-20
            pointer-events-none
          "
        />

        <div className="relative z-10 space-y-4">
          <div className="h-4 w-40 bg-gray-800 rounded-full" />
          <div className="h-12 w-52 bg-gray-800 rounded-xl" />
          <div className="h-4 w-64 bg-gray-800 rounded-full" />
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (isError) {
    return (
      <div
        className="
          bg-black
          text-white
          rounded-[30px]
          p-8
          md:p-10
          shadow-2xl
          relative
          overflow-hidden
        "
      >
        <div className="relative z-10">
          <p
            className="
              text-sm
              text-gray-400
              font-medium
              leading-relaxed
            "
          >
            Unable to load your
            verification links right now.
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // DATA
  // =========================================

  const totalCredits =
    balance?.totalCredits ?? 0;

  const formattedCredits =
    new Intl.NumberFormat(
      "en-NG"
    ).format(totalCredits);

  const estimatedLinks =
    Math.floor(
      totalCredits / 3
    );

  // =========================================
  // UI
  // =========================================

  return (
    <div
      className="
        bg-black
        text-white
        rounded-[30px]
        p-8
        md:p-10
        shadow-2xl
        relative
        overflow-hidden
      "
    >

      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          top-0
          right-0
          w-96
          h-96
          bg-[#6D5BFF]
          rounded-full
          blur-3xl
          opacity-20
          -mr-20
          -mt-20
          pointer-events-none
        "
      />

      <div className="relative z-10">

        {/* LABEL */}
        <div className="mb-5">
          <h2
            className="
              text-sm
              font-medium
              text-gray-300
              tracking-wide
            "
          >
            Chances To Close Sales
          </h2>
        </div>

        {/* MAIN VALUE */}
        <div
          className="
            flex
            flex-col
            gap-3
            mb-8
          "
        >

          <div
            className="
              flex
              items-baseline
              gap-4
              flex-wrap
            "
          >

            <span
              className="
                text-5xl
                font-bold
                tracking-tighter
              "
            >
              {estimatedLinks}
            </span>

            <span
              className="
                text-gray-400
                text-md
                font-medium
              "
            >
              verification
              {estimatedLinks !== 1 &&
                " links"}
            </span>

          </div>

          {/* OUTPUT CONTEXT */}
          <p
            className="
              text-sm
              text-gray-400
              leading-relaxed
              max-w-[340px]
            "
          >
            Send verification links
            early to increase buyer
            confidence before payment.
          </p>

        </div>

        {/* FOOTER */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-white/10
            pt-5
          "
        >

          <div>
            <p
              className="
                text-xs
                uppercase
                tracking-wider
                text-gray-500
              "
            >
              Credits Available
            </p>

            <p
              className="
                mt-1
                text-lg
                font-semibold
                text-white
              "
            >
              {formattedCredits}
            </p>
          </div>

          <div
            className="
              px-4
              py-2
              rounded-full
              bg-white/10
              text-sm
              text-white/80
            "
          >
            1 link = 3 credits
          </div>

        </div>

      </div>
    </div>
  );
};

export default BalanceCard;