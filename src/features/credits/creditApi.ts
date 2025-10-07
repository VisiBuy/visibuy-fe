import { baseApi } from '@/services/api/baseApi';
import type { CreditBalanceDto, TopupVerificationCreditsRequest, ApiResult } from '@/types/api';

export const creditApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCreditBalance: build.query<CreditBalanceDto, void>({ query: () => '/credits/balance', providesTags: ['Credit'] }),
    topupVerificationCredits: build.mutation<ApiResult<{ paymentUrl: string; reference: string }>, TopupVerificationCreditsRequest>({
      query: (body) => ({ url: '/credits/topup', method: 'POST', body }),
      invalidatesTags: ['Credit','Payment'],
    }),
  }),
  overrideExisting: false,
});
export const { useGetCreditBalanceQuery, useTopupVerificationCreditsMutation } = creditApi;
