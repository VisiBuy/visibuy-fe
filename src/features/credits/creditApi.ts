import { baseApi } from "@/services/api/baseApi";
import type {
  CreditBalanceDto,
  CreditPackageDto,
  CreditHistoryDto,
  TopupVerificationCreditsRequest,
  ApiResult,
} from "@/types/api";

const creditApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCreditPackages: build.query<CreditPackageDto[], void>({
      query: () => "/verification-credits/packages",
      transformResponse: (response: ApiResult<CreditPackageDto[]>) => {
        return response.success ? response.data : [];
      },
      providesTags: ["Credit"],
    }),
    getCreditBalance: build.query<CreditBalanceDto, void>({
      query: () => "/credits/balance",
      providesTags: ["Credit"],
    }),
    getCreditHistory: build.query<CreditHistoryDto[], void>({
      query: () => "/verification-credits/history",
      transformResponse: (response: ApiResult<CreditHistoryDto[]>) => {
        return response.success ? response.data : [];
      },
      providesTags: ["Credit"],
    }),
    topupVerificationCredits: build.mutation<
      ApiResult<{ paymentUrl: string; reference: string }>,
      TopupVerificationCreditsRequest
    >({
      query: (body) => ({
        url: "/verification-credits/topup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Credit", "Payment"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCreditPackagesQuery,
  useGetCreditBalanceQuery,
  useGetCreditHistoryQuery,
  useTopupVerificationCreditsMutation,
} = creditApi;
