import { baseApi } from "@/services/api/baseApi";
import type { PayoutAccountDto } from "@/types/api";

export interface CreatePayoutAccountRequest {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const payoutApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPayoutAccounts: build.query<PayoutAccountDto[], void>({
      query: () => "/payout-accounts",
      providesTags: ["Payout"],
    }),
    createPayoutAccount: build.mutation<
      PayoutAccountDto,
      CreatePayoutAccountRequest
    >({
      query: (body) => ({
        url: "/payout-accounts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payout"],
    }),
  }),
  overrideExisting: false,
});
export const { useGetPayoutAccountsQuery, useCreatePayoutAccountMutation } =
  payoutApi;

// Export NUBAN API
export * from "./nubanApi";
