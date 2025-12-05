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

export const CreateVerificationForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
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
      video: null,
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Title */}
      <div>
        <label className="block text-lg font-bold mb-2">Product Title</label>
        <input
          {...register("title")}
          placeholder="Enter product title"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-lg font-bold mb-2">Description</label>
        <textarea
          {...register("description")}
          rows={6}
          placeholder="Enter product description"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-lg font-bold mb-2">Price</label>
        <input
          type="number"
          step="0.01"
          {...register("price")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
      </div>

      {/* Media Upload */}
      <div>
        <label className="block text-lg font-bold mb-4">
          Media Upload <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-6">
          You must upload <strong>exactly 5 photos</strong> of your product. Video is optional.
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
            className={`cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              photos.length >= 5
                ? "bg-green-100 text-green-700 cursor-not-allowed border-2 border-green-300"
                : "bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300"
            }`}
          >
            <Upload className="w-5 h-5" />
            {photos.length >= 5 ? "All 5 photos uploaded" : `Upload Photos (${photos.length}/5)`}
          </label>

          {/* Photo Grid */}
          <div className="grid grid-cols-5 gap-4 mt-6">
            {Array.from({ length: 5 }).map((_, index) => {
              const photo = photos[index];
              return (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50"
                >
                  {photo ? (
                    <>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                        <div className="text-center">
                          <div>VISIBUY VERIFIED</div>
                          <div className="text-xs opacity-80">
                            {new Date().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Upload className="w-10 h-10" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Photos Error - Only show after submit */}
          {isSubmitted && errors.photos && (
            <p className="text-red-500 text-sm mt-3 font-medium animate-fade-in">
              {errors.photos.message}
            </p>
          )}

          {/* Helper Text */}
          <p className="text-sm text-gray-600 mt-3">
            {photos.length === 5 ? (
              <span className="text-green-600 font-medium">
                All 5 photos uploaded — ready!
              </span>
            ) : (
              <>You need <strong>{5 - photos.length} more</strong> photo(s)</>
            )}
          </p>
        </div>

        {/* Video (Optional) */}
        <div>
          <label className="block text-lg font-medium mb-3">
            Upload Video (Optional)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => e.target.files?.[0] && setValue("video", e.target.files[0])}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <Upload className="w-5 h-5" />
            {video ? "Change Video" : "Upload Video"}
          </label>
          {video && (
            <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              {video.name}
              <button type="button" onClick={() => setValue("video", null)}>
                <X className="w-4 h-4 ml-2 hover:bg-green-200 rounded-full p-1 transition" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Escrow */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register("enableEscrow")}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="text-lg font-medium">Enable Escrow Protection</label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-lg font-semibold text-white transition-all shadow-lg ${
          photos.length === 5 && !isLoading
            ? "bg-black hover:bg-gray-900"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? "Creating Verification..." : "Submit Verification"}
      </button>

      {/* Final Warning (only after submit) */}
      {isSubmitted && photos.length !== 5 && (
        <p className="text-center text-red-600 font-medium text-sm mt-4 animate-pulse">
          Please upload exactly 5 photos before submitting
        </p>
      )}
    </form>
  );
};