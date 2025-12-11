export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  permissions: {
    read: boolean;
    admin: boolean;
    write: boolean;
    delete: boolean;
    scopes: string[];
  };
  revoked: boolean;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string | null;
}