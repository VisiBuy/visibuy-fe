import { baseApi } from '@/services/api/baseApi';
import type { PayoutAccountDto } from '@/types/api';

export const payoutApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPayoutAccounts: build.query<PayoutAccountDto[], void>({ query: () => '/payout-accounts', providesTags: ['Payout'] }),
  }),
  overrideExisting: false,
});
export const { useGetPayoutAccountsQuery } = payoutApi;
