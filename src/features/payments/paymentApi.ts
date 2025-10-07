import { baseApi } from '@/services/api/baseApi';
import type { PaymentDto } from '@/types/api';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPayments: build.query<PaymentDto[], void>({ query: () => '/payments', providesTags: ['Payment'] }),
  }),
  overrideExisting: false,
});
export const { useGetPaymentsQuery } = paymentApi;
