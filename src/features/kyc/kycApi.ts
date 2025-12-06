import { baseApi } from '@/services/api/baseApi';

export interface KycStatusResponse {
  level: 'none' | 'soft' | 'full';
  status: 'pending' | 'approved' | 'rejected';
  softKycComplete: boolean;
  fullKycComplete: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  documents: any[];
}

export interface InitiateSoftKycRequest {
  method: 'email' | 'phone';
}

export interface CompleteSoftKycRequest {
  method: 'email' | 'phone';
  code: string;
}

export interface InitiateSoftKycResponse {
  message?: string;
  success?: boolean;
}

export interface CompleteSoftKycResponse {
  message?: string;
  success?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export const kycApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getKycStatus: build.query<KycStatusResponse, void>({
      query: () => '/kyc/status',
      providesTags: ['Kyc'],
    }),
    initiateSoftKyc: build.mutation<InitiateSoftKycResponse, InitiateSoftKycRequest>({
      query: (body) => ({
        url: '/kyc/soft/initiate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Kyc'],
    }),
    completeSoftKyc: build.mutation<CompleteSoftKycResponse, CompleteSoftKycRequest>({
      query: (body) => ({
        url: '/kyc/soft/complete',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Kyc'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetKycStatusQuery,
  useInitiateSoftKycMutation,
  useCompleteSoftKycMutation,
} = kycApi;

