import { baseApi } from '@/services/api/baseApi';
import type {
  PreferenceDto,
  NotificationPreferencesResponse,
} from '@/types/api';



export const NotificationPreferencesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNotification: build.query<NotificationPreferencesResponse, void>({ query: () => '/notifications/preferences', providesTags: ['Notification'] }),

    createNotification: build.mutation<PreferenceDto, NotificationPreferencesResponse>({
      query: (body) => ({ url: '/notifications/preferences', method: 'POST', body }),
      invalidatesTags: ['Notification'],
    }),

    updateNotification: build.mutation<PreferenceDto, NotificationPreferencesResponse>({
      query: (body) => ({
        url: `/notifications/preferences`,
        method: 'PUT',
        body: { preferences: body.preferences }
      }),
      invalidatesTags: (r, e, body) => [{ type: 'Notification' as const, id: body.userId }],
    }),
  }),

  overrideExisting: false,
});
export const {
  useGetNotificationQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
} = NotificationPreferencesApi;
