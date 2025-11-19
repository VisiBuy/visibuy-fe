import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import {
  useCreateApiKeyMutation,
  useGetApiKeysQuery,
  useDeleteApiKeyMutation,
  useRevokeApiKeyMutation,
} from '@/features/auth/apiKeyApi';
import { ApiKey } from '@/types/apiKey';

interface ModalsState {
  create: boolean;
  viewAll: boolean;
  success: boolean;
}

interface NewApiKeyData {
  name: string;
  permissions: string[];
  expiresAt: string;
}

export const useApiKeys = () => {
  const [modals, setModals] = useState<ModalsState>({
    create: false,
    viewAll: false,
    success: false
  });
  const [newlyCreatedKey, setNewlyCreatedKey] = useState('');
  const [newApiKeyData, setNewApiKeyData] = useState<NewApiKeyData>({
    name: '',
    permissions: ['verifications:read', 'verifications:write', 'users:read'],
    expiresAt: '',
  });

  const { data: apiKeysResponse, isLoading, refetch } = useGetApiKeysQuery();
  const [createApiKey, { isLoading: isCreating }] = useCreateApiKeyMutation();
  const [deleteApiKey] = useDeleteApiKeyMutation();
  const [revokeApiKey] = useRevokeApiKeyMutation();

  const apiKeys: ApiKey[] = useMemo(() => {
    if (!apiKeysResponse) return [];
    if (Array.isArray(apiKeysResponse)) return apiKeysResponse;
    if (apiKeysResponse && 'apiKeys' in apiKeysResponse) {
      return (apiKeysResponse as any).apiKeys || [];
    }
    return [];
  }, [apiKeysResponse]);

  const sortedApiKeys = useMemo(() => 
    [...apiKeys].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ), [apiKeys]
  );

  const latestApiKey = sortedApiKeys[0];

  useEffect(() => {
    refetch();
  }, [refetch]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('API key copied to clipboard');
    } catch (e) {
      message.error('Unable to copy to clipboard');
    }
  };

  const createApiKeyHandler = async () => {
    if (!newApiKeyData.name.trim()) {
      message.error('Please enter a name for the API key');
      return;
    }

    try {
      const result = await createApiKey({
        name: newApiKeyData.name,
        permissions: newApiKeyData.permissions,
        expiresAt: newApiKeyData.expiresAt || dayjs().add(1, 'year').toISOString(),
      }).unwrap();

      if (result.key) {
        setNewlyCreatedKey(result.key);
        setModals({ create: false, viewAll: false, success: true });
        refetch();
        setNewApiKeyData({
          name: '',
          permissions: ['verifications:read', 'verifications:write', 'users:read'],
          expiresAt: '',
        });
        message.success('API key created successfully!');
      }
    } catch (error) {
      message.error('Failed to create API key');
    }
  };

  const revokeKey = async (apiKeyId: string) => {
    try {
      await revokeApiKey(apiKeyId).unwrap();
      message.success('API key revoked successfully');
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || 'Failed to revoke API key');
    }
  };

  const deleteKey = async (apiKeyId: string) => {
    try {
      await deleteApiKey(apiKeyId).unwrap();
      message.success('API key deleted successfully');
      refetch();
    } catch (error: any) {
      message.error(error?.data?.message || 'Failed to delete API key');
    }
  };

  const closeSuccessModal = () => {
    setModals({ create: false, viewAll: false, success: false });
    setNewlyCreatedKey('');
  };

  return {
    apiKeys,
    isLoading: isLoading || isCreating,
    modals,
    newlyCreatedKey,
    newApiKeyData,
    sortedApiKeys,
    latestApiKey,
    handlers: {
      setModals: (updates: Partial<ModalsState>) => setModals(prev => ({ ...prev, ...updates })),
      setNewApiKeyData,
      copyToClipboard,
      createApiKey: createApiKeyHandler,
      revokeKey,
      deleteKey,
      closeSuccessModal,
      refetch
    }
  };
};