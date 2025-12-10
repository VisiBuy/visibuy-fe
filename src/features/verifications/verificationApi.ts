import { baseApi } from "@/services/api/baseApi";
import type {
  VerificationDto,
  CreateVerificationRequest,
  UpdateVerificationRequest,
} from "@/types/api";

export interface PaginatedVerificationResponse {
  items: VerificationDto[];
  total: number;
  count: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

export const verificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVerifications: build.query<PaginatedVerificationResponse, void>({
      query: () => "/verifications",
      providesTags: ["Verification"],
      transformResponse: (response: any) => {
        // Transform the API response to match our DTO structure
        const transformedItems = (response.items || []).map((item: any) => ({
          ...item,
          price: item.price ? parseFloat(item.price) : undefined,
          media: (item.media || []).map((media: any) => {
            // Map API response fields to DTO structure
            const transformedMedia = {
              id: media.id,
              url: media.storagePath || media.url || "",
              thumbnailUrl: media.thumbnailPath || media.thumbnailUrl || "",
              type: media.type || "image",
              uploadedAt: media.uploadedAt,
              duration: media.duration,
            };

            // Ensure we have at least one URL
            if (!transformedMedia.url && !transformedMedia.thumbnailUrl) {
              console.warn(
                "Media item missing both url and thumbnailUrl:",
                media
              );
            }

            return transformedMedia;
          }),
        }));

        return {
          items: transformedItems,
          total: response.total || 0,
          count: response.count || 0,
          hasMore: response.hasMore || false,
          offset: response.offset || 0,
          limit: response.limit || 50,
        };
      },
    }),
    getVerificationById: build.query<VerificationDto, string>({
      query: (id) => `/verifications/${id}`,
      providesTags: (r, e, id) => [{ type: "Verification" as const, id }],
    }),
    createVerification: build.mutation<
      VerificationDto,
      CreateVerificationRequest
    >({
      query: (body) => ({ url: "/verifications", method: "POST", body }),
      invalidatesTags: ["Verification", "Credit"],
    }),
    updateVerification: build.mutation<
      VerificationDto,
      { id: string; data: UpdateVerificationRequest }
    >({
      query: ({ id, data }) => ({
        url: `/verifications/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, { id }) => [
        { type: "Verification" as const, id },
      ],
    }),
    deleteVerification: build.mutation<void, string>({
      query: (id) => ({ url: `/verifications/${id}`, method: "DELETE" }),
      invalidatesTags: ["Verification"],
    }),
  }),
  overrideExisting: false,
});
export const {
  useGetVerificationsQuery,
  useGetVerificationByIdQuery,
  useCreateVerificationMutation,
  useUpdateVerificationMutation,
  useDeleteVerificationMutation,
} = verificationApi;
