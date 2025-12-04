import { useState } from "react";
import { useCreateVerificationMutation } from "@/features";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";
import { CreateVerificationForm } from "@/forms/CreateVerificationForm";
import { CreateVerificationFormData } from "@/schemas/createVerificationSchema";

export default function CreateVerificationPage() {
  const [createVerification, { isLoading }] = useCreateVerificationMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [verificationLink, setVerificationLink] = useState("");

  const handleSubmit = async (data: CreateVerificationFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("enableEscrow", data.enableEscrow.toString());

      data.photos.forEach((photo) => formData.append("photos", photo));
      if (data.video) formData.append("video", data.video);

      const result = await createVerification(formData as any).unwrap();

      setVerificationLink(`${window.location.origin}/verify/${result.id}`);
      setShowSuccess(true);
    } catch (err) {
      console.error("Verification failed:", err);
      setShowError(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 pt-2">

      <CreateVerificationForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verification Created Successfully</h2>
            <p className="text-gray-600 mb-6">
              Verification link has been generated for your product
            </p>
            <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg mb-6">
              <input
                type="text"
                value={verificationLink}
                readOnly
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(verificationLink);
                  toast.success("Link copied!");
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Copy Link
              </button>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-black text-white px-8 py-3 rounded-lg font-medium"
            >
              Go to Verification Details
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              Something went wrong. Please check the details and try again.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowError(false)}
                className="px-6 py-3 bg-gray-200 rounded-lg font-medium"
              >
                Go Back
              </button>
              <button
                onClick={() => setShowError(false)}
                className="px-6 py-3 bg-black text-white rounded-lg font-medium"
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