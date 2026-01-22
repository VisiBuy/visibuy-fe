import { useParams } from "react-router-dom";
import { useGetVerificationByIdQuery } from "@/features/verifications/verificationApi";
import VerificationDetails from "@/features/verifications/verificationDetails";

export default function VerificationDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetVerificationByIdQuery(id!);

  if (isError || (!isLoading && !data)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <p className="text-danger text-h5-desktop font-semibold mb-space-8">
            Verification not found
          </p>
          <p className="text-neutral-600 text-body-small">
            The verification doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return <VerificationDetails verification={data!} isLoading={isLoading} />;
}
