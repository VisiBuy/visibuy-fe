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
    formState: { errors, touchedFields, isSubmitted },
    setValue,
    watch,
    trigger,
  } = useForm<CreateVerificationFormData>({
    resolver: zodResolver(createVerificationSchema),
    mode: "onBlur", // Validate title, desc, price on blur
    reValidateMode: "onSubmit", // Revalidate photos only on submit
    defaultValues: {
      price: 0,
      enableEscrow: false,
      photos: [],
      video: undefined,
    },
  });

  const photos = watch("photos");
  const video = watch("video");

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - photos.length;
    const newPhotos = [...photos, ...files.slice(0, remaining)];
    setValue("photos", newPhotos, { shouldValidate: isSubmitted }); // Only validate on submit
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

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-space-32">
      {/* Title */}
      <div>
        <label className="block text-body-small font-medium text-neutral-700 mb-gap-label-input">
          Product Title
        </label>
        <input
          {...register("title")}
          placeholder="Enter product title"
          className="w-full h-input px-space-16 py-space-12 rounded-input border border-neutral-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:outline-none text-body-medium font-secondary transition-standard"
        />
        {errors.title && (
          <p className="text-danger text-body-small mt-space-8">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-body-small font-medium text-neutral-700 mb-gap-label-input">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={6}
          placeholder="Enter product description"
          className="w-full px-space-16 py-space-12 rounded-input border border-neutral-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:outline-none text-body-medium font-secondary transition-standard resize-none"
        />
        {errors.description && (
          <p className="text-danger text-body-small mt-space-8">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-body-small font-medium text-neutral-700 mb-gap-label-input">
          Price
        </label>
        <input
          type="number"
          step="0.01"
          {...register("price")}
          className="w-full h-input px-space-16 py-space-12 rounded-input border border-neutral-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:outline-none text-body-medium font-secondary transition-standard"
        />
        {errors.price && (
          <p className="text-danger text-body-small mt-space-8">
            {errors.price.message}
          </p>
        )}
      </div>

      {/* Media Upload */}
      <div>
        <label className="block text-body-small font-medium text-neutral-700 mb-space-16">
          Media Upload <span className="text-danger">*</span>
        </label>
        <p className="text-body-small text-neutral-600 mb-space-24">
          You must upload <strong>exactly 5 photos</strong> of your product.
          Video is optional.
        </p>

        {/* Photos */}
        <div className="mb-8">
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
                      <div className="absolute inset-0 bg-neutral-black/40 opacity-0 hover:opacity-100 transition-standard flex items-center justify-center text-neutral-white text-caption font-medium">
                        <div className="text-center">
                          <div>VISIBUY VERIFIED</div>
                          <div className="text-caption opacity-80">
                            {new Date().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-space-8 right-space-8 bg-danger text-neutral-white rounded-full p-space-12 opacity-0 hover:opacity-100 transition-standard shadow-elevation-2 min-h-tap-target min-w-tap-target flex items-center justify-center"
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

          {/* Photos Error - Only show after submit */}
          {isSubmitted && errors.photos && (
            <p className="text-danger text-body-small mt-space-12 font-medium animate-fade-in">
              {errors.photos.message}
            </p>
          )}

          {/* Helper Text */}
          <p className="text-body-small text-neutral-600 mt-space-12">
            {photos.length === 5 ? (
              <span className="text-primary-green font-medium">
                All 5 photos uploaded — ready!
              </span>
            ) : (
              <>
                You need <strong>{5 - photos.length} more</strong> photo(s)
              </>
            )}
          </p>
        </div>

        {/* Video (Required) */}
<div>
  <label className="block text-body-small font-medium text-neutral-700 mb-space-12">
    Upload Video <span className="text-danger">*</span>
  </label>

  <input
    type="file"
    accept="video/*"
    id="video-upload"
    className="hidden"
    required
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        setValue("video", file, { shouldValidate: true });
      }
    }}
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
        onClick={() =>
          setValue("video", undefined as any, { shouldValidate: true })
        }
        className="min-h-tap-target min-w-tap-target flex items-center justify-center"
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

{/* Escrow */}
<div className="flex items-center gap-space-12">
  <input
    type="checkbox"
    {...register("enableEscrow")}
    className="w-5 h-5 text-primary-blue rounded focus:ring-primary-blue min-h-tap-target min-w-tap-target"
  />
  <label className="text-body-medium font-medium text-neutral-700">
    Enable Escrow Protection
  </label>
</div>

{/* Submit Button */}
<button
  type="submit"
  disabled={isLoading || photos.length !== 5 || !video}
  className={`w-full h-btn-medium px-btn-medium-x rounded-btn-medium font-semibold text-neutral-white transition-standard shadow-elevation-2 min-h-tap-target ${
    photos.length === 5 && video && !isLoading
      ? "bg-primary-blue hover:bg-primary-blue/90 active:opacity-90"
      : "bg-neutral-400 cursor-not-allowed"
  }`}
>
  {isLoading ? "Creating Verification..." : "Submit Verification"}
</button>

{/* Final Warning (only after submit) */}
{isSubmitted && (photos.length !== 5 || !video) && (
  <p className="text-center text-danger font-medium text-body-small mt-space-16 animate-pulse">
    {photos.length !== 5 && !video
      ? "Please upload exactly 5 photos and a video before submitting"
      : photos.length !== 5
      ? "Please upload exactly 5 photos before submitting"
      : "Please upload a video before submitting"}
  </p>
)}
  </div>   {/* closes Media Upload wrapper div */}
</form>  {/* closes the form */}
);     
