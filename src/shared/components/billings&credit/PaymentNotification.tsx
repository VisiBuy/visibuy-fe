import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Loader, X } from "lucide-react";

export type PaymentStatus = "idle" | "loading" | "success" | "error" | "retry";

interface PaymentNotificationProps {
  status: PaymentStatus;
  message: string;
  amount?: number;
  onRetry?: () => void;
  onDismiss: () => void;
  autoHideDelay?: number; // ms, 0 = no auto hide
}

/**
 * Payment Notification Component
 * Displays payment status feedback with retry and dismiss options
 */
export const PaymentNotification: React.FC<PaymentNotificationProps> = ({
  status,
  message,
  amount,
  onRetry,
  onDismiss,
  autoHideDelay = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHideDelay <= 0 || status === "loading" || status === "retry")
      return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, autoHideDelay);

    return () => clearTimeout(timer);
  }, [status, autoHideDelay, onDismiss]);

  if (!isVisible) return null;

  const getStyles = () => {
    switch (status) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: <CheckCircle className='w-5 h-5 text-green-600' />,
          text: "text-green-900",
          subtext: "text-green-700",
        };
      case "error":
      case "retry":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <AlertCircle className='w-5 h-5 text-red-600' />,
          text: "text-red-900",
          subtext: "text-red-700",
        };
      case "loading":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <Loader className='w-5 h-5 text-blue-600 animate-spin' />,
          text: "text-blue-900",
          subtext: "text-blue-700",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: null,
          text: "text-gray-900",
          subtext: "text-gray-700",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`${styles.bg} ${styles.border} border rounded-lg p-4 shadow-md flex items-start gap-4`}
      role='alert'
    >
      {/* Icon */}
      <div className='flex-shrink-0 mt-0.5'>{styles.icon}</div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <p className={`font-semibold ${styles.text}`}>{message}</p>
        {amount !== undefined && (
          <p className={`text-sm mt-1 ${styles.subtext}`}>
            Amount: ₦{amount.toLocaleString()}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className='flex-shrink-0 flex gap-2'>
        {(status === "error" || status === "retry") && onRetry && (
          <button
            onClick={onRetry}
            className='px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors'
          >
            Retry
          </button>
        )}
        <button
          onClick={() => {
            setIsVisible(false);
            onDismiss();
          }}
          className='p-1 hover:bg-white/50 rounded transition-colors'
          aria-label='Dismiss'
        >
          <X className='w-5 h-5 text-gray-500' />
        </button>
      </div>
    </div>
  );
};

export default PaymentNotification;
