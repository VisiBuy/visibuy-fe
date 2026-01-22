import { KycStatusResponse } from "@/features/kyc/kycApi";
import { ROUTES } from "@/app/routes/constants";

/**
 * Checks if user needs to complete soft KYC verification
 * @param kycStatus - The KYC status response from the API
 * @returns true if user should be redirected to soft KYC page
 */
export const shouldRedirectToSoftKyc = (
  kycStatus: KycStatusResponse | undefined
): boolean => {
  if (!kycStatus) return false;

  // If soft KYC is already complete, no redirect needed
  if (kycStatus.softKycComplete) return false;

  // If either emailVerified OR phoneVerified is false AND softKycComplete is false, redirect
  // This means user needs to verify their email or phone
  const needsVerification =
    !kycStatus.emailVerified || !kycStatus.phoneVerified;
  return needsVerification && !kycStatus.softKycComplete;
};

/**
 * Gets the redirect path based on KYC status
 * @param kycStatus - The KYC status response from the API
 * @returns The path to redirect to, or null if no redirect needed
 */
export const getKycRedirectPath = (
  kycStatus: KycStatusResponse | undefined
): string | null => {
  if (shouldRedirectToSoftKyc(kycStatus)) {
    return ROUTES.AUTH.SOFT_KYC;
  }
  return null;
};
