import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/routes/constants";
import { useGetSellerProfileQuery } from "../../features/sellerprofile/sellerApi";
import {
  useGetKycStatusQuery,
  type KycStatusResponse,
} from "../../features/kyc/kycApi";

import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

import checkmark from "../../assets/icons/line-md_circle-filled-to-confirm-circle-filled-transition.svg";
import loadingIcon from "../../assets/icons/icon-park-solid_loading-three.svg";
import cancelIcon from "../../assets/icons/ic_baseline-cancel.svg";

import badgeIcon from "../../assets/icons/Group 13782 (1).svg"; // Bronze + avatar medal
import diamondIcon from "../../assets/icons/diamond-01-svgrepo-com.svg"; // Gold
import rocketIcon from "../../assets/icons/rocket-svgrepo-com.svg";
import shieldIcon from "../../assets/icons/shield-check-svgrepo-com (1).svg"; // Silver + KYC shield
import userIcon from "../../assets/icons/user-check-alt-1-svgrepo-com.svg";

import { PageWrapper } from "@/shared/components/layout/PageWrapper";

export const SellerProfile: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: seller,
    isLoading,
    isError,
  } = useGetSellerProfileQuery();

  const {
    data: kycData,
    isLoading: kycLoading,
    isError: kycError,
  } = useGetKycStatusQuery();

  // ----------------- Loading / error states -----------------
  if (isLoading) {
    return (
      <PageWrapper isScrollable={true}>
        <section className="text-black relative z-[100] -mt-3">
          <div className="flex flex-col gap-8">
            <Skeleton width="100%" height={300} className="rounded-lg" />
            <Skeleton width="100%" height={200} className="rounded-lg" />
            <Skeleton width="100%" height={200} className="rounded-lg" />
          </div>
        </section>
      </PageWrapper>
    );
  }

  if (isError || !seller) {
    return (
      <PageWrapper isScrollable={true}>
        <p className="text-black flex justify-center items-center font-semibold text-xl text-center">
          Error in fetching seller&apos;s data
        </p>
      </PageWrapper>
    );
  }

  // ----------------- Derived data: trust / username -----------------
  const trustScore = seller.trustScore ?? 0; // expected 0–100

  const username =
    seller.name?.toLowerCase().split(" ").join("") || "visibuy-seller";

  // Legacy badges (optional secondary badges from backend)
  const badgesIcon: Record<string, string> = {
    verifiedSeller: shieldIcon,
    trustedBuyer: userIcon,
    premiumMember: diamondIcon,
    earlyAdopter: rocketIcon,
  };

  const badgesToDisplay = () => {
    if (!seller.badges) return [];
    const badgesArray = Object.entries(seller.badges || {});
    const activeBadges = badgesArray
      .filter(([, value]) => value === true)
      .map(([key]) => key);

    const matchedBadges = activeBadges
      .map((key) => badgesIcon[key])
      .filter(Boolean);
    return matchedBadges;
  };

  // ----------------- Trust tier: Bronze / Silver / Gold -----------------
  type TrustTier = "bronze" | "silver" | "gold";

  const getTrustTier = (score: number): TrustTier => {
    if (score >= 70) return "gold";
    if (score >= 40) return "silver";
    return "bronze"; // 0–39
  };

  const trustTier: TrustTier = getTrustTier(trustScore);

  const trustTierLabel: Record<TrustTier, string> = {
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold",
  };

  const trustTierIcon: Record<TrustTier, string> = {
    bronze: badgeIcon,
    silver: shieldIcon,
    gold: diamondIcon,
  };

  // ----------------- KYC status mapping (from API) -----------------
  type KycUiStatus = "not_started" | "pending" | "verified" | "rejected";

  const mapKycToUiStatus = (d?: KycStatusResponse | null): KycUiStatus => {
    if (!d) return "not_started";

    // If backend says rejected, always show rejected
    if (d.status === "rejected") return "rejected";

    // Full KYC wins – treat as fully verified
    if (d.fullKycComplete || d.level === "full") return "verified";

    // Pending review → pending (for either soft or full)
    if (d.status === "pending") return "pending";

    // Soft KYC (phone/email) counts as verified in UI
    if (
      d.softKycComplete ||
      d.level === "soft" ||
      d.emailVerified ||
      d.phoneVerified
    ) {
      return "verified";
    }

    // Otherwise, nothing started yet
    return "not_started";
  };

  const uiKycStatus: KycUiStatus = mapKycToUiStatus(kycData);

  const kycLabel: Record<KycUiStatus, string> = {
    not_started: "Not started",
    pending: "Pending verification",
    verified:
      kycData?.level === "full" ? "Full KYC approved" : "Soft KYC approved",
    rejected: "Rejected – update documents",
  };

  const kycBadgeClass: Record<KycUiStatus, string> = {
    not_started: "bg-gray-100 text-gray-700",
    pending: "bg-amber-50 text-amber-700",
    verified: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
  };

  const kycButtonLabel =
    uiKycStatus === "not_started"
      ? "Start KYC"
      : uiKycStatus === "pending"
      ? "KYC Under Review"
      : uiKycStatus === "rejected"
      ? "Retry KYC"
      : kycData?.level === "soft"
      ? "Upgrade to Full KYC"
      : "KYC Completed";

  const kycLevelLabel = kycData
    ? kycData.level === "none"
      ? "No KYC"
      : kycData.level === "soft"
      ? "Soft KYC"
      : "Full KYC"
    : "Unknown";

  const kycButtonDisabled =
    uiKycStatus === "pending" ||
    (uiKycStatus === "verified" && kycData?.level === "full");

  const handleKycClick = () => {
    if (kycButtonDisabled) return;
    // Route where they will fill all the KYC form
    navigate("/verifications/kyc");
  };

  // ----------------- Render -----------------
  return (
    <PageWrapper isScrollable={true}>
      <section className="text-black relative z-[100] -mt-3">
        {/* PROFILE SUMMARY */}
        <div className="min-w-fit flex flex-col gap-4 bg-white text-black rounded-lg p-6 relative border-gray-300 border-2">
          <div>
            <div className="flex justify-center flex-col items-center my-1">
              <div className="flex justify-center items-center relative">
                <div className="w-24 h-24 rounded-full bg-gray-300" />
                {/* Small medal on avatar */}
                <img src={badgeIcon} alt="" className="absolute bottom-1 left-1" />
              </div>
              <h3 className="font-bold text-lg">{seller.name}</h3>
              <p className="font-medium text-xs">@{username}</p>
            </div>

            <div className="flex flex-col gap-2 sm:absolute sm:top-3 sm:right-3">
              <Link
                to={ROUTES.SELLER.PROFILE_EDIT}
                className="w-full rounded-xl border-black p-2 bg-black text-white sm:w-36 border-2 text-center"
              >
                Edit Profile
              </Link>
              <Link
                to={`${ROUTES.SELLER.PUBLIC}/${seller.id}`}
                className="rounded-xl border-black py-1 border-2 text-center"
              >
                Public Profile
              </Link>
            </div>
          </div>

          {/* Trust score */}
          <div className="flex flex-col gap-2">
            <div className="flex w-full justify-between font-bold">
              <p>Trust score</p>
              <p>{trustScore}/100</p>
            </div>
            <div>
              <div className="w-full h-3 bg-gray-400 rounded-xl relative overflow-hidden">
                <div
                  className="bg-blue-600 absolute rounded-xl h-3"
                  style={{
                    width: `${Math.min(Math.max(trustScore, 0), 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Badges: Bronze / Silver / Gold */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold">Badges</h3>

            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200">
                <img
                  src={trustTierIcon[trustTier]}
                  alt={`${trustTierLabel[trustTier]} badge`}
                  width={26}
                  height={26}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-sm text-black">
                  {trustTierLabel[trustTier]} Badge
                </p>
                <p className="text-xs text-gray-600">
                  Based on your trust score of {trustScore}/100.
                </p>
              </div>
            </div>

            {/* Optional secondary backend badges */}
            {badgesToDisplay().length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {badgesToDisplay().map((icon, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 p-1 border border-gray-200"
                  >
                    <img
                      src={icon}
                      alt="Seller badge"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* VERIFICATION STATUS */}
        <div className="w-full bg-white rounded-lg p-6 mt-6 border-gray-300 border-2 flex flex-col gap-4">
          <h3 className="font-bold">Verification Status</h3>
          <div className="flex justify-between gap-2 flex-wrap">
            <div className="border-2 border-gray-300 h-36 rounded-xl p-4 flex flex-col justify-center gap-4 flex-1 min-w-[120px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <img
                src={checkmark}
                alt="Approved verifications"
                width={45}
                height={45}
                className="m-auto"
              />
              <div className="bg-gray-400 h-3 rounded-md" />
            </div>
            <div className="border-2 border-gray-300 h-36 rounded-xl p-4 flex flex-col justify-center gap-4 flex-1 min-w-[120px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <img
                src={loadingIcon}
                alt="Pending verifications"
                width={45}
                height={45}
                className="m-auto"
              />
              <div className="bg-gray-400 h-3 rounded-md " />
            </div>
            <div className="border-2 border-gray-300 h-36 rounded-xl p-4 flex flex-col justify-center gap-4 flex-1 min-w-[120px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <img
                src={cancelIcon}
                alt="Rejected verifications"
                width={45}
                height={45}
                className="m-auto"
              />
              <div className="bg-gray-400 h-3 rounded-md " />
            </div>
          </div>
        </div>

        {/* KYC / EXTRA PROTECTION */}
        <div className="w-full bg-white rounded-lg p-6 mt-6 border-gray-300 border-2 flex flex-col gap-4">
          <h3 className="font-bold">KYC &amp; Extra Protection</h3>

          {kycLoading ? (
            <p className="text-sm text-gray-600">Checking your KYC status…</p>
          ) : kycError ? (
            <p className="text-sm text-red-600">
              We couldn&apos;t load your KYC status. Please try again later.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Complete KYC to unlock extra protection for you and your buyers,
                including higher trust score and stronger dispute support.
              </p>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Status pill */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <img
                      src={shieldIcon}
                      alt="KYC shield"
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${kycBadgeClass[uiKycStatus]}`}
                    >
                      {kycLabel[uiKycStatus]}
                    </span>
                    <span className="text-xs text-gray-600 mt-1">
                      Level: {kycLevelLabel}
                    </span>
                  </div>
                </div>

                {/* CTA button -> goes to /verifications/kyc when enabled */}
                <button
                  type="button"
                  onClick={handleKycClick}
                  className="mt-2 sm:mt-0 px-4 py-2 rounded-lg bg-black text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors disabled:bg-neutral-400 disabled:cursor-not-allowed"
                  disabled={kycButtonDisabled}
                >
                  {kycButtonLabel}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default SellerProfile;
