import React, { useState, useEffect } from "react";
import { CreditCard, Loader } from "lucide-react";
import {
  useTopupVerificationCreditsMutation,
  useGetCreditPackagesQuery,
} from "@/features/credits/creditApi";
import FlutterWaveModal from "./FlutterWaveModal";
import PaymentNotification, { PaymentStatus } from "./PaymentNotification";
import type { CreditPackageDto } from "@/types/api";

const CreditPackages = () => {
  const { data: packages = [], isLoading: isLoadingPackages } =
    useGetCreditPackagesQuery();
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentMessage, setPaymentMessage] = useState<string>("");
  const [paymentAttempts, setPaymentAttempts] = useState(0);

  const [topupCredits, { isLoading: isInitiatingPayment }] =
    useTopupVerificationCreditsMutation();

  // Set first package as selected when packages load
  useEffect(() => {
    if (packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(packages[0].id);
    }
  }, [packages, selectedPackageId]);

  const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId);

  const handleInitiatePayment = async () => {
    if (!selectedPackage) return;

    setPaymentAttempts((prev) => prev + 1);
    setPaymentStatus("loading");
    setPaymentMessage("Initiating payment...");

    try {
      const response = await topupCredits({
        packageId: selectedPackageId,
        method: "card",
        provider: "flutterwave",
      }).unwrap();

      if (
        response.success &&
        response.data?.paymentUrl &&
        response.data?.reference
      ) {
        setPaymentUrl(response.data.paymentUrl);
        setPaymentReference(response.data.reference);
        setIsModalOpen(true);
        setPaymentStatus("idle");
      } else {
        throw new Error("Invalid payment response from server");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to initiate payment. Please try again.";
      setPaymentStatus(paymentAttempts >= 3 ? "error" : "retry");
      setPaymentMessage(errorMessage);
      console.error("Payment initiation error:", error);
    }
  };

  const handlePaymentComplete = (reference: string) => {
    setPaymentStatus("success");
    setPaymentMessage(`Payment successful! Reference: ${reference}`);
    setPaymentAttempts(0);
    // Credit balance will be automatically updated via invalidatesTags in RTK Query
  };

  const handlePaymentFailed = (error: string) => {
    const retryCount = paymentAttempts;
    setPaymentStatus(retryCount >= 3 ? "error" : "retry");
    setPaymentMessage(error || "Payment failed. Please try again.");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Don't reset status immediately to show success message
    if (paymentStatus !== "success") {
      setTimeout(() => {
        setPaymentStatus("idle");
        setPaymentMessage("");
      }, 1000);
    }
  };

  const handleRetry = () => {
    handleInitiatePayment();
  };

  const handleDismissNotification = () => {
    if (paymentStatus === "success") {
      setPaymentAttempts(0);
    }
    setPaymentStatus("idle");
    setPaymentMessage("");
  };
  return (
    <div className='space-y-4'>
      {/* Payment Notification */}
      {paymentStatus !== "idle" && (
        <PaymentNotification
          status={paymentStatus}
          message={paymentMessage}
          amount={selectedPackage?.amount}
          onRetry={handleRetry}
          onDismiss={handleDismissNotification}
          autoHideDelay={paymentStatus === "success" ? 5000 : 0}
        />
      )}

      {/* Credit Packages Card */}
      <div className='bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-md font-bold text-gray-900'>Purchase Credits</h2>
          <button className='text-blue-600 font-semibold hover:text-blue-700'>
            Manage
          </button>
        </div>

        {isLoadingPackages ? (
          <div className='flex items-center justify-center py-12'>
            <Loader className='w-6 h-6 text-blue-600 animate-spin mr-2' />
            <p className='text-gray-600'>Loading credit packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-600'>No credit packages available</p>
          </div>
        ) : (
          <>
            <div className='space-y-4 mb-8'>
              {packages.map((pkg, index) => (
                <label
                  key={pkg.id}
                  className='block relative cursor-pointer group'
                >
                  <input
                    type='radio'
                    name='credit_package'
                    value={pkg.id}
                    checked={selectedPackageId === pkg.id}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className='peer sr-only'
                  />
                  <div className='p-6 rounded-2xl border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50/30 transition-all hover:border-blue-300 bg-white'>
                    {index === 0 && pkg.isPopular && (
                      <div className='absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10'>
                        Most Popular
                      </div>
                    )}
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center gap-5'>
                        <div className='w-14 h-14 bg-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600'>
                          <div className='w-8 h-5 border-2 border-current rounded-md'></div>
                        </div>
                        <div>
                          <h3 className='font-extrabold text-gray-900 text-lg'>
                            {pkg.credits} credits
                          </h3>
                          <p className='text-gray-500 text-sm font-medium'>
                            ₦{(pkg.amount / pkg.credits).toLocaleString()} per
                            credit
                          </p>
                        </div>
                      </div>
                      <div className='text-2xl font-bolder text-gray-900'>
                        ₦{pkg.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleInitiatePayment}
              disabled={isInitiatingPayment || paymentStatus === "loading"}
              className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98]'
            >
              {isInitiatingPayment ? "Processing..." : "Purchase Credits"}
            </button>
          </>
        )}
      </div>

      {/* Flutterwave Modal */}
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
