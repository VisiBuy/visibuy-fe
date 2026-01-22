import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useInitiateSoftKycMutation,
  useCompleteSoftKycMutation,
} from "@/features/kyc/kycApi";
import { useAppSelector } from "@/app/hooks";
import { ROUTES } from "@/app/routes/constants";
import { toast } from "react-hot-toast";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 20; // seconds

export default function SoftKycPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [initiateSoftKyc, { isLoading: isInitiating }] =
    useInitiateSoftKycMutation();
  const [completeSoftKyc, { isLoading: isCompleting }] =
    useCompleteSoftKycMutation();
  const user = useAppSelector((state) => state.auth.user);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
      return;
    }
  }, [user, navigate]);

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  // Mask email for display
  const getMaskedEmail = (email?: string): string => {
    if (!email) return "your email";
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) return email;
    const masked = localPart[0] + "***" + localPart[localPart.length - 1];
    return `${masked}@${domain}`;
  };

  const maskedEmail = getMaskedEmail(user?.email);

  const handleSendCode = async () => {
    try {
      await initiateSoftKyc({ method: "email" }).unwrap();
      setResendCooldown(RESEND_COOLDOWN);
      toast.success("Verification code sent to your email");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send verification code");
    }
  };

  // Initialize code sending on mount
  useEffect(() => {
    handleSendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, CODE_LENGTH);
    const digits = pastedData.split("").filter((char) => /^\d$/.test(char));

    if (digits.length > 0) {
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (i < CODE_LENGTH) {
          newCode[i] = digit;
        }
      });
      setCode(newCode);

      // Focus the next empty input or the last one
      const nextEmptyIndex = newCode.findIndex(
        (val, idx) => !val && idx < CODE_LENGTH
      );
      const focusIndex =
        nextEmptyIndex === -1 ? CODE_LENGTH - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();
      setFocusedIndex(focusIndex);
    }
  };

  const handleVerify = async () => {
    const codeString = code.join("");
    if (codeString.length !== CODE_LENGTH) return;

    setIsVerifying(true);
    try {
      await completeSoftKyc({
        method: "email",
        code: codeString,
      }).unwrap();

      // Navigate to success page
      navigate(ROUTES.AUTH.EMAIL_VERIFICATION_SUCCESS);
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Verification failed. Please try again."
      );
      // Clear code on error
      setCode(Array(CODE_LENGTH).fill(""));
      setFocusedIndex(0);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");
  const canResend = resendCooldown === 0 && !isInitiating;

  return (
    <div className='min-h-screen bg-neutral-white flex flex-col items-center justify-center px-space-16 py-space-32'>
      {/* Loading Overlay */}
      {isVerifying && (
        <div className='fixed inset-0 bg-neutral-black/50 flex items-center justify-center z-50'>
          <div className='bg-neutral-white rounded-card p-space-32 flex flex-col items-center space-y-space-16 shadow-elevation-3'>
            <div className='relative w-16 h-16'>
              <div className='absolute inset-0 border-4 border-neutral-300 rounded-full'></div>
              <div className='absolute inset-0 border-4 border-primary-blue border-t-transparent rounded-full animate-spin'></div>
            </div>
            <p className='text-body-medium text-neutral-700 font-medium'>
              You'll be verified in 3s...
            </p>
          </div>
        </div>
      )}

      <div className='w-full max-w-md'>
        {/* Title */}
        <h1 className='text-h2-desktop md:text-h2-mobile font-bold text-neutral-900 text-center mb-space-16'>
          Email Verification
        </h1>

        {/* Instruction Text */}
        <p className='text-body-medium text-neutral-600 text-center mb-space-32'>
          We sent a 6-digit code to {maskedEmail}. Please enter the code to
          verify your email.
        </p>

        {/* Code Input Fields */}
        <div className='flex justify-center gap-space-8 mb-space-24'>
          {Array.from({ length: CODE_LENGTH }).map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={code[index]}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => setFocusedIndex(index)}
              disabled={isVerifying || isCompleting}
              className={`
                w-12 h-12 md:w-14 md:h-14
                text-center
                text-h4-desktop font-semibold
                rounded-input
                border-2
                transition-standard
                focus:outline-none
                ${
                  focusedIndex === index
                    ? "border-primary-blue bg-primary-blue/5"
                    : code[index]
                    ? "border-neutral-400 bg-neutral-100"
                    : "border-neutral-300 bg-neutral-white"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            />
          ))}
        </div>

        {/* Resend Code */}
        <div className='text-center mb-space-24'>
          {canResend ? (
            <button
              onClick={handleSendCode}
              disabled={isInitiating}
              className='text-primary-blue hover:text-primary-blue/80 font-medium text-body-small transition-standard underline disabled:opacity-50'
            >
              Resend code
            </button>
          ) : (
            <span className='text-neutral-600 text-body-small'>
              Resend code ({resendCooldown}s)
            </span>
          )}
        </div>

        {/* Helper Text */}
        <p className='text-body-small text-neutral-600 text-center mb-space-32'>
          Remember to check your spam folder.
        </p>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={!isCodeComplete || isVerifying || isCompleting}
          className={`
            w-full
            h-btn-medium
            rounded-btn-medium
            font-semibold
            text-body-medium
            text-neutral-white
            transition-standard
            min-h-tap-target
            ${
              isCodeComplete && !isVerifying && !isCompleting
                ? "bg-primary-blue hover:bg-primary-blue/90 active:opacity-90 shadow-elevation-2"
                : "bg-neutral-400 cursor-not-allowed"
            }
          `}
        >
          {isVerifying || isCompleting ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
