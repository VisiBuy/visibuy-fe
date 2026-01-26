import React, { useState, useEffect, useMemo } from "react";
import { CreditCard, Loader, Info } from "lucide-react";
import {
  useTopupVerificationCreditsMutation,
  useGetCreditPackagesQuery,
} from "@/features/credits/creditApi";
import FlutterWaveModal from "./FlutterWaveModal";
import PaymentNotification, { PaymentStatus } from "./PaymentNotification";
import type { CreditPackageDto } from "@/types/api";

const FALLBACK_PACKAGES: CreditPackageDto[] = [
  {
    id: "fallback-1",
    credits: 1,
    amount: 500,
    isPopular: false,
  },
  {
    id: "fallback-5",
    credits: 5,
    amount: 2500,
    isPopular: true,
  },
  {
    id: "fallback-10",
    credits: 10,
    amount: 5000,
    isPopular: false,
  },
  {
    id: "fallback-25",
    credits: 25,
    amount: 12500,
    isPopular: false,
  },
];

const CreditPackages = () => {
  const {
    data: apiPackages = [],
    isLoading: isLoadingPackages,
  } = useGetCreditPackagesQuery();

  // 👉 Use API packages if available, otherwise fallback
  const packages: CreditPackageDto[] =
    apiPackages.length > 0 ? apiPackages : FALLBACK_PACKAGES;

  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentMessage, setPaymentMessage] = useState<string>("");
  const [paymentAttempts, setPaymentAttempts] = useState(0);

  // Custom amount input
  const [customAmount, setCustomAmount] = useState<string>("");

  const [topupCredits, { isLoading: isInitiatingPayment }] =
    useTopupVerificationCreditsMutation();

  // 👉 Auto-Select the first package when available
  useEffect(() => {
    if (packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(packages[0].id);
    }
  }, [packages, selectedPackageId]);

  // 👉 Compute NGN per credit based on API or fallback
  const ngnPerCredit = useMemo(() => {
    if (apiPackages.length > 0) {
      const first = apiPackages[0];
      if (first.credits > 0) {
        return first.amount / first.credits;
      }
    }
    return 500; // fallback price per credit
  }, [apiPackages]);

  const costPerVerification = useMemo(
    () => ngnPerCredit * 3,
    [ngnPerCredit]
  );

  // Custom Calculator
  const customAmountNumber = useMemo(() => {
    const raw = customAmount.replace(/,/g, "");
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [customAmount]);

  const estimatedCredits = useMemo(() => {
    if (ngnPerCredit <= 0) return 0;
    return Math.floor(customAmountNumber / ngnPerCredit);
  }, [customAmountNumber, ngnPerCredit]);

  const estimatedVerifications = useMemo(() => {
    if (estimatedCredits <= 0) return 0;
    return Math.floor(estimatedCredits / 3);
  }, [estimatedCredits]);

  const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId);

  const handleInitiatePayment = async () => {
    if (!selectedPackage || selectedPackage.id.startsWith("fallback-")) {
      setPaymentStatus("error");
      setPaymentMessage(
        "This pricing is offline only. Select a real package when online."
      );
      return;
    }

    setPaymentAttempts((prev) => prev + 1);
    setPaymentStatus("loading");
    setPaymentMessage("Initiating payment...");

    try {
      // 🔹 Call the mutation – now returns TopupPaymentResponse directly
      const response = await topupCredits({
        packageId: selectedPackage.id,
        method: "bank_transfer",
        provider: "flutterwave",
      }).unwrap();

      // console.log("[CreditPackages] topup response:", response);

      const paymentUrl = response.paymentUrl;
      const reference = response.reference;

      if (paymentUrl && reference) {
        setPaymentUrl(paymentUrl);
        setPaymentReference(reference);
        setIsModalOpen(true);
        setPaymentStatus("idle");
        setPaymentMessage("");
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (error: any) {
      console.error("[CreditPackages] topup error:", error);

      const backendMessage =
        error?.data?.message || error?.message || "Payment failed";

      setPaymentStatus(paymentAttempts >= 3 ? "error" : "retry");
      setPaymentMessage(backendMessage);
    }
  };

  const handlePaymentComplete = (reference: string) => {
    setPaymentStatus("success");
    setPaymentMessage(`Payment successful! Ref: ${reference}`);
    setPaymentAttempts(0);
  };

  const handlePaymentFailed = (error: string) => {
    setPaymentStatus(paymentAttempts >= 3 ? "error" : "retry");
    setPaymentMessage(error || "Payment failed");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (paymentStatus !== "success") {
      setTimeout(() => {
        setPaymentStatus("idle");
        setPaymentMessage("");
      }, 700);
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment Notification */}
      {paymentStatus !== "idle" && (
        <PaymentNotification
          status={paymentStatus}
          message={paymentMessage}
          amount={selectedPackage?.amount}
          onRetry={handleInitiatePayment}
          onDismiss={() => setPaymentStatus("idle")}
        />
      )}

      {/* MAIN CARD */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-md font-bold text-gray-900">Purchase Credits</h2>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 text-xs md:text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              <span>
                1 credit = ₦{ngnPerCredit.toLocaleString()}
              </span>
            </div>
            <span className="hidden md:inline-block text-gray-300">•</span>
            <div>
              Each verification uses <b>3 credits</b> (
              ₦{costPerVerification.toLocaleString()})
            </div>
          </div>
        </div>

        {/* Packages */}
        {isLoadingPackages && apiPackages.length === 0 ? (
          <div className="py-12 flex items-center justify-center">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {packages.slice(0, 4).map((pkg, index) => (
                <label
                  key={pkg.id}
                  className="block relative cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="credit_pkg"
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="peer sr-only"
                  />

                  <div className="p-6 rounded-2xl border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50/30 transition-all hover:border-blue-300 bg-white">
                    {index === 1 && pkg.isPopular && (
                      <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                        Most Popular
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600">
                          <div className="w-8 h-5 border-2 border-current rounded-md" />
                        </div>

                        <div>
                          <h3 className="font-extrabold text-gray-900 text-lg">
                            {pkg.credits} credits
                          </h3>
                          <p className="text-gray-500 text-sm font-medium">
                            ₦{(pkg.amount / pkg.credits).toLocaleString()} per credit
                          </p>
                        </div>
                      </div>

                      <div className="text-2xl font-bolder text-gray-900">
                        ₦{pkg.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Custom Calculator */}
            <div className="mb-8 space-y-3">
              <p className="text-sm font-semibold text-gray-900">
                Or enter a custom amount (₦)
              </p>

              <div className="flex flex-col md:flex-row gap-3 md:items-center">
                <input
                  type="number"
                  min={0}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full md:w-1/2 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                />

                <div className="text-xs md:text-sm text-gray-600 space-y-1">
                  {customAmountNumber > 0 ? (
                    <>
                      <p>
                        You get <b>{estimatedCredits}</b> credits.
                      </p>
                      <p>
                        ≈ <b>{estimatedVerifications}</b> verification
                        {estimatedVerifications !== 1 && "s"}.
                      </p>
                    </>
                  ) : (
                    <p>₦{costPerVerification.toLocaleString()} ≈ 1 verification</p>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-gray-500">
                Custom amount is an estimator. Select a real package to pay.
              </p>
            </div>

            <button
              onClick={handleInitiatePayment}
              disabled={isInitiatingPayment || paymentStatus === "loading"}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-blue-600/30"
            >
              {isInitiatingPayment ? "Processing..." : "Purchase Credits"}
            </button>
          </>
        )}
      </div>

      {/* Payment Modal */}
      <FlutterWaveModal
        isOpen={isModalOpen}
        paymentUrl={paymentUrl}
        reference={paymentReference}
        onClose={handleModalClose}
        onPaymentComplete={handlePaymentComplete}
        onPaymentFailed={handlePaymentFailed}
      />
    </div>
  );
};

export default CreditPackages;