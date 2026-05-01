import axios from "axios";

type UploadConfig = {
  uploadUrl: string;
  params: Record<string, string>;
};

type UploadResult = {
  publicId: string;
  resourceType: string;
  secureUrl: string;
};

type UploadProgressCallback = (progressPercent: number) => void;

export async function uploadToCloudinary(
  file: File,
  config: UploadConfig,
  onProgress?: UploadProgressCallback
): Promise<UploadResult> {
  try {
    const formData = new FormData();

    Object.entries(config.params).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);

    const response = await axios.post(config.uploadUrl, formData, {
      onUploadProgress: (event) => {
        if (!onProgress || !event.total) return;
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      },
    });

    const { public_id, resource_type, secure_url } = response.data ?? {};
    if (!public_id || !resource_type || !secure_url) {
      throw new Error("Invalid Cloudinary response");
    }

    return {
      publicId: public_id,
      resourceType: resource_type,
      secureUrl: secure_url,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "Cloudinary upload failed";
      throw new Error(message);
    }
    throw new Error("Cloudinary upload failed");
  }
}
