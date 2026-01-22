import { useState } from "react";
import FormatDate from "@/shared/hooks/FormatDate";
import { ProductCardProps } from "@/types/api";
import { Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProductCard({ verification, onClick }: ProductCardProps) {
  const [copied, setCopied] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-primary-green";
      case "pending":
        return "bg-[#FFB62E]"; // Warning yellow/orange
      case "active":
        return "bg-primary-blue";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-neutral-600";
    }
  };

  // Find the first image in media array (filter out videos)
  const imageMedia = verification.media?.find((m) => m.type === "image");
  const imageUrl = imageMedia?.thumbnailUrl || imageMedia?.url;

  // Generate verification link
  const verificationLink = `https://verify.visibuy.com.ng/v/${verification.publicToken}`;

  // Format verification code (e.g., "VB-2024-001" from publicToken)
  const formatVerificationCode = (publicToken: string): string => {
    // If token is already formatted, return as is
    if (publicToken.includes("-")) {
      return publicToken;
    }
    // Otherwise, format it (this is a placeholder - adjust based on actual format)
    return publicToken.slice(0, 8).toUpperCase();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationLink);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div onClick={onClick}
    className="border border-neutral-300 p-card-md rounded-card bg-neutral-white shadow-card cursor-pointer"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if ((e.key === "Enter" || e.key === " ") && onClick) {
        onClick();
      }
    }}>
      <div className="space-y-space-16">
        {/* Top Row: Image, Product Details, Price/Date */}
        <div className="flex items-center justify-between gap-space-16">
          {/* Left: Image and Product Details */}
          <div className="flex items-center gap-space-12 flex-1 min-w-0">
            {/* Product Image */}
            <div className="w-[56px] h-[50px] md:w-[80px] md:h-[70px] rounded-card flex items-center justify-center overflow-hidden bg-neutral-100 flex-shrink-0">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={verification.productTitle}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (
                      imageMedia?.url &&
                      imageMedia.url !== imageUrl &&
                      target.src !== imageMedia.url
                    ) {
                      target.src = imageMedia.url;
                    } else {
                      target.style.display = "none";
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                  <span className="text-caption text-neutral-400">
                    No Image
                  </span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <p className="text-body-small font-bold text-neutral-900 truncate">
                {verification.productTitle}
              </p>
              <p className="text-caption text-neutral-600 mt-space-4">
                {formatVerificationCode(verification.publicToken)}
              </p>
              <p className="text-caption text-neutral-500 mt-space-4">
                Escrow: {verification.escrowEnabled ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Right: Price and Date */}
          <div className="text-body-small text-right space-y-space-4 flex-shrink-0">
            <p className="text-neutral-900 font-semibold">
              {verification.price
                ? new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 2,
                  }).format(verification.price)
                : "N/A"}
            </p>
            <p className="text-caption text-neutral-600">
              {FormatDate(verification.createdAt)}
            </p>
          </div>
        </div>

        {/* Bottom Row: Verification Link and Status */}
        <div className="flex items-center justify-between gap-space-16">
          {/* Verification Link with Copy */}
          <div className="flex items-center gap-space-8 flex-1 min-w-0">
            <div className="flex items-center gap-space-8 bg-neutral-100 border border-neutral-300 rounded-input px-space-12 py-space-8 flex-1 min-w-0">
              <input
                type="text"
                value={verificationLink}
                readOnly
                className="flex-1 bg-transparent outline-none text-caption text-neutral-700 truncate"
              />
              <button
  onClick={(e) => {
    e.stopPropagation(); // 🚫 Prevent card click from firing
    handleCopyLink();
  }}
  className="flex-shrink-0 p-space-4 hover:bg-neutral-200 rounded-input transition-standard min-h-tap-target min-w-tap-target flex items-center justify-center"
  title="Copy verification link"
>
  {copied ? (
    <Check className="w-4 h-4 text-primary-green" />
  ) : (
    <Copy className="w-4 h-4 text-neutral-600" />
  )}
</button>
            </div>
          </div>

          {/* Status Button */}
          <p
            className={`font-semibold px-space-16 py-space-4 rounded-btn-small text-neutral-white text-caption capitalize flex-shrink-0 ${getStatusColor(
              verification.status
            )}`}
          >
            {verification.status === "approved"
              ? "Completed"
              : verification.status === "rejected"
              ? "Rejected"
              : verification.status}
          </p>
        </div>
      </div>
    </div>
  );
}
