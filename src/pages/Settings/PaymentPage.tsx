import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsFillCreditCardFill } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";

// ------------------------------------------------------
// MOCK SERVICES (replace with real API integration)
// ------------------------------------------------------
function fetchPaymentMethods() {
  return Promise.resolve([
    {
      id: "1",
      brand: "Visa",
      last4: "4242",
      label: "Primary Card",
      isDefault: true,
      expires: "02/28",
    },
    {
      id: "2",
      brand: "Mastercard",
      last4: "9898",
      label: "",
      isDefault: false,
      expires: "04/26",
    },
  ]);
}

function deletePaymentMethod(id: string) {
  return Promise.resolve(true);
}

// -------------- Toggle Function --------------
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked ? "true" : "false"}
      className={`relative inline-flex items-center transition-colors duration-200 ease-out ${
        checked ? "bg-black" : "bg-gray-300"
      } rounded-full p-1 w-12 h-5.5`}
    >
      <span className="sr-only">Toggle</span>

      <span
        className={`transform transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        } inline-block h-5 w-5 rounded-full bg-white`}
      />
    </button>
  );
}

// --------------- Reusable small components ----------------
function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export default function PaymentPage(): JSX.Element {
  const navigate = useNavigate();

  const [methods, setMethods] = useState<any[]>([]);
  const [escrowOn, setEscrowOn] = useState<boolean>(true);

  useEffect(() => {
    fetchPaymentMethods().then((data) => setMethods(data));
  }, []);

  async function handleDelete(id: string) {
    await deletePaymentMethod(id);
    setMethods((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Blue Header */}
      <div className="w-full  bg-[#007BFF]">
        <div className="max-w-6xl mx-auto px-6 py-2 rounded-b-lg">
          <div className="flex items-center gap-3 text-white ">
            <button
              onClick={() => navigate(-1)}
              aria-label="Back"
              className="p-2 rounded-md bg-transparent hover:bg-white/10 "
            >
              ←
            </button>
            <h1 className="text-lg font-semibold text-center justify-center">
              Payment Methods
            </h1>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Escrow settings */}
        <SectionCard>
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-bold">Escrow Settings</h3>

            <div className="flex items-center justify-between w-full bg-gray-100 rounded px-4 py-2 ">
              <span className="ml-4 text-base font-bold">
                Enable Escrow By Default
                <p className="text-xs text-gray-500">
                  All new verifications will use escrows payment protection
                </p>
              </span>
              <Toggle checked={escrowOn} onChange={setEscrowOn} />
            </div>
            <p className="flex text-wrap text-center text-xs text-gray-500 mt-5">
              What is Escrow? Escrow holds the buyer’s payment securely until
              the work is completed and approved, ensuring both parties are
              protected.
            </p>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold">Saved Payments Methods</h2>

            <button
              className="px-4 py-2 bg-black text-white text-xs rounded-lg shadow-sm"
              onClick={() => {
                /* open modal - not implemented in mock */
              }}
            >
              + Add New
            </button>
          </div>

          <div className="space-y-4">
            {methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center bg-[#ffffff] justify-between gap-4 p-4 border border-gray-300 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {/* Black Box Icon */}
                  <div className="w-14 h-10 bg-black rounded-base flex items-center justify-center">
                    <BsFillCreditCardFill size={22} className="text-white" />{" "}
                  </div>

                  <div>
                    <p className="font-bold text-sm">
                      {method.brand} •••• {method.last4}
                      {method.isDefault && (
                        <span className="ml-3 inline-block align-middle text-xs font-bold bg-green-300 text-green-800 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      Expires {method.expires}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(method.id)}
                    aria-label="Delete payment method"
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="Delete"
                  >
                    <RiDeleteBinLine size={20} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
            {/* If No Saved payments */}
            {methods.length === 0 && (
              <p className="text-gray-500 text-sm text-center">
                No payment methods added yet.
              </p>
            )}
          </div>
        </SectionCard>

        {/* Bank Accounts for Payouts */}
        <SectionCard>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Bank Accounts for Payouts</h2>

            <button className="px-8 py-1 bg-black text-white text-xs rounded-lg shadow-sm">
              Edit
            </button>
          </div>

          <div className="mt-4 border border-gray-200 rounded-xl p-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-10 bg-black rounded-base flex items-center justify-center">
                <BsFillCreditCardFill size={22} className="text-white" />{" "}
              </div>

              <div>
                <p className="font-bold text-sm">Garanti BBVA</p>
                <p className="text-xs text-gray-400">
                  IBAN: TR•• •••• •••• •••• •••• ••42
                </p>
              </div>
            </div>
          </div>
          <div className="flex mt-8 flex-col items-center gap-4">
            <p className="flex justify-center text-center text-xs text-gray-400 mt-3">
              Verification required: To receive payouts. Please verify your bank
              account. we’ll send a small deposit for verification.{" "}
            </p>

            <button className=" w-1/2 flex justify-center text-xs px-3 py-1 bg-black text-white rounded-lg shadow-sm">
              Verify Now{" "}
            </button>
          </div>
        </SectionCard>

        {/* Flutterwave Account */}
        <SectionCard>
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-sm font-bold">Flutterwave Account</h3>
            <p className="text-xs font-bold text-black">
              Connect your Flutterwave account to receive international payments
              and manage payouts seamlessly.
            </p>
            <div className="w-full flex justify-center mt-2">
              <button className="px-8 py-2 bg-black text-white rounded-lg font-bold shadow-sm">
                Connect Flutterwave{" "}
              </button>{" "}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
