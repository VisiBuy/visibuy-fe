import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { ROUTES } from "@/app/routes/constants";

const REDIRECT_DELAY = 3; // seconds

export default function EmailVerificationSuccessPage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [countdown, setCountdown] = useState<number>(REDIRECT_DELAY);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
      return;
    }

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate(ROUTES.DASHBOARD);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-redirect to dashboard after countdown
    const redirectTimer = setTimeout(() => {
      navigate(ROUTES.DASHBOARD);
    }, REDIRECT_DELAY * 1000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(redirectTimer);
    };
  }, [navigate, user]);

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  const handleProceed = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-neutral-white flex flex-col items-center justify-center px-space-16 py-space-32">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="relative inline-block mb-space-24">
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            {/* Email Icon - using a simple envelope representation */}
            <svg
              className="w-full h-full text-neutral-900"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          {/* Green Checkmark Overlay */}
          <div className="absolute -bottom-2 -right-2 bg-primary-green rounded-full p-space-8 shadow-elevation-2">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-neutral-white" />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-h2-desktop md:text-h2-mobile font-bold text-neutral-900 mb-space-16">
          Email Verification Successful!
        </h2>

        {/* Countdown Message */}
        <p className="text-body-medium text-neutral-600 mb-space-32">
          Redirecting to dashboard in{" "}
          <span className="font-semibold text-primary-blue">{countdown}</span>{" "}
          second{countdown !== 1 ? "s" : ""}...
        </p>

        {/* Proceed Button */}
        <button
          onClick={handleProceed}
          className="w-full h-btn-medium rounded-btn-medium bg-primary-blue hover:bg-primary-blue/90 active:opacity-90 text-neutral-white font-semibold text-body-medium transition-standard shadow-elevation-2 min-h-tap-target"
        >
          Proceed Now
        </button>
      </div>
    </div>
  );
}
