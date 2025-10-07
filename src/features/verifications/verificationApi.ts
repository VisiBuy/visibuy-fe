import { baseApi } from '@/services/api/baseApi';
import type {
  VerificationDto,
  CreateVerificationRequest,
  UpdateVerificationRequest,
} from '@/types/api';

export const verificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getVerifications: build.query<VerificationDto[], void>({ query: () => '/verifications', providesTags: ['Verification'] }),
    getVerificationById: build.query<VerificationDto, string>({ query: (id) => `/verifications/${id}`, providesTags: (r, e, id) => [{ type: 'Verification' as const, id }] }),
    createVerification: build.mutation<VerificationDto, CreateVerificationRequest>({
      query: (body) => ({ url: '/verifications', method: 'POST', body }),
      invalidatesTags: ['Verification','Credit'],
    }),
    updateVerification: build.mutation<VerificationDto, { id: string; data: UpdateVerificationRequest }>({
      query: ({ id, data }) => ({ url: `/verifications/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (r, e, { id }) => [{ type: 'Verification' as const, id }],
    }),
    deleteVerification: build.mutation<void, string>({ query: (id) => ({ url: `/verifications/${id}`, method: 'DELETE' }), invalidatesTags: ['Verification'] }),
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
