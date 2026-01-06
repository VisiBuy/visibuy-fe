/**
 * src/types/api.ts
 * Centralized, modular, and maintainable DTOs for Visibuy frontend.
 * Keep in sync with backend DTOs / Swagger.
 */

/* Core / Shared */
export type UUID = string;
export type ISODateString = string;

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string | Record<string, unknown>;
}

export type ApiResult<T> = ApiSuccess<T> | ApiError;

/* Auth */
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { name: string; email: string; password: string; phone?: string; address?: string; }

export  interface RegisterCredentials {
  name: string;
  email: string;
  phone: string;
  password: string;
}
export interface AuthUser {
  id: UUID;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  trustScore: number;
  badges?: Record<string, boolean> | null;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  mfaEnabled: boolean;
  lastLoginAt?: ISODateString | null;
  createdAt: ISODateString;
}

export interface AuthResponseBody {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  roles: string[];
  permissions: string[];
}

export interface RefreshResponse { accessToken: string; }

/* Users */
export interface UpdateProfileRequest { name?: string; phone?: string; mfaEnabled?: boolean; address?: string; }
export type UpdateProfileResponse = AuthUser;

/* RBAC */
export interface PermissionDto { id: UUID; name: string; resource: string; action: string; }
export interface RoleDto { id: UUID; name: string; description?: string; permissions: PermissionDto[]; }

/* Verifications */
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface MediaItemDto {
  id: UUID;
  url: string;
  type: 'image' | 'video';
  thumbnailUrl?: string;
  uploadedAt?: string;   
  duration?: number;
}

export interface VerificationDto {
  id: UUID;
  publicToken: string;
  productTitle: string;
  description: string;
  price?: number;
  status: VerificationStatus;
  escrowEnabled: boolean;
  media: MediaItemDto[];
  createdAt: ISODateString;
  expiresAt?: ISODateString | null;
}

export interface ProductCardProps {
  verification: VerificationDto;
}

export interface CreateVerificationRequest {
  productTitle: string;
  description: string;
  price?: number;
  escrowEnabled?: boolean;
  expiresAt?: ISODateString;
  // NOTE: files should be sent via multipart/form-data as File[] outside this DTO
}

export interface UpdateVerificationRequest {
  productTitle?: string;
  description?: string;
  price?: number;
  escrowEnabled?: boolean;
  expiresAt?: ISODateString;
}

/* Escrow */
export interface CreateEscrowPaymentRequest {
  buyerEmail: string;
  buyerName: string;
  buyerPhone?: string;
  currency?: string;
}

export interface EscrowPaymentDto {
  id: UUID;
  verificationId: UUID;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paymentUrl: string;
  expiresAt?: ISODateString | null;
  createdAt?: ISODateString;
}

/* Credits */
export interface CreditBalanceDto { verificationCredits: number; premiumCredits: number; escrowCredits: number; }
export interface TopupVerificationCreditsRequest { packageId: UUID; }

/* Payments */
export type PaymentProvider = 'flutterwave';
export interface PaymentDto {
  id: UUID;
  userId: UUID;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  reference: string;
  createdAt: ISODateString;
  paidAt?: ISODateString | null;
}

/* Audit */
export interface AuditLogDto {
  id: UUID;
  action: string;
  entityType: string;
  entityId: UUID;
  actorId?: UUID | null;
  description?: string;
  level?: string;
  createdAt: ISODateString;
  metadata?: Record<string, unknown>;
}

/* Payout */
export interface PayoutAccountDto {
  id: UUID;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: number;
  isDefault: boolean;
  createdAt: ISODateString;
}

/* Generic Validation Error */
export interface ValidationErrorItem { field: string; message: string; }
export interface ValidationErrorResponse {
  statusCode: number;
  message: string | string[] | ValidationErrorItem[];
  error: string;
}
/* Seller Profile*/
export interface sellerProfileDto {
  id ?: UUID,
  name :  string,
  phone : string,
  email ?: string,
  kycStatus ?: string;
  mfaEnabled ?: boolean,
  createdAt ?: string,
  trustScore ?: number,
  badges ?: {
    verifiedSeller : boolean,
    trustedBuyer: boolean,
    premiumMember: boolean,
    earlyAdopter: boolean
  },
  lastLoginAt ?:  string,
  updatedAt ?:  string,
  address ?: string,
  profileImage ?: string,
  totalCompletedVerification ? : number,
  approvalRatePercentage ? : number,
  totalVerifications ? : number

}

//Notification Preferences
export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
  disabled?: boolean;
}

export type EGlobalSettingsMap = Record<string, Record<string, boolean>>;
export interface EmailNotificationProps {
allPreferences: PreferenceDto[];
localSettings: EGlobalSettingsMap; 
setChannelSetting: (eventType: string, channelName: string, enabled: boolean) => void;
}

export type SGlobalSettingsMap = Record<string, Record<string, boolean>>;

export interface SMSNotificationProps {
  allPreferences: PreferenceDto[];
  localSettings: SGlobalSettingsMap; 
  setChannelSetting: (eventType: string, channelName: string, enabled: boolean) => void; 
}

export type WGlobalSettingsMap = Record<string, Record<string, boolean>>;

export interface WhatsappNotificationProps {
    allPreferences: PreferenceDto[];
    localSettings: WGlobalSettingsMap; 
    setChannelSetting: (eventType: string, channelName: string, enabled: boolean) => void; 
}


export interface ChannelDto {
  channel: string;
  isEnabled: boolean;
  metadata?: null; 
  isAvailable?: boolean;
}

export interface PreferenceDto {
  eventType: string;
  channels: ChannelDto[];
}

export interface NotificationPreferencesResponse {
  preferences: PreferenceDto[];
  userId: string
}


