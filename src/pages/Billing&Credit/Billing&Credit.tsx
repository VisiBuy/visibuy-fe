import { Menu } from "lucide-react";
import { PageWrapper } from "@/shared/components/layout/PageWrapper";

import BalanceCard from "@/shared/components/billings&credit/BalanceCard";
import CreditPackages from "@/shared/components/billings&credit/CreditPackages";
import TransactionHistory from "@/shared/components/billings&credit/TransactionHistory";
// import BottomNav from "@/shared/components/billings&credit/BottomNav";

import {
  useGetCreditBalanceQuery,
  useGetCreditPackagesQuery,
  useGetCreditHistoryQuery,
  useTopupVerificationCreditsMutation,
} from "@/features/credits/creditApi";

import type {
  CreditBalanceDto,
  CreditPackageDto,
  CreditHistoryDto,
  TopupVerificationCreditsRequest,
} from "@/types/api";

function BillingAndCredit() {
  // =====================================================
  // BALANCE
  // =====================================================

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
  } = useGetCreditBalanceQuery();

  // =====================================================
  // PACKAGES
  // =====================================================

  const {
    data: packagesData = [],
    isLoading: isPackagesLoading,
    isError: isPackagesError,
  } = useGetCreditPackagesQuery();

  // =====================================================
  // HISTORY
  // =====================================================

  const {
    data: historyData = [],
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useGetCreditHistoryQuery();

  // =====================================================
  // TOPUP
  // =====================================================

  const [
    topupVerificationCredits,
    { isLoading: isTopupLoading },
  ] = useTopupVerificationCreditsMutation();

  const handleTopup = async (
    payload: TopupVerificationCreditsRequest
  ) => {
    const res =
      await topupVerificationCredits(
        payload
      ).unwrap();

    if (
      res.success &&
      res.data?.paymentUrl
    ) {
      window.location.href =
        res.data.paymentUrl;
    }

    return res;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <PageWrapper isScrollable={true}>
      <div className="flex-1 flex flex-col overflow-hidden relative">

        <main className="flex-1 z-10 relative">
          <div
            className="
              pb-12
              md:pb-12
              max-w-7xl
              mx-auto
              space-y-6
            "
          >

            {/* ========================================= */}
            {/* BALANCE */}
            {/* ========================================= */}

            <section className="space-y-2">

              {/* SECTION LABEL */}
              <div className="px-1">
                <p
                  className="
                    text-[13px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-neutral-400
                  "
                >
                  Verification Links
                </p>
              </div>

              <BalanceCard
                balance={
                  balanceData as
                    | CreditBalanceDto
                    | undefined
                }
                isLoading={
                  isBalanceLoading
                }
                isError={
                  !!isBalanceError
                }
              />

              {/* EXPLANATION */}
              <div className="px-1">
                <p
                  className="
                    text-sm
                    text-neutral-500
                    leading-relaxed
                    max-w-[320px]
                  "
                >
                  Generate verification links that help buyers feel more confident before payment.
                </p>
              </div>
            </section>

            {/* ========================================= */}
            {/* PACKAGES */}
            {/* ========================================= */}

            <section className="space-y-3">

              {/* SECTION LABEL */}
              <div className="px-1">
                <p
                  className="
                    text-[13px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-neutral-400
                  "
                >
                  Buyer Confidence Packages
                </p>
              </div>

              {/* CONTEXT */}
              <div className="px-1">
                <p
                  className="
                    text-sm
                    text-neutral-500
                    leading-relaxed
                    max-w-[340px]
                  "
                >
                  Get more verification links to help increase buyer confidence and close sales faster.
                </p>
              </div>

              <CreditPackages
                packages={
                  packagesData.map(
                    (pkg: any) => ({
                      ...pkg,

                      // UI ONLY
                      estimatedLinks:
                        Math.floor(
                          pkg.credits / 3
                        ),
                    })
                  ) as CreditPackageDto[]
                }
                isLoading={
                  isPackagesLoading
                }
                isError={
                  !!isPackagesError
                }
                onTopup={handleTopup}
                isTopupLoading={
                  isTopupLoading
                }
              />
            </section>

            {/* ========================================= */}
            {/* HISTORY */}
            {/* ========================================= */}

            <section className="space-y-3">

              {/* SECTION LABEL */}
              <div className="px-1">
                <p
                  className="
                    text-[13px]
                    font-medium
                    uppercase
                    tracking-wide
                    text-neutral-400
                  "
                >
                  Verification Activity
                </p>
              </div>

              <TransactionHistory
                history={
                  historyData as CreditHistoryDto[]
                }
                isLoading={
                  isHistoryLoading
                }
                isError={
                  !!isHistoryError
                }
              />
            </section>

          </div>
        </main>

        {/* <BottomNav /> */}
      </div>
    </PageWrapper>
  );
}

export default BillingAndCredit;