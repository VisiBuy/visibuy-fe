import React, { useEffect, useState } from "react";
import { X, AlertCircle, Loader } from "lucide-react";

interface FlutterWaveModalProps {
  isOpen: boolean;
  paymentUrl: string;
  reference: string;
  onClose: () => void;
  onPaymentComplete: (reference: string) => void;
  onPaymentFailed: (error: string) => void;
}

export const FlutterWaveModal: React.FC<FlutterWaveModalProps> = ({
  isOpen,
  paymentUrl,
  reference,
  onClose,
  onPaymentComplete,
  onPaymentFailed,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("flutterwave.com")) return;

      const { status, reference: flutterwaveRef } = event.data;

      if (status === "successful" && flutterwaveRef === reference) {
        onPaymentComplete(flutterwaveRef);
        onClose();
      } else if (status === "failed" || status === "cancelled") {
        onPaymentFailed(
          status === "cancelled" ? "Payment cancelled" : "Payment failed"
        );
        setError(
          status === "cancelled"
            ? "You cancelled the payment"
            : "Payment processing failed"
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isOpen, reference, onPaymentComplete, onPaymentFailed, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4 md:px-0">
      {/* DESKTOP → large centered modal */}
      {/* MOBILE → FULL SCREEN */}
      <div
        className="
          bg-white rounded-xl shadow-2xl overflow-hidden 
          w-full 
          h-[95vh] 
          md:h-[85vh] 
          max-w-4xl 
          md:rounded-2xl
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Complete Payment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 h-full">
          {isLoading && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
              <div className="text-center">
                <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Loading payment page...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-10 p-6 text-center">
              <div>
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <p className="font-semibold text-gray-900 mb-1">
                  Payment Error
                </p>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* IFRAME - Full Height */}
          {!error && (
            <iframe
              src={paymentUrl}
              className="w-full h-full border-0"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError("Failed to load payment page");
                setIsLoading(false);
              }}
              title="Flutterwave Payment"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
            />
          )}
        </div>

        <div className="border-t p-3 bg-gray-50 text-center">
          <p className="text-xs text-gray-600">
            Secured by Flutterwave • Ref:{" "}
            <span className="font-mono">{reference}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlutterWaveModal;
