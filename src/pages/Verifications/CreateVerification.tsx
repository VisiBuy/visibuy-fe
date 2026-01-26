import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateVerificationMutation } from "@/features";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, X } from "lucide-react";
import { CreateVerificationForm } from "@/forms/CreateVerificationForm";
import { CreateVerificationFormData } from "@/schemas/createVerificationSchema";

export default function CreateVerificationPage() {
  const navigate = useNavigate();
  const [createVerification, { isLoading }] = useCreateVerificationMutation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [verificationLink, setVerificationLink] = useState("");
  const [newVerificationId, setNewVerificationId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 🔹 NEW

  const handleSubmit = async (data: CreateVerificationFormData) => {
    // reset previous error state on new submit
    setShowError(false);
    setErrorMessage(null);

    try {
      const formData = new FormData();

      formData.append("productTitle", data.title);
      formData.append("description", data.description);

      if (data.enableEscrow) {
        formData.append("price", data.price.toString());
      } else if (data.price > 0) {
        formData.append("price", data.price.toString());
      }

      if (data.enableEscrow) {
        formData.append("escrowEnabled", "true");
      }

      data.photos.forEach((photo) => {
        formData.append("files", photo);
      });

      formData.append("files", data.video);

      const result = await createVerification(formData as any).unwrap();

      // SAVE ID FOR REDIRECT
      setNewVerificationId(result.id);

      // PUBLIC LINK
      setVerificationLink(`https://verify.visibuy.com.ng/v/${result.publicToken}`);

      setShowSuccess(true);
    } catch (err: any) {
      console.error("Verification failed:", err);

      // 🔹 Try to extract a meaningful backend message
      let message = "Something went wrong. Please check the details and try again.";

      // RTK Query error shape (err.data comes from backend)
      if (err?.data) {
        const data = err.data as any;

        if (Array.isArray(data?.message)) {
          // e.g. NestJS validation errors: { message: ["...","..."] }
          message = data.message.join(", ");
        } else if (typeof data?.message === "string") {
          message = data.message;
        } else if (typeof data?.error === "string") {
          // sometimes backend uses "error" instead of "message"
          message = data.error;
        }
      } else if (typeof err?.message === "string") {
        // fallback if we threw a plain Error(...)
        message = err.message;
      }

      setErrorMessage(message);
      setShowError(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-space-32 pt-space-8">
      <CreateVerificationForm onSubmit={handleSubmit} isLoading={isLoading} />

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
              Verification Created Successfully
            </h2>

            <p className="text-body-medium text-neutral-600 mb-space-24">
              Verification link has been generated for your product
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
                Copy Link
              </button>
            </div>

            <button
              onClick={() => {
                if (newVerificationId) {
                  navigate(`/verifications/${newVerificationId}`);
                }
              }}
              className="bg-primary-blue text-neutral-white px-space-32 py-space-12 rounded-btn-medium font-medium hover:bg-primary-blue/90 transition-standard min-h-tap-target"
            >
              Go to Verification Details
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
