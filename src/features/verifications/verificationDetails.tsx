import { useState, useEffect } from "react";
import { X, Play, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { VerificationDto } from "@/types/api";
import { verificationApi } from "./verificationApi";

// Type definitions
type VerificationStatus = "pending" | "approved" | "rejected" | "expired";

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  thumbnailUrl?: string;
  uploadedAt: string;
  duration?: number;
}

const statusStyles: Record<VerificationStatus, string> = {
  pending: "bg-blue-50 text-blue-600 border border-blue-200",
  approved: "bg-green-50 text-green-600 border border-green-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
  expired: "bg-gray-100 text-gray-600 border border-gray-300",
};

interface VerificationDetailsProps {
  verification: VerificationDto;
  isLoading?: boolean;
}

// Helper function to format timestamps
const formatTimestamp = (dateString: string) => {
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

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Helper function to format video duration
const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const VerificationDetails = ({
  verification,
  isLoading = false,
}: VerificationDetailsProps) => {
  // ============================================
  // Component State
  // ============================================
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(100);

  const mediaItems = verification?.media || [];

  // progress bar
  useEffect(() => {
    const container = document.getElementById("media-scroll-container");
    if (!container) return;

    const updateProgress = () => {
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const progress = maxScroll <= 0 ? 100 : (scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
    };

    updateProgress();
    container.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);

    return () => {
      container.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [mediaItems.length]);

  // ============================================
  // Event Handlers
  // ============================================
  const handleCopy = () => {
    const link =
      typeof window !== "undefined"
        ? `${window.location.origin}/verification/${verification.id}`
        : "";
    if (link) navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const openLightbox = (index: number) => setSelectedImage(index);

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null && mediaItems.length > 0) {
      setSelectedImage((prev) =>
        prev !== null ? (prev + 1) % mediaItems.length : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && mediaItems.length > 0) {
      setSelectedImage((prev) =>
        prev !== null ? (prev - 1 + mediaItems.length) % mediaItems.length : 0
      );
    }
  };

  // ============================================
  // Render Loading State
  // ============================================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">
            Verification not found
          </p>
          <p className="text-gray-600 text-sm">
            The verification you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }
  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/verification/${verification.id}`
      : "";

  // ============================================
  // Main Render
  // ============================================
  return (
    <div className="min-h-screen w-full bg-[linear-gradient(to_bottom,#2563eb_130px,white_100px)]">
      {/* Info Banner */}
      <div className="bg-black text-white text-center py-2 px-4 text-sm">
        We just released the referral code feature on our dashboard 🎉. To earn
        delivery point,{" "}
        <span className="underline cursor-pointer text-blue-600">
          try it out
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start  gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {verification.productTitle}
              </h1>
              <div className="text-2xl sm:text-3xl font-bold  text-left sm:text-right text-gray-900 whitespace-nowrap">
                ${verification.price?.toLocaleString() ?? "N/A"}
              </div>
            </div>
            <p className="text-sm text-gray-600">{verification.description}</p>
          </div>

          {mediaItems.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-5">Media</h3>

              <div className="relative -mx-4 lg:mx-0">
                <div
                  id="media-scroll-container"
                  className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 supports-[scrollbar-width:none]:px-0 lg:px-0 lg:grid lg:grid-cols-5"
                >
                  {/* Hide native scrollbar completely */}
                  <style>{`
                    #media-scroll-container::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {mediaItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => openLightbox(index)}
                      className="flex-none w-32 sm:w-48 lg:w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 hover:opacity-90 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/30 relative group snap-center"
                    >
                      <img
                        src={item.thumbnailUrl || item.url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl">
                            <Play className="w-8 h-8 text-gray-900 fill-gray-900" />
                          </div>
                        </div>
                      )}

                      {item.type === "video" && item.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                          {formatDuration(item.duration)}
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        {item.uploadedAt && formatTimestamp(item.uploadedAt)}
                      </div>
                    </button>
                  ))}
                </div>

                {/* PROGRESS BAR */}
                <div className="mt-6 px-8 ">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gray-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${scrollProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Status Badge */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Verification Status
            </h3>
            <span
              className={`inline-block px-4 py-2 text-sm font-medium rounded-lg ${
                statusStyles[verification.status]
              }`}
            >
              {verification.status.charAt(0).toUpperCase() +
                verification.status.slice(1)}
            </span>
          </div>

          {/* Escrow Information */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Escrow Information
            </h3>
            <p
              className="text-sm text-gray-600
            "
            >
              {verification.escrowEnabled ||
                (verification.escrowEnabled
                  ? "Escrow Enabled"
                  : "Escrow Disabled")}
            </p>
          </div>

          {/* Metadata - Created Date */}
          <div className="pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium text-gray-900">Created:</span>{" "}
                {new Date(verification.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {verification.expiresAt && (
                <p>
                  <span className="font-medium text-gray-900">Expires:</span>{" "}
                  {new Date(verification.expiresAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Share/Copy Link Section */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex gap-3 items-center">
              <input
                readOnly
                value={shareLink}
                className="flex-1 min-w-0 px-4 py-3.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 truncate"
              />
              <button
                onClick={handleCopy}
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Copy Link
              </button>
            </div>
            {copySuccess && (
              <p className="text-green-600 text-sm font-medium mt-2">
                ✓ Link copied to clipboard!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full-Screen Image/Video View */}
      {selectedImage !== null &&
        mediaItems.length > 0 &&
        mediaItems[selectedImage] && (
          <>
            {/* Mobile Full-Screen Version */}
            <div
              className="fixed inset-0 z-50 flex flex-col bg-black lg:hidden"
              onClick={closeLightbox}
            >
              <div className="flex justify-between items-start p-5 pt-10">
                <button
                  onClick={closeLightbox}
                  className="text-white p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition"
                >
                  <X className="w-7 h-7" />
                </button>
                <span className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-full">
                  {selectedImage + 1} / {mediaItems.length}
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-full max-h-full">
                  {mediaItems[selectedImage].type === "video" ? (
                    <video
                      src={mediaItems[selectedImage].url}
                      controls
                      autoPlay
                      muted
                      loop
                      className="max-w-full max-h-[75vh] rounded-3xl shadow-2xl"
                    />
                  ) : (
                    <img
                      src={mediaItems[selectedImage].url}
                      alt="Full view"
                      className="max-w-full max-h-[75vh] object-contain rounded-3xl shadow-2xl"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Desktop/Tablet Version */}
            <div
              className="hidden lg:fixed lg:inset-0 lg:z-50 lg:flex lg:items-center lg:justify-center lg:p-6 lg:bg-black/70"
              onClick={closeLightbox}
            >
              <div
                className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-6">
                  <button
                    onClick={closeLightbox}
                    className="text-white p-3 hover:bg-white/10 rounded-full transition"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <span className="text-white font-bold text-lg">
                    {selectedImage + 1} / {mediaItems.length}
                  </span>
                </div>

                <div className="px-10 pb-10">
                  <div className="bg-gray-900 rounded-3xl overflow-hidden flex items-center justify-center min-h-96">
                    {mediaItems[selectedImage].type === "video" ? (
                      <video
                        src={mediaItems[selectedImage].url}
                        controls
                        autoPlay
                        muted
                        loop
                        className="max-w-full max-h-[70vh] rounded-3xl"
                      />
                    ) : (
                      <img
                        src={mediaItems[selectedImage].url}
                        alt="Full view"
                        className="max-w-full max-h-[75vh] object-contain rounded-3xl"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  );
};
export default VerificationDetails;
