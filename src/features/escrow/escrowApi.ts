import { baseApi } from '@/services/api/baseApi';
import type { CreateEscrowPaymentRequest, EscrowPaymentDto } from '@/types/api';

export const escrowApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createEscrowPayment: build.mutation<EscrowPaymentDto, { id: string; data: CreateEscrowPaymentRequest }>({
      query: ({ id, data }) => ({ url: `/verifications/${id}/escrow`, method: 'POST', body: data }),
      invalidatesTags: ['Escrow'],
    }),
    getEscrowPayments: build.query<EscrowPaymentDto[], void>({ query: () => '/escrow', providesTags: ['Escrow'] }),
  }),
  overrideExisting: false,
});
export const { useCreateEscrowPaymentMutation, useGetEscrowPaymentsQuery } = escrowApi;
