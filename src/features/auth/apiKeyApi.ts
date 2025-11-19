import { baseApi } from "@/services/api/baseApi";

interface ApiKey {
  id: string; 
  name: string;
  key?: string; 
  permissions: string[];
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  revokedAt: string | null;
  lastUsedAt: string | null;
}

interface CreateApiKeyRequest {
  name: string;
  permissions: string[];
  expiresAt: string;
}

interface CreateApiKeyResponse {
  id: string; 
  name: string;
  key: string; 
  permissions: string[];
  expiresAt: string;
  createdAt: string;
}

export const apiKeysApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getApiKeys: build.query<ApiKey[], void>({
      query: () => ({
        url: '/api-keys',
        method: 'GET',
      }),
      providesTags: ['ApiKey'],
    }),

    getApiKeyById: build.query<ApiKey, string>({ 
      query: (id) => ({
        url: `/api-keys/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'ApiKey', id }],
    }),

    createApiKey: build.mutation<CreateApiKeyResponse, CreateApiKeyRequest>({
      query: (apiKeyData) => ({
        url: '/api-keys',
        method: 'POST',
        body: apiKeyData,
      }),
      invalidatesTags: ['ApiKey'],
    }),

    deleteApiKey: build.mutation<void, string>({ 
      query: (id) => ({
        url: `/api-keys/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ApiKey'],
    }),

    revokeApiKey: build.mutation<void, string>({ 
      query: (id) => ({
        url: `/api-keys/${id}/revoke`,
        method: 'POST',
      }),
      invalidatesTags: ['ApiKey'],
    }),
  }),
});

export const {
  useGetApiKeysQuery,
  useGetApiKeyByIdQuery,
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,
  useRevokeApiKeyMutation,
} = apiKeysApi;