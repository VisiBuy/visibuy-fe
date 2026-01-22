import { useState } from "react";
import { X, Play } from "lucide-react";
import { VerificationDto } from "@/types/api";

type VerificationStatus = "pending" | "approved" | "rejected" | "expired";

interface VerificationDetailsProps {
  verification: VerificationDto;
  isLoading?: boolean;
}

// Shape coming from backend
type RawMedia = {
  id: string;
  type: "image" | "video";
  storagePath: string;
  thumbnailPath?: string;
  uploadedAt: string;
  duration?: number;
};

// Normalized shape we use in the UI
type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  duration?: number;
};

const STATUS_STYLES: Record<VerificationStatus, string> = {
  pending: "bg-blue-50 text-blue-600 border border-blue-200",
  approved: "bg-green-50 text-green-600 border border-green-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
  expired: "bg-gray-100 text-gray-600 border border-gray-300",
};

// NGN formatter that works with number or string
const formatPrice = (value: unknown) => {
  if (value === null || value === undefined) return "N/A";

  const num = typeof value === "number" ? value : Number(value as any);
  if (Number.isNaN(num)) return "N/A";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(num);
};

// Timestamp formatter
const formatTimestamp = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  return date.toLocaleString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Relative timestamp for media
const formatRelativeTime = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Video duration formatter
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VerificationDetails = ({
  verification,
  isLoading = false,
}: VerificationDetailsProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // ✅ Normalize media array from backend shape → UI shape
  const rawMedia = (verification?.media || []) as RawMedia[];
  const mediaItems: MediaItem[] = rawMedia.map((item) => ({
    id: item.id,
    type: item.type,
    url: item.storagePath, // <- main image/video URL
    thumbnailUrl: item.thumbnailPath, // <- cloudinary thumb
    uploadedAt: item.uploadedAt,
    duration: item.duration,
  }));

  // You can keep this for debugging if you want
  // console.log("🔎 mediaItems normalized:", mediaItems);

  // Loading / not found states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Loading verification…</p>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-2">
          <p className="text-danger text-lg font-semibold">
            Verification not found
          </p>
          <p className="text-neutral-600 text-sm">
            The verification you’re looking for doesn’t exist or is no longer
            available.
          </p>
        </div>
      </div>
    );
  }

  // Share link for buyers
  const shareLink = `https://verify.visibuy.com.ng/v/${verification.publicToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const activeMedia =
    lightboxIndex !== null ? mediaItems[lightboxIndex] : undefined;

  const statusStyle =
    STATUS_STYLES[verification.status as VerificationStatus] ??
    "bg-neutral-100 text-neutral-700 border border-neutral-300";

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8 space-y-8">
          {/* Header: title + price */}
          <header className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  {verification.productTitle}
                </h1>
                <p className="text-sm text-neutral-500">
                  {verification.description ||
                    `${verification.productTitle} Verification`}
                </p>
              </div>

              <p className="text-2xl sm:text-3xl font-bold text-neutral-900 whitespace-nowrap">
                {formatPrice(verification.price)}
              </p>
            </div>
          </header>

          {/* Media gallery */}
          {mediaItems.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-base font-semibold text-neutral-900">
                Media
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {mediaItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => openLightbox(index)}
                    className="relative group rounded-2xl overflow-hidden bg-neutral-100 aspect-square flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-blue/40"
                  >
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={verification.productTitle || `Media ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;
                        // fallback: if thumb fails, try main url
                        if (item.url && img.src !== item.url) {
                          img.src = item.url;
                          return;
                        }
                        // if that also fails, hide the broken image
                        img.style.display = "none";
                      }}
                    />

                    {/* Video overlay */}
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-white/90 rounded-full p-3 shadow-lg">
                          <Play className="w-6 h-6 text-neutral-900 fill-neutral-900" />
                        </div>
                      </div>
                    )}

                    {/* Duration badge */}
                    {item.type === "video" && item.duration && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded-md">
                        {formatDuration(item.duration)}
                      </span>
                    )}

                    {/* Uploaded time */}
                    {item.uploadedAt && (
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        {formatRelativeTime(item.uploadedAt)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Status */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-neutral-900">
              Verification Status
            </h2>
            <span
              className={`inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full ${statusStyle}`}
            >
              {verification.status.charAt(0).toUpperCase() +
                verification.status.slice(1)}
            </span>
          </section>

          {/* Escrow info */}
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-neutral-900">
              Escrow Information
            </h2>
            <p className="text-sm text-neutral-600">
              {verification.escrowEnabled ? "Escrow Enabled" : "Escrow Disabled"}
            </p>
          </section>

          {/* Metadata */}
          <section className="pt-4 border-t border-neutral-100 space-y-1 text-sm text-neutral-600">
            <p>
              <span className="font-medium text-neutral-900">Created:</span>{" "}
              {formatTimestamp(verification.createdAt)}
            </p>
            {verification.expiresAt && (
              <p>
                <span className="font-medium text-neutral-900">Expires:</span>{" "}
                {formatTimestamp(verification.expiresAt)}
              </p>
            )}
          </section>

          {/* Share link */}
          <section className="pt-4 border-t border-neutral-100 space-y-2">
            <h2 className="text-base font-semibold text-neutral-900">
              Share Verification Link
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <input
                readOnly
                value={shareLink}
                className="flex-1 min-w-0 px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
              >
                {copySuccess ? "Copied ✓" : "Copy Link"}
              </button>
            </div>
          </section>
        </section>
      </div>

      {/* Lightbox modal */}
      {lightboxIndex !== null && activeMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-4 -right-4 bg-white/90 text-neutral-900 rounded-full p-2 shadow-lg hover:bg-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-black rounded-2xl overflow-hidden flex-1 flex items-center justify-center">
              {activeMedia.type === "video" ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  muted
                  className="max-w-full max-h-[80vh]"
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt="Full view"
                  className="max-w-full max-h-[80vh] object-contain"
                />
              )}
            </div>

            {/* Counter */}
            <div className="mt-3 text-center text-xs text-neutral-200">
              {lightboxIndex + 1} / {mediaItems.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationDetails;
