import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePrepareUploadMutation,
  useFinalizeVerificationMutation,
} from "@/features";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, X } from "lucide-react";
import { CreateVerificationForm } from "@/forms/CreateVerificationForm";
import { CreateVerificationFormData } from "@/schemas/createVerificationSchema";
import { uploadToCloudinary } from "@/shared/utils/uploadToCloudinary";

export default function CreateVerificationPage() {
  const navigate = useNavigate();
  const [prepareUpload, { isLoading: isPreparingUpload }] =
    usePrepareUploadMutation();
  const [finalizeVerification, { isLoading: isFinalizing }] =
    useFinalizeVerificationMutation();
  const isLoading = isPreparingUpload || isFinalizing;

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [verificationLink, setVerificationLink] = useState("");
  const [newVerificationId, setNewVerificationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const handleSubmit = async (data: CreateVerificationFormData) => {
    if (uploading || isLoading) return;

    // reset previous error state on new submit
    setShowError(false);
    setErrorMessage(null);
    // 👉 FRONTEND UPLOAD LIMIT (e.g., 25 MB)
    const MAX_UPLOAD_MB = 100;
    const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

    // Calculate total size of photos + video
    const photosTotal = data.photos?.reduce((sum, file) => sum + file.size, 0) ?? 0;
    const videoSize = data.video ? data.video.size : 0;
    const totalBytes = photosTotal + videoSize;

    // Debug log for your dev tools
    console.log("Total upload size (MB):", (totalBytes / (1024 * 1024)).toFixed(2));

    if (totalBytes > MAX_UPLOAD_BYTES) {
      setErrorMessage(
        `Your photos and video are too large (${(
          totalBytes / (1024 * 1024)
        ).toFixed(1)} MB). Please keep total uploads under ${MAX_UPLOAD_MB} MB.`
      );
      setShowError(true);
      return;
    }

    const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
    const allowedVideoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);

    const hasInvalidPhotoType = data.photos.some(
      (photo) => !allowedImageTypes.has(photo.type)
    );
    if (hasInvalidPhotoType) {
      setErrorMessage("Only JPG, PNG, or WEBP images are allowed for photos.");
      setShowError(true);
      return;
    }

    if (data.video && !allowedVideoTypes.has(data.video.type)) {
      setErrorMessage("Only MP4, WEBM, or MOV files are allowed for video.");
      setShowError(true);
      return;
    }

    try {
      const uploadConfig = await prepareUpload().unwrap();
      const filesToUpload = data.video ? [...data.photos, data.video] : data.photos;
      const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

      setUploading(true);
      setUploadProgress(
        filesToUpload.reduce<Record<string, number>>((acc, file) => {
          acc[getFileKey(file)] = 0;
          return acc;
        }, {})
      );

      const uploadResults = await Promise.allSettled(
        filesToUpload.map(async (file) => {
          const uploaded = await uploadToCloudinary(
            file,
            {
              uploadUrl: uploadConfig.uploadUrl,
              params: uploadConfig.params,
            },
            (percent) => {
              setUploadProgress((prev) => ({
                ...prev,
                [getFileKey(file)]: percent,
              }));
            }
          );
          const resourceType: "image" | "video" =
            uploaded.resourceType === "video" ? "video" : "image";

          return {
            publicId: uploaded.publicId,
            resourceType,
          };
        })
      );

      const failedUploads = uploadResults.filter(
        (result): result is PromiseRejectedResult => result.status === "rejected"
      );
      if (failedUploads.length > 0) {
        throw new Error(
          `${failedUploads.length} file upload(s) failed. Please try again.`
        );
      }
      const assets = uploadResults
        .filter(
          (
            result
          ): result is PromiseFulfilledResult<{
            publicId: string;
            resourceType: "image" | "video";
          }> => result.status === "fulfilled"
        )
        .map((result) => result.value);

      const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

      const result = await finalizeVerification({
        sessionId: uploadConfig.sessionId,
        dto: {
          productTitle: data.title,
          description: data.description,
          price: data.price,
          escrowEnabled: data.enableEscrow,
          expiresAt,
        },
        assets,
      }).unwrap();

      // SAVE ID FOR REDIRECT
      setNewVerificationId(result.id);

      // PUBLIC LINK
      setVerificationLink(`https://verify.visibuy.com.ng/v/${result.publicToken}`);

      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("trackCustom", "VerificationCreated", {
          product_title: data.title,
          photo_count: data.photos.length,
          has_video: Boolean(data.video),
        });
      }

      setShowSuccess(true);
    } catch (err: any) {
      console.error("Verification failed:", err);

      let message = "Something went wrong. Please check the details and try again.";

      // NEW: Handle network errors (server unreachable)
      if (err?.status === "FETCH_ERROR") {
        message =
          "We couldn’t connect to the server. This looks like a network or server issue, not your form. Please check your internet or try again.";
      }
      // Handle backend error format
      else if (err?.data) {
        const data = err.data as any;

        if (Array.isArray(data?.message)) {
          message = data.message.join(", ");
        } else if (typeof data?.message === "string") {
          message = data.message;
        } else if (typeof data?.error === "string") {
          message = data.error;
        }
      }
      // Handle generic JS errors
      else if (typeof err?.message === "string") {
        message = err.message;
      }

      setErrorMessage(message);
      setShowError(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-space-32 pt-space-8">
      <CreateVerificationForm
        onSubmit={handleSubmit}
        isLoading={isLoading || uploading}
      />

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-neutral-black/50 flex items-center justify-center z-50 p-space-16">
          <div className="bg-neutral-white rounded-card p-space-32 max-w-md w-full text-center shadow-elevation-3 relative">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-neutral-500" />
            </button>

            <CheckCircle className="w-20 h-20 text-primary-green mx-auto mb-space-16" />
            <h2 className="text-h3-desktop md:text-h3-mobile font-bold text-neutral-900 mb-space-8">
              Your proof is ready — send it to your buyer
            </h2>

            <p className="text-body-medium text-neutral-600 mb-space-24">
              Send this to your buyer now so they can confirm it’s the exact item before paying.
            </p>

            <p className="text-body-small text-neutral-600 mb-space-24">
              This helps your buyer trust you and pay faster.
            </p>

            <div className="flex items-center gap-space-8 bg-neutral-100 p-space-12 rounded-input mb-space-24">
              <input
                type="text"
                value={verificationLink}
                readOnly
                className="flex-1 bg-transparent outline-none text-body-small text-neutral-700"
              />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(verificationLink);
                  toast.success("Link copied!");
                }}
                className="bg-primary-blue text-neutral-white px-space-16 py-space-8 rounded-input text-body-small hover:bg-primary-blue/90 transition-standard min-h-tap-target"
              >
                Copy link
              </button>
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                "Hi, this is the exact item you asked for. Please confirm it matches before payment: " + verificationLink
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full mt-space-24 bg-primary-green text-neutral-white px-space-32 py-space-12 rounded-btn-medium font-medium text-center hover:bg-primary-green/90 transition-standard"
            >
              Send to buyer on WhatsApp →
            </a>

            <button
              onClick={() => {
                if (newVerificationId) {
                  navigate(`/verifications/${newVerificationId}`);
                }
              }}
              className="mt-space-16 text-primary-blue underline text-body-small"
            >
              View details later
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-neutral-black/50 flex items-center justify-center z-50 p-space-16">
          <div className="bg-neutral-white rounded-card p-space-32 max-w-md w-full text-center shadow-elevation-3 relative">
            <button
              onClick={() => setShowError(false)}
              className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-neutral-500" />
            </button>

            <XCircle className="w-20 h-20 text-danger mx-auto mb-space-16" />
            <h2 className="text-h3-desktop md:text-h3-mobile font-bold text-neutral-900 mb-space-8">
              Verification Failed
            </h2>

            <p className="text-body-medium text-neutral-600 mb-space-24">
              {errorMessage
                ? errorMessage
                : "Something went wrong. Please check the details and try again."}
            </p>

            <div className="flex gap-space-16 justify-center">
              <button
                onClick={() => setShowError(false)}
                className="px-space-24 py-space-12 bg-neutral-200 rounded-btn-medium font-medium hover:bg-neutral-300 transition-standard min-h-tap-target"
              >
                Go Back
              </button>

              <button
                onClick={() => setShowError(false)}
                className="px-space-24 py-space-12 bg-primary-blue text-neutral-white rounded-btn-medium font-medium hover:bg-primary-blue/90 transition-standard min-h-tap-target"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
