import { useParams } from "react-router-dom";
import { useGetVerificationByIdQuery } from "@/features/verifications/verificationApi";
import VerificationDetails from "@/features/verifications/verificationDetails";

export default function VerificationDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetVerificationByIdQuery(id!);

  if (isError || (!isLoading && !data)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">
            Verification not found
          </p>
          <p className="text-gray-600 text-sm">
            The verification doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return <VerificationDetails verification={data!} isLoading={isLoading} />;
}
