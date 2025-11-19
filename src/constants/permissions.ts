export const AVAILABLE_PERMISSIONS = [
  'verifications:read',
  'verifications:write',
  'users:read',
  'users:write',
  'transactions:read',
  'transactions:write',
  'analytics:read',
  'settings:read',
  'api-keys:read',
  'api-keys:write',
  'audit:read',
  'billing:read',
];

export const PERMISSION_DESCRIPTIONS: { [key: string]: string } = {
  'verifications:read': 'View verification requests and results',
  'verifications:write': 'Create and update verification requests',
  'users:read': 'View user information and profiles',
  'users:write': 'Create and update user accounts',
  'transactions:read': 'View transaction history and details',
  'transactions:write': 'Create and process transactions',
  'analytics:read': 'Access analytics and reporting data',
  'settings:read': 'View system settings and configuration',
  'api-keys:read': 'View API key information',
  'api-keys:write': 'Create and manage API keys',
  'audit:read': 'Access audit logs and history',
  'billing:read': 'View billing and usage information',
};

export const PERMISSION_PRESETS = {
  basic: ['verifications:read', 'users:read'],
  standard: [
    'verifications:read',
    'verifications:write',
    'users:read',
    'transactions:read',
  ],
  full: [
    'verifications:read',
    'verifications:write',
    'users:read',
    'users:write',
    'transactions:read',
    'transactions:write',
    'analytics:read',
  ],
};