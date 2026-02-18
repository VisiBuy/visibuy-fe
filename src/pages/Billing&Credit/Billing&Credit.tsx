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
} from "@/features/credits/creditApi"; // 🔁 adjust path if different

import type {
  CreditBalanceDto,
  CreditPackageDto,
  CreditHistoryDto,
  TopupVerificationCreditsRequest,
} from "@/types/api";

function BillingAndCredit() {
  // 🔹 Fetch current balance
  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
  } = useGetCreditBalanceQuery();

  // 🔹 Fetch available packages
  const {
    data: packagesData = [],
    isLoading: isPackagesLoading,
    isError: isPackagesError,
  } = useGetCreditPackagesQuery();

  // 🔹 Fetch credit / transaction history
  const {
    data: historyData = [],
    isLoading: isHistoryLoading,
    isError: isHistoryError,
  } = useGetCreditHistoryQuery();

  // 🔹 Top-up mutation
  const [topupVerificationCredits, { isLoading: isTopupLoading }] =
    useTopupVerificationCreditsMutation();

  // Handler to pass into CreditPackages
  const handleTopup = async (payload: TopupVerificationCreditsRequest) => {
    const res = await topupVerificationCredits(payload).unwrap();
    // res: ApiResult<{ paymentUrl: string; reference: string }>
    if (res.success && res.data?.paymentUrl) {
      window.location.href = res.data.paymentUrl;
    }
    return res;
  };


  return (
    <PageWrapper isScrollable={true}>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* If you later want a blue header, you can re-enable it here */}

        <main className="flex-1 z-10 relative">
          <div className="pb-12 md:pb-12 max-w-7xl mx-auto space-y-4 md:space-y-6">
            {/* Balance Section */}
            <section>
              <BalanceCard
                balance={balanceData as CreditBalanceDto | undefined}
                isLoading={isBalanceLoading}
                isError={!!isBalanceError}
              />
            </section>

            {/* Packages + History */}
            <div className="space-y-4 md:space-y-6">
              <section>
                <CreditPackages
                  packages={packagesData as CreditPackageDto[]}
                  isLoading={isPackagesLoading}
                  isError={!!isPackagesError}
                  onTopup={handleTopup}
                  isTopupLoading={isTopupLoading}
                />
              </section>

              <section>
                <TransactionHistory
                  history={historyData as CreditHistoryDto[]}
                  isLoading={isHistoryLoading}
                  isError={!!isHistoryError}
                />
              </section>
            </div>
          </div>
        </main>

        {/* If you want bottom nav later */}
        {/* <BottomNav /> */}
      </div>
    </PageWrapper>
  );
}

export default BillingAndCredit;
