import { baseApi } from '@/services/api/baseApi';
import type { AuditLogDto } from '@/types/api';

export const auditApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuditLogs: build.query<{ items: AuditLogDto[]; total: number }, { page?: number }>({
      query: (params) => ({ url: '/audit', params }),
      providesTags: ['Audit'],
    }),
  }),
  overrideExisting: false,
});
export const { useGetAuditLogsQuery } = auditApi;
