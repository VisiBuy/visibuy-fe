# Component Structure & Data Flow

## CreditPackages Component

### Props

None (self-contained)

### State

```typescript
selectedPackageId: string; // Currently selected package ID
isModalOpen: boolean; // Modal visibility
paymentUrl: string; // Flutterwave checkout URL
paymentReference: string; // Unique payment reference
paymentStatus: PaymentStatus; // 'idle' | 'loading' | 'success' | 'error' | 'retry'
paymentMessage: string; // User-facing status message
paymentAttempts: number; // Number of payment attempts (max 3)
```

### Methods

#### handleInitiatePayment()

- Triggered when user clicks "Purchase Credits"
- Calls `topupCredits()` mutation with selected package
- Shows loading state
- On success: Opens modal with payment URL
- On error: Shows error message with retry option

#### handlePaymentComplete(reference: string)

- Called when Flutterwave payment succeeds
- Shows success notification
- Resets attempt counter
- RTK Query automatically refreshes balance

#### handlePaymentFailed(error: string)

- Called when payment fails
- Shows error message
- Allows retry if attempts < 3
- Blocks retry after 3 attempts

#### handleModalClose()

- Closes the payment modal
- Preserves success message temporarily
- Resets state after 1 second if not successful

#### handleRetry()

- Re-initiates payment
- Increments attempt counter
- Resets messages

#### handleDismissNotification()

- Closes notification banner
- Resets status to idle

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CreditPackages Component                  │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
            ┌────────────┬───────────┬────────────┐
            │  Package 1 │ Package 2 │ Package 3  │
            │  (10 cr)   │  (25 cr)  │  (50 cr)   │
            └────────────┴───────────┴────────────┘
                    │  (Select via radio)
                    ▼
            ┌─────────────────────┐
            │ Purchase Button     │
            │ (onClick)           │
            └──────────┬──────────┘
                       │
                       ▼
            ┌──────────────────────────┐
            │ handleInitiatePayment()  │
            │ topupCredits mutation    │
            └──────────┬───────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼ (API Call)                  ▼ (Error)
    ┌─────────────┐            ┌──────────────┐
    │   SUCCESS   │            │ ERROR STATE  │
    │ paymentUrl  │            │ Retry Button │
    │ reference   │            │  (< 3x)      │
    └──────┬──────┘            │              │
           ▼                   │ Auto-disable │
    ┌──────────────┐           │  (>= 3x)     │
    │ Modal Opens  │           └──────────────┘
    │ (iframe)     │
    └──────┬───────┘
           │
      User completes
      payment on Flutterwave
           │
           ▼
    ┌─────────────────────┐
    │ Flutterwave sends   │
    │ postMessage to      │
    │ iframe              │
    └────────┬────────────┘
             │
    ┌────────┴─────────┐
    ▼ (Success)        ▼ (Failed/Cancelled)
┌──────────────┐  ┌────────────────────────┐
│ SUCCESS      │  │ FAILED STATE           │
│ Notification │  │ Error Message + Retry  │
│ Auto-dismiss │  │ (if < 3 attempts)      │
│ (5s)         │  │                        │
│ Cache        │  │ Permanent Error        │
│ Invalidate   │  │ (if >= 3 attempts)     │
│ Balance      │  └────────────────────────┘
│ Refetch      │
└──────────────┘
```

---

## FlutterWaveModal Component

### Props

```typescript
interface FlutterWaveModalProps {
  isOpen: boolean;
  paymentUrl: string;
  reference: string;
  onClose: () => void;
  onPaymentComplete: (reference: string) => void;
  onPaymentFailed: (error: string) => void;
}
```

### State

```typescript
isLoading: boolean; // iframe loading
error: string | null; // error message
```

### Lifecycle

**Mount**:

- Register postMessage event listener
- Filter for Flutterwave origin (security)
- Check payment status and reference

**Event Handling**:

```typescript
// Listen for: window.postMessage({ status, reference }, '*')
status === 'successful' && reference === expectedRef
  → onPaymentComplete()
  → Modal closes

status === 'failed' || status === 'cancelled'
  → onPaymentFailed()
  → Error state shown
```

**Unmount**:

- Remove event listener
- Clean up subscriptions

### JSX Structure

```
Modal Overlay (fixed, dark bg)
├── Modal Card (bg-white, rounded)
│   ├── Header
│   │   ├── "Complete Payment" title
│   │   └── Close button (X)
│   │
│   ├── Content Area
│   │   ├── Loading spinner + message
│   │   │   (while iframe loads)
│   │   │
│   │   ├── Error card
│   │   │   ├── Alert icon
│   │   │   ├── Error message
│   │   │   └── Close button
│   │   │
│   │   └── iframe
│   │       └── Flutterwave payment form
│   │
│   └── Footer
│       └── Security message + Reference
```

---

## PaymentNotification Component

### Props

```typescript
interface PaymentNotificationProps {
  status: PaymentStatus; // idle | loading | success | error | retry
  message: string; // Display message
  amount?: number; // Amount in Naira
  onRetry?: () => void; // Retry handler
  onDismiss: () => void; // Dismiss handler
  autoHideDelay?: number; // ms before auto-hide (default 5000)
}
```

### State

```typescript
isVisible: boolean; // Component visibility
```

### Auto-hide Logic

```
status === 'success'
  ├─ autoHideDelay = 5000ms (default)
  └─ After 5s: onDismiss() → Component hides

status === 'loading' || 'retry' || 'error'
  └─ autoHideDelay = 0 (no auto-hide)
  └─ User must click Dismiss or Retry
```

### Color Schemes by Status

```
idle
  ├─ bg-gray-50
  ├─ border-gray-200
  └─ text-gray-900

loading
  ├─ bg-blue-50
  ├─ border-blue-200
  ├─ icon: Loader (spinning)
  └─ text-blue-900

success
  ├─ bg-green-50
  ├─ border-green-200
  ├─ icon: CheckCircle
  ├─ text-green-900
  └─ Auto-hides after 5s

error
  ├─ bg-red-50
  ├─ border-red-200
  ├─ icon: AlertCircle
  ├─ text-red-900
  └─ Shows Retry button

retry
  ├─ bg-red-50
  ├─ border-red-200
  ├─ icon: AlertCircle
  ├─ text-red-900
  └─ Shows Retry button
```

---

## RTK Query Mutation

### useTopupVerificationCreditsMutation()

**Endpoint**: `POST /verification-credits/topup`

**Request**:

```typescript
TopupVerificationCreditsRequest {
  packageId: UUID;
}
```

**Response**:

```typescript
ApiResult<{
  paymentUrl: string;
  reference: string;
}>;
```

**Cache Invalidation**:

```typescript
invalidatesTags: ["Credit", "Payment"];
```

Effect:

- Automatically refetches `useGetCreditBalanceQuery`
- Balance updates without explicit call

---

## State Management Flow

```
User Action
    │
    ├─ Selects Package
    │   └─ setSelectedPackageId(id)
    │
    ├─ Clicks Purchase
    │   ├─ setPaymentStatus('loading')
    │   ├─ setPaymentMessage('Initiating...')
    │   └─ topupCredits() mutation
    │       │
    │       ├─ API Success
    │       │   ├─ setPaymentUrl()
    │       │   ├─ setPaymentReference()
    │       │   ├─ setIsModalOpen(true)
    │       │   └─ setPaymentStatus('idle')
    │       │
    │       └─ API Error
    │           ├─ setPaymentMessage(error)
    │           ├─ setPaymentAttempts(++1)
    │           └─ setPaymentStatus(
    │               attempts >= 3 ? 'error' : 'retry'
    │           )
    │
    ├─ Modal: Payment Completes
    │   ├─ Success: handlePaymentComplete()
    │   │   ├─ setPaymentStatus('success')
    │   │   ├─ setPaymentMessage('Payment successful!')
    │   │   ├─ setPaymentAttempts(0)
    │   │   └─ setIsModalOpen(false)
    │   │
    │   └─ Failure: handlePaymentFailed()
    │       ├─ setPaymentStatus(
    │       │   attempts >= 3 ? 'error' : 'retry'
    │       │)
    │       └─ setPaymentMessage(error)
    │
    └─ User: Retry or Dismiss
        ├─ Retry: handleRetry()
        │   └─ Back to: Clicks Purchase
        │
        └─ Dismiss: handleDismissNotification()
            └─ Reset all state to idle
```

---

## Error State Tree

```
Payment Initiation
├─ Network Error
│   ├─ Status: 'retry' (< 3)
│   ├─ Message: "Failed to initiate payment..."
│   └─ Action: Retry button
│
├─ Invalid Package
│   ├─ Status: 'error'
│   ├─ Message: "Invalid package"
│   └─ Action: Select different package
│
├─ Unauthorized
│   ├─ Status: 'error'
│   ├─ Message: "Unauthorized"
│   └─ Action: Login again
│
└─ Server Error
    ├─ Status: 'error' (3+ attempts)
    ├─ Message: "Server error"
    └─ Action: Contact support

Payment Modal
├─ iframe Load Error
│   ├─ Show: "Failed to load payment page"
│   └─ Action: Close button
│
└─ Payment Failed
    ├─ User Cancelled
    │   ├─ Status: 'retry' (< 3)
    │   ├─ Message: "You cancelled the payment"
    │   └─ Action: Retry button
    │
    └─ Payment Declined
        ├─ Status: 'retry' (< 3)
        ├─ Message: "Payment failed. Please try again."
        └─ Action: Retry button
            └─ (Max 3 attempts) → Error state
```

---

## Type Definitions

```typescript
// From src/types/api.ts
type PaymentStatus = "idle" | "loading" | "success" | "error" | "retry";

interface TopupVerificationCreditsRequest {
  packageId: UUID;
}

interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  isPopular?: boolean;
}
```

---

**Component Dependencies**:

- lucide-react (icons)
- @reduxjs/toolkit/query (RTK Query for API)
- tailwindcss (styling)
- React hooks (useState, useEffect)

**No external payment libraries needed** - Flutterwave handled via iframe + postMessage
