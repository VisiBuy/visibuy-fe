import { baseApi } from '@/services/api/baseApi';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

export const passwordApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    changePassword: build.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: '/users/change-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'], // optional; depends on your tag system
    }),
  }),
  overrideExisting: false,
});

export const { useChangePasswordMutation } = passwordApi;
