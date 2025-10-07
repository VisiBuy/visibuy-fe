import { baseApi } from '@/services/api/baseApi';
import type { RoleDto, PermissionDto } from '@/types/api';

export const roleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRoles: build.query<RoleDto[], void>({ query: () => '/roles', providesTags: ['Role'] }),
    getPermissions: build.query<PermissionDto[], void>({ query: () => '/permissions', providesTags: ['Permission'] }),
    assignRole: build.mutation<void, { id: string; roleName: string }>({
      query: ({ id, roleName }) => ({ url: `/users/${id}/roles`, method: 'POST', body: { roleName } }),
      invalidatesTags: ['Role','User'],
    }),
  }),
  overrideExisting: false,
});
export const { useGetRolesQuery, useGetPermissionsQuery, useAssignRoleMutation } = roleApi;
