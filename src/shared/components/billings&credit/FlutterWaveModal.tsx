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

/**
 * FlutterWave Payment Modal Component
 * Opens Flutterwave payment page in an iframe
 * Listens for payment completion events via postMessage
 */
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

    // Listen for messages from Flutterwave iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (!event.origin.includes("flutterwave.com")) return;

      const { status, reference: flutterwaveRef } = event.data;

      if (status === "successful" && flutterwaveRef === reference) {
        onPaymentComplete(flutterwaveRef);
        onClose();
      } else if (status === "failed" || status === "cancelled") {
        onPaymentFailed(
          status === "cancelled" ? "Payment cancelled" : "Payment failed",
        );
        setError(
          status === "cancelled"
            ? "You cancelled the payment"
            : "Payment processing failed",
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isOpen, reference, onPaymentComplete, onPaymentFailed, onClose]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl'>
        {/* Header */}
        <div className='flex justify-between items-center p-6 border-b'>
          <h2 className='text-lg font-bold text-gray-900'>Complete Payment</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            aria-label='Close modal'
          >
            <X className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-hidden relative'>
          {isLoading && (
            <div className='absolute inset-0 bg-white flex items-center justify-center z-10'>
              <div className='text-center'>
                <Loader className='w-8 h-8 text-blue-600 animate-spin mx-auto mb-2' />
                <p className='text-gray-600'>Loading payment page...</p>
              </div>
            </div>
          )}

          {error && (
            <div className='absolute inset-0 bg-white flex items-center justify-center z-10'>
              <div className='text-center p-6'>
                <AlertCircle className='w-12 h-12 text-red-600 mx-auto mb-4' />
                <p className='text-gray-900 font-semibold mb-2'>
                  Payment Error
                </p>
                <p className='text-gray-600 mb-6'>{error}</p>
                <button
                  onClick={onClose}
                  className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {!error && (
            <iframe
              src={paymentUrl}
              className='w-full h-full border-0'
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setError("Failed to load payment page");
                setIsLoading(false);
              }}
              title='Flutterwave Payment'
              sandbox='allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation'
            />
          )}
        </div>

        {/* Footer */}
        <div className='border-t p-4 bg-gray-50'>
          <p className='text-xs text-gray-600 text-center'>
            Secured by Flutterwave • Payment Reference:{" "}
            <span className='font-mono'>{reference}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlutterWaveModal;
