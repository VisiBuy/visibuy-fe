import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

import {
  Loader,
  Info,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import {
  useTopupVerificationCreditsMutation,
  useGetCreditPackagesQuery,
} from "@/features/credits/creditApi";

import FlutterWaveModal from "./FlutterWaveModal";

import PaymentNotification, {
  PaymentStatus,
} from "./PaymentNotification";

import type {
  CreditPackageDto,
} from "@/types/api";

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

  // =====================================================
  // API
  // =====================================================

  const {
    data: apiPackages = [],
    isLoading: isLoadingPackages,
  } = useGetCreditPackagesQuery();

  const [
    topupCredits,
    { isLoading: isInitiatingPayment },
  ] =
    useTopupVerificationCreditsMutation();

  // =====================================================
  // PACKAGE SOURCE
  // =====================================================

  const packages: CreditPackageDto[] =
    apiPackages.length > 0
      ? apiPackages
      : FALLBACK_PACKAGES;

  // =====================================================
  // STATE
  // =====================================================

  const [
    selectedPackageId,
    setSelectedPackageId,
  ] = useState<string>("");

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    paymentUrl,
    setPaymentUrl,
  ] = useState<string>("");

  const [
    paymentReference,
    setPaymentReference,
  ] = useState<string>("");

  const [
    paymentStatus,
    setPaymentStatus,
  ] =
    useState<PaymentStatus>("idle");

  const [
    paymentMessage,
    setPaymentMessage,
  ] = useState<string>("");

  const [
    paymentAttempts,
    setPaymentAttempts,
  ] = useState(0);

  // =====================================================
  // CUSTOM AMOUNT
  // =====================================================

  const [
    customAmount,
    setCustomAmount,
  ] = useState<string>("");

  // =====================================================
  // AUTO SELECT
  // =====================================================

  useEffect(() => {
    if (
      packages.length > 0 &&
      !selectedPackageId
    ) {
      setSelectedPackageId(
        packages[0].id
      );
    }
  }, [
    packages,
    selectedPackageId,
  ]);

  // =====================================================
  // CREDIT PRICE
  // =====================================================

  const ngnPerCredit =
    useMemo(() => {
      if (
        apiPackages.length > 0
      ) {
        const first =
          apiPackages[0];

        if (first.credits > 0) {
          return (
            first.amount /
            first.credits
          );
        }
      }

      return 500;
    }, [apiPackages]);

  const costPerVerification =
    useMemo(
      () => ngnPerCredit * 3,
      [ngnPerCredit]
    );

  // =====================================================
  // CUSTOM CALCULATOR
  // =====================================================

  const customAmountNumber =
    useMemo(() => {
      const raw =
        customAmount.replace(
          /,/g,
          ""
        );

      const n = Number(raw);

      return Number.isFinite(n) &&
        n > 0
        ? n
        : 0;
    }, [customAmount]);

  const estimatedCredits =
    useMemo(() => {
      if (
        ngnPerCredit <= 0
      ) {
        return 0;
      }

      return Math.floor(
        customAmountNumber /
          ngnPerCredit
      );
    }, [
      customAmountNumber,
      ngnPerCredit,
    ]);

  const estimatedVerifications =
    useMemo(() => {
      if (
        estimatedCredits <= 0
      ) {
        return 0;
      }

      return Math.floor(
        estimatedCredits / 3
      );
    }, [estimatedCredits]);

  // =====================================================
  // SELECTED PACKAGE
  // =====================================================

  const selectedPackage =
    packages.find(
      (pkg) =>
        pkg.id ===
        selectedPackageId
    );

  // =====================================================
  // PAYMENT
  // =====================================================

  const handleInitiatePayment =
    async () => {

      if (
        !selectedPackage ||
        selectedPackage.id.startsWith(
          "fallback-"
        )
      ) {
        setPaymentStatus(
          "error"
        );

        setPaymentMessage(
          "This pricing is offline only. Select a real package when online."
        );

        return;
      }

      setPaymentAttempts(
        (prev) => prev + 1
      );

      setPaymentStatus(
        "loading"
      );

      setPaymentMessage(
        "Preparing secure payment..."
      );

      try {

        if (window.fbq && selectedPackage) {
              window.fbq(
                "track",
                "InitiateCheckout",
                {
                  currency: "NGN",
                  value:
                    selectedPackage.amount,
                  content_name:
                    "Verification Credits",
                }
              );
            }
        const response =
          await topupCredits({
            packageId:
              selectedPackage.id,
            method:
              "bank_transfer",
            provider:
              "flutterwave",
          }).unwrap();

        const paymentUrl =
          response.paymentUrl;

        const reference =
          response.reference;

        if (
          paymentUrl &&
          reference
        ) {
          setPaymentUrl(
            paymentUrl
          );

          setPaymentReference(
            reference
          );

          setIsModalOpen(
            true
          );

          setPaymentStatus(
            "idle"
          );

          setPaymentMessage(
            ""
          );
        } else {
          throw new Error(
            "Invalid payment response"
          );
        }

      } catch (error: any) {

        const backendMessage =
          error?.data?.message ||
          error?.message ||
          "Payment failed";

        setPaymentStatus(
          paymentAttempts >= 3
            ? "error"
            : "retry"
        );

        setPaymentMessage(
          backendMessage
        );
      }
    };

  // =====================================================
  // PAYMENT EVENTS
  // =====================================================

  const handlePaymentComplete =
    (
      reference: string
    ) => {
      setPaymentStatus(
        "success"
      );

      if (window.fbq && selectedPackage) {
            window.fbq("track", "Purchase", {
              currency: "NGN",
              value: selectedPackage.amount,
              content_name: "Verification Credits",
              content_category: "Verification",
            });
          }

      setPaymentMessage(
        `Payment successful! Ref: ${reference}`
      );

      setPaymentAttempts(0);
    };

  const handlePaymentFailed =
    (
      error: string
    ) => {
      setPaymentStatus(
        paymentAttempts >= 3
          ? "error"
          : "retry"
      );

      setPaymentMessage(
        error ||
          "Payment failed"
      );
    };

  const handleModalClose =
    () => {
      setIsModalOpen(false);

      if (
        paymentStatus !==
        "success"
      ) {
        setTimeout(() => {
          setPaymentStatus(
            "idle"
          );

          setPaymentMessage(
            ""
          );
        }, 700);
      }
    };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-4">

      {/* PAYMENT NOTIFICATION */}
      {paymentStatus !==
        "idle" && (
        <PaymentNotification
          status={paymentStatus}
          message={
            paymentMessage
          }
          amount={
            selectedPackage?.amount
          }
          onRetry={
            handleInitiatePayment
          }
          onDismiss={() =>
            setPaymentStatus(
              "idle"
            )
          }
        />
      )}

      {/* MAIN CARD */}
      <div
        className="
          bg-white
          rounded-[32px]
          p-8
          border
          border-gray-100
          shadow-xl
          shadow-gray-200/40
        "
      >

        {/* HEADER */}
        <div className="space-y-4 mb-8">

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                w-11
                h-11
                rounded-2xl
                bg-blue-50
                flex
                items-center
                justify-center
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

            <div>
              <h2
                className="
                  text-xl
                  font-bold
                  text-gray-900
                "
              >
                Generate More
                Verification Links
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >
                Increase your
                verification
                capacity with
                additional credits.
              </p>
            </div>
          </div>

          {/* INFO BAR */}
          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              gap-2
              text-xs
              md:text-sm
              text-gray-600
              bg-gray-50
              border
              border-gray-100
              rounded-2xl
              px-4
              py-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <Info
                className="
                  w-4
                  h-4
                  text-blue-500
                "
              />

              <span>
                1 verification
                link uses{" "}
                <b>
                  3 credits
                </b>
              </span>
            </div>

            <span
              className="
                hidden
                md:inline-block
                text-gray-300
              "
            >
              •
            </span>

            <div>
              ₦
              {costPerVerification.toLocaleString()}
              {" "}
              ≈ 1 verification
            </div>

          </div>
        </div>

        {/* LOADING */}
        {isLoadingPackages &&
        apiPackages.length ===
          0 ? (

          <div
            className="
              py-14
              flex
              items-center
              justify-center
            "
          >
            <Loader
              className="
                w-6
                h-6
                text-blue-600
                animate-spin
              "
            />
          </div>

        ) : (
          <>

            {/* PACKAGE LIST */}
            <div className="space-y-4 mb-8">

              {packages
                .slice(0, 4)
                .map((pkg) => {

                  const estimatedLinks =
                    Math.floor(
                      pkg.credits / 3
                    );

                  return (
                    <label
                      key={pkg.id}
                      className="
                        block
                        relative
                        cursor-pointer
                        group
                      "
                    >

                      <input
                        type="radio"
                        name="credit_pkg"
                        value={pkg.id}
                        checked={
                          selectedPackageId ===
                          pkg.id
                        }
                        onChange={(
                          e
                        ) =>
                          setSelectedPackageId(
                            e.target
                              .value
                          )
                        }
                        className="peer sr-only"
                      />

                      <div
                        className="
                          p-6
                          rounded-[28px]
                          border
                          border-gray-200
                          peer-checked:border-blue-500
                          peer-checked:bg-blue-50/[0.35]
                          transition-all
                          duration-200
                          hover:border-blue-300
                          bg-white
                        "
                      >

                        {/* POPULAR */}
                        {pkg.isPopular && (
                          <div
                            className="
                              absolute
                              -top-3
                              right-6
                              bg-blue-600
                              text-white
                              text-[10px]
                              px-3
                              py-1
                              rounded-full
                              uppercase
                              tracking-wider
                              font-semibold
                            "
                          >
                            Most Popular
                          </div>
                        )}

                        <div
                          className="
                            flex
                            justify-between
                            items-start
                            gap-5
                          "
                        >

                          {/* LEFT */}
                          <div
                            className="
                              flex
                              items-start
                              gap-5
                            "
                          >

                            <div
                              className="
                                w-14
                                h-14
                                bg-blue-100/50
                                rounded-2xl
                                flex
                                items-center
                                justify-center
                                text-blue-600
                                shrink-0
                              "
                            >
                              <ShieldCheck
                                className="
                                  w-6
                                  h-6
                                "
                              />
                            </div>

                            <div>

                              <h3
                                className="
                                  font-bold
                                  text-gray-900
                                  text-lg
                                "
                              >
                                {pkg.credits}
                                {" "}
                                credits
                              </h3>

                              <p
                                className="
                                  text-sm
                                  text-gray-500
                                  mt-1
                                "
                              >
                                ≈{" "}
                                {
                                  estimatedLinks
                                }
                                {" "}
                                verification
                                {
                                  estimatedLinks !==
                                    1 &&
                                  "s"
                                }
                              </p>

                            </div>
                          </div>

                          {/* PRICE */}
                          <div
                            className="
                              text-right
                            "
                          >
                            <div
                              className="
                                text-2xl
                                font-bold
                                text-gray-900
                                tracking-tight
                              "
                            >
                              ₦
                              {pkg.amount.toLocaleString()}
                            </div>

                            <p
                              className="
                                text-xs
                                text-gray-400
                                mt-1
                              "
                            >
                              ₦
                              {(
                                pkg.amount /
                                pkg.credits
                              ).toLocaleString()}
                              {" "}
                              per credit
                            </p>
                          </div>

                        </div>
                      </div>
                    </label>
                  );
                })}
            </div>

            {/* CUSTOM */}
            <div className="mb-8">

              <div
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  bg-gray-50/70
                  p-5
                  space-y-4
                "
              >

                <div>
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-gray-900
                    "
                  >
                    Custom Amount
                  </p>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      mt-1
                    "
                  >
                    Estimate how many
                    verification links
                    your amount can
                    generate.
                  </p>
                </div>

                <div
                  className="
                    flex
                    flex-col
                    md:flex-row
                    gap-3
                    md:items-center
                  "
                >

                  <input
                    type="number"
                    min={0}
                    value={
                      customAmount
                    }
                    onChange={(
                      e
                    ) =>
                      setCustomAmount(
                        e.target
                          .value
                      )
                    }
                    placeholder="e.g. 5000"
                    className="
                      w-full
                      md:w-1/2
                      border
                      border-gray-200
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      focus:ring-2
                      focus:ring-blue-500
                      outline-none
                      bg-white
                    "
                  />

                  <div
                    className="
                      text-xs
                      md:text-sm
                      text-gray-600
                      space-y-1
                    "
                  >

                    {customAmountNumber >
                    0 ? (
                      <>
                        <p>
                          <b>
                            {
                              estimatedCredits
                            }
                          </b>
                          {" "}
                          credits
                        </p>

                        <p>
                          ≈{" "}
                          <b>
                            {
                              estimatedVerifications
                            }
                          </b>
                          {" "}
                          verification
                          {
                            estimatedVerifications !==
                              1 &&
                            "s"
                          }
                        </p>
                      </>
                    ) : (
                      <p>
                        ₦
                        {costPerVerification.toLocaleString()}
                        {" "}
                        ≈ 1
                        verification
                      </p>
                    )}

                  </div>
                </div>

              </div>
            </div>

            {/* CTA */}
            <button
              onClick={
                handleInitiatePayment
              }
              disabled={
                isInitiatingPayment ||
                paymentStatus ===
                  "loading"
              }
              className="
                w-full
                bg-blue-600
                hover:bg-blue-700
                disabled:bg-gray-400
                text-white
                font-semibold
                py-4
                rounded-2xl
                text-lg
                shadow-lg
                shadow-blue-600/20
                transition-all
                duration-200
              "
            >

              <span
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                {isInitiatingPayment
                  ? "Processing..."
                  : "Get Verification Credits"}

                {!isInitiatingPayment && (
                  <ChevronRight
                    className="
                      w-5
                      h-5
                    "
                  />
                )}

              </span>
            </button>

          </>
        )}
      </div>

      {/* PAYMENT MODAL */}
      <FlutterWaveModal
        isOpen={isModalOpen}
        paymentUrl={paymentUrl}
        reference={
          paymentReference
        }
        onClose={
          handleModalClose
        }
        onPaymentComplete={
          handlePaymentComplete
        }
        onPaymentFailed={
          handlePaymentFailed
        }
      />
    </div>
  );
};

export default CreditPackages;