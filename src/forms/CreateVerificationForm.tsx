import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X, CheckCircle } from "lucide-react";
import {
  createVerificationSchema,
  CreateVerificationFormData,
} from "@/schemas/createVerificationSchema";

interface Props {
  onSubmit: (data: CreateVerificationFormData) => Promise<void>;
  isLoading: boolean;
}

export const CreateVerificationForm: React.FC<Props> = ({
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    watch,
    trigger,
  } = useForm<CreateVerificationFormData>({
    resolver: zodResolver(createVerificationSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: {
      price: 0,
      enableEscrow: false,
      photos: [],
      video: undefined,
    },
  });

  const title = watch("title");
  const description = watch("description");
  const price = watch("price");
  const enableEscrow = watch("enableEscrow");

  const photos = watch("photos");
  const video = watch("video");

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - photos.length;
    const newPhotos = [...photos, ...files.slice(0, remaining)];

    setValue("photos", newPhotos, { shouldValidate: isSubmitted });

    if (isSubmitted) await trigger("photos");
  };

  const removePhoto = async (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setValue("photos", newPhotos, { shouldValidate: isSubmitted });

    if (isSubmitted) await trigger("photos");
  };

  const onFormSubmit = async (data: CreateVerificationFormData) => {
    await onSubmit(data);
  };

  const readiness = useMemo(() => {
    const detailsReady =
      Boolean(title?.trim()) && Boolean(description?.trim()) && Number(price) > 0;
    const photosReady = photos.length === 5;
    const videoReady = Boolean(video);
    return { detailsReady, photosReady, videoReady };
  }, [title, description, price, photos.length, video]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-space-32">
      {/* ✅ Purpose Header (reinforce without slowing) */}
      <div className="rounded-card border border-neutral-200 bg-neutral-white shadow-card p-card-md">
        <h2 className="text-h4-desktop font-semibold text-neutral-900">
          Create a Verification
        </h2>
        <p className="mt-space-8 text-body-medium text-neutral-700">
          Upload real-time proof of the exact product your buyer is interested in.
        </p>
        <p className="mt-space-8 text-body-small text-neutral-600">
          Every approved verification increases your trust score and helps you close
          faster.
        </p>
      </div>

      {/* Product Details */}
      <div className="space-y-space-24">
        <div>
          <label className="block text-body-small font-medium text-neutral-700 mb-gap-label-input">
            Product Title
          </label>
          <input
            {...register("title")}
            placeholder="e.g. Adidas ZX 8000 Light Aqua (Size 10)"
            className="w-full h-input px-space-16 py-space-12 rounded-input border border-neutral-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:outline-none text-body-medium font-secondary transition-standard"
          />
          {errors.title && (
            <p className="text-danger text-body-small mt-space-8">
              {errors.title.message}
            </p>
          )}
          <p className="text-body-small text-neutral-600 mt-space-8">
            Be specific — buyers compare this to what you deliver.
          </p>
        </div>

        <div>
          <label className="block text-body-small font-medium text-neutral-700 mb-gap-label-input">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={6}
            placeholder="Describe condition, key details, what’s included, and any visible flaws."
            className="w-full px-space-16 py-space-12 rounded-input border border-neutral-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:outline-none text-body-medium font-secondary transition-standard resize-none"
          />
          {errors.description && (
            <p className="text-danger text-body-small mt-space-8">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-body-small font-medium text-neutral-700 mb-gap-label-input">
            Price (₦)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 45000"
            {...register("price")}
            className="w-full h-input px-space-16 py-space-12 rounded-input border border-neutral-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:outline-none text-body-medium font-secondary transition-standard"
          />
          {errors.price && (
            <p className="text-danger text-body-small mt-space-8">
              {errors.price.message}
            </p>
          )}
        </div>
      </div>

      {/* Media Upload */}
      <div className="rounded-card border border-neutral-200 bg-neutral-white shadow-card p-card-md">
        <label className="block text-body-small font-medium text-neutral-700 mb-space-12">
          Upload Proof <span className="text-danger">*</span>
        </label>

        <p className="text-body-small text-neutral-700">
          Upload <strong>5 clear photos</strong> and a <strong>short video</strong>{" "}
          so your buyer can approve confidently.
        </p>

        <ul className="mt-space-12 text-body-small text-neutral-600 list-disc pl-space-24 space-y-space-8">
          <li>Front view</li>
          <li>Side view</li>
          <li>Close-up of key details</li>
          <li>Label/serial (if any)</li>
          <li>Any flaws (if any)</li>
        </ul>

        {/* Photos */}
        <div className="mt-space-24">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="hidden"
            id="photo-upload"
            disabled={photos.length >= 5}
          />

          <label
            htmlFor="photo-upload"
            className={`cursor-pointer inline-flex items-center gap-space-8 px-space-24 py-space-12 rounded-input font-medium transition-standard min-h-tap-target ${
              photos.length >= 5
                ? "bg-primary-green/10 text-primary-green cursor-not-allowed border-2 border-primary-green/30"
                : "bg-neutral-100 hover:bg-neutral-200 border-2 border-dashed border-neutral-300"
            }`}
          >
            <Upload className="w-5 h-5" />
            {photos.length >= 5
              ? "All 5 photos uploaded"
              : `Upload Photos (${photos.length}/5)`}
          </label>

          {/* Photo Grid */}
          <div className="grid grid-cols-5 gap-space-16 mt-space-24">
            {Array.from({ length: 5 }).map((_, index) => {
              const photo = photos[index];
              return (
                <div
                  key={index}
                  className="relative aspect-square rounded-card border-2 border-dashed border-neutral-300 overflow-hidden bg-neutral-100"
                >
                  {photo ? (
                    <>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* ✅ Better mobile UX: visible on mobile, hover on desktop */}
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-space-8 right-space-8 bg-danger text-neutral-white rounded-full p-space-12 shadow-elevation-2 opacity-100 md:opacity-0 md:hover:opacity-100 transition-standard"
                        aria-label={`Remove photo ${index + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-400">
                      <Upload className="w-10 h-10" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isSubmitted && errors.photos && (
            <p className="text-danger text-body-small mt-space-12 font-medium animate-fade-in">
              {errors.photos.message}
            </p>
          )}

          <p className="text-body-small text-neutral-600 mt-space-12">
            {photos.length === 5 ? (
              <span className="text-primary-green font-medium">
                Photos ready — great.
              </span>
            ) : (
              <>
                You need <strong>{5 - photos.length} more</strong> photo(s)
              </>
            )}
          </p>
        </div>

        {/* Video */}
        <div className="mt-space-24">
          <label className="block text-body-small font-medium text-neutral-700 mb-space-8">
            Upload Video <span className="text-danger">*</span>
          </label>
          <p className="text-body-small text-neutral-600 mb-space-12">
            Keep it short (max 30s). A slow 360° scan works best.
          </p>

          <input
            type="file"
            accept="video/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setValue("video", e.target.files[0], { shouldValidate: true });
              }
            }}
            className="hidden"
            id="video-upload"
          />

          <label
            htmlFor="video-upload"
            className="cursor-pointer inline-flex items-center gap-space-8 px-space-20 py-space-12 bg-neutral-100 rounded-input hover:bg-neutral-200 transition-standard min-h-tap-target"
          >
            <Upload className="w-5 h-5" />
            {video ? "Change Video" : "Upload Video"}
          </label>

          {video && (
            <div className="mt-space-12 inline-flex items-center gap-space-8 bg-primary-green/10 text-primary-green px-space-16 py-space-8 rounded-full text-body-small font-medium">
              <CheckCircle className="w-4 h-4" />
              {video.name}
              <button
                type="button"
                onClick={() => setValue("video", undefined, { shouldValidate: true })}
                className="min-h-tap-target min-w-tap-target flex items-center justify-center"
                aria-label="Remove video"
              >
                <X className="w-4 h-4 ml-space-8 hover:bg-primary-green/20 rounded-full p-space-4 transition-standard" />
              </button>
            </div>
          )}

          {errors.video && (
            <p className="text-danger text-body-small mt-space-8">
              {errors.video.message}
            </p>
          )}
        </div>
      </div>

      {/* ✅ Escrow (subtle + optional, no gating) */}
      <details className="rounded-card border border-neutral-200 bg-neutral-white shadow-card p-card-md">
        <summary className="cursor-pointer list-none flex items-center justify-between">
          <div>
            <div className="text-body-medium font-semibold text-neutral-900">
              Optional: Escrow Protection
            </div>
            <div className="text-body-small text-neutral-600 mt-space-4">
              Enable escrow if you want extra payment assurance for this transaction.
            </div>
          </div>
          <span className="text-neutral-500 text-body-small">Toggle</span>
        </summary>

        <div className="mt-space-16 space-y-space-12">
          <div className="flex items-center gap-space-12">
            <input
              type="checkbox"
              {...register("enableEscrow")}
              className="w-5 h-5 text-primary-blue rounded"
            />
            <label className="text-body-medium font-medium text-neutral-700">
              Enable Escrow for this verification
            </label>
          </div>

          {enableEscrow && (
            <p className="text-body-small text-neutral-600">
              Buyer pays into escrow and funds are released after delivery is confirmed.
            </p>
          )}

          <p className="text-caption text-neutral-500">
            Learn more about escrow{" "}
            <a
  href="https://visibuy.com.ng/payment-terms"
  target="_blank"
  rel="noopener noreferrer"
  className="text-primary-blue underline underline-offset-2"
>
  here
</a>
            .
          </p>
        </div>
      </details>

      {/* ✅ Readiness (micro feedback loop) */}
      <div className="rounded-card border border-neutral-200 bg-neutral-white p-card-md">
        <div className="text-body-small font-medium text-neutral-700 mb-space-12">
          Verification readiness
        </div>
        <div className="space-y-space-8 text-body-small">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Product details</span>
            <span
              className={
                readiness.detailsReady ? "text-primary-green font-medium" : "text-neutral-500"
              }
            >
              {readiness.detailsReady ? "Ready" : "In progress"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Photos</span>
            <span
              className={
                readiness.photosReady ? "text-primary-green font-medium" : "text-neutral-500"
              }
            >
              {readiness.photosReady ? "5/5 ready" : `${photos.length}/5`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Video</span>
            <span
              className={
                readiness.videoReady ? "text-primary-green font-medium" : "text-neutral-500"
              }
            >
              {readiness.videoReady ? "Ready" : "Not added"}
            </span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || photos.length !== 5 || !video}
        className={`w-full h-btn-medium px-btn-medium-x rounded-btn-medium font-semibold text-neutral-white transition-standard shadow-elevation-2 ${
          photos.length === 5 && video && !isLoading
            ? "bg-primary-blue hover:bg-primary-blue/90"
            : "bg-neutral-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? "Generating Link..." : "Generate Verification Link"}
      </button>

      {/* Bottom Error */}
      {isSubmitted && (photos.length !== 5 || !video) && (
        <p className="text-center text-danger font-medium text-body-small mt-space-16 animate-pulse">
          {photos.length !== 5 && !video
            ? "Please upload 5 photos and a video before generating the link"
            : photos.length !== 5
            ? "Please upload 5 photos before generating the link"
            : "Please upload a video before generating the link"}
        </p>
      )}
    </form>
  );
};
