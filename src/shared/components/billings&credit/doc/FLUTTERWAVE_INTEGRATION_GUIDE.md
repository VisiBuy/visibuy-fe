# Flutterwave Payment Integration Guide

## Overview

This guide documents the Flutterwave payment integration for credit purchases in the Visibuy billing system.

## Architecture

### Components

#### 1. **CreditPackages.tsx** (Main Component)

- **Location**: `src/shared/components/billings&credit/CreditPackages.tsx`
- **Responsibilities**:
  - Display credit package options (10, 25, 50 credits)
  - Handle package selection
  - Initiate payment flow
  - Display payment status notifications
  - Manage payment retry logic

**Key Features**:

- State management for payment flow
- Automatic retry on failure (up to 3 attempts)
- Real-time status notifications
- Clean error handling

#### 2. **FlutterWaveModal.tsx** (Payment UI)

- **Location**: `src/shared/components/billings&credit/FlutterWaveModal.tsx`
- **Responsibilities**:
  - Display Flutterwave payment page in iframe
  - Listen for payment completion events
  - Handle payment success/failure
  - Provide loading and error states

**Key Features**:

- Secure iframe sandbox
- Event listener for postMessage from Flutterwave
- Error recovery UI
- Loading states with visual feedback

#### 3. **PaymentNotification.tsx** (Status Component)

- **Location**: `src/shared/components/billings&credit/PaymentNotification.tsx`
- **Responsibilities**:
  - Display payment status messages
  - Show retry and dismiss actions
  - Auto-hide on success
  - Visual feedback for different states

**Key Features**:

- Status-based styling (loading, success, error, retry)
- Auto-dismiss after 5 seconds on success
- Retry button for failed payments
- Amount display

#### 4. **creditApi.ts** (API Integration)

- **Location**: `src/features/credits/creditApi.ts`
- **Endpoint**: `POST /verification-credits/topup`
- **Request Body**:
  ```typescript
  {
    packageId: string; // UUID
  }
  ```
- **Response**:
  ```typescript
  {
    success: true;
    data: {
      paymentUrl: string; // Flutterwave payment URL
      reference: string; // Payment reference ID
    }
  }
  ```

## Payment Flow

```
User selects package
    ↓
User clicks "Purchase Credits"
    ↓
CreditPackages initiates payment
    ↓
API call to /verification-credits/topup
    ↓
Backend generates Flutterwave payment URL
    ↓
Frontend receives paymentUrl & reference
    ↓
FlutterWaveModal opens with iframe
    ↓
User completes payment on Flutterwave
    ↓
Flutterwave sends postMessage to iframe
    ↓
Frontend detects payment status
    ↓
Success: Credits added to account
    ↓
RTK Query invalidates cache → Balance updates
```

## State Management

### CreditPackages Component States

| State               | Type          | Purpose                                |
| ------------------- | ------------- | -------------------------------------- |
| `selectedPackageId` | string        | Currently selected credit package      |
| `isModalOpen`       | boolean       | Whether Flutterwave modal is displayed |
| `paymentUrl`        | string        | Flutterwave payment page URL           |
| `paymentReference`  | string        | Unique payment reference from backend  |
| `paymentStatus`     | PaymentStatus | Current payment operation status       |
| `paymentMessage`    | string        | User-facing status message             |
| `paymentAttempts`   | number        | Number of payment attempts (max 3)     |

### Payment Status Types

```typescript
type PaymentStatus = "idle" | "loading" | "success" | "error" | "retry";
```

| Status    | Meaning                                  |
| --------- | ---------------------------------------- |
| `idle`    | No active operation                      |
| `loading` | Initiating payment (calling API)         |
| `success` | Payment completed successfully           |
| `error`   | Payment failed permanently (3+ attempts) |
| `retry`   | Payment failed, can retry (< 3 attempts) |

## Error Handling

### Automatic Retry Logic

- **1st-2nd attempt**: Display "Payment failed" with retry button
- **3rd+ attempt**: Display error message, disable retry button
- Users can also dismiss and try again later

### Error Sources

1. **Network Errors**: API unreachable
2. **Backend Errors**: Invalid package, server issues
3. **Payment Errors**: User cancelled, card declined
4. **Modal Errors**: iframe loading failed

### Error Recovery

- Graceful fallback UI
- Clear error messages
- Retry capability with state reset
- Manual dismiss option

## Webhook / Payment Verification

### Current Implementation: Event-based (Recommended)

The Flutterwave modal listens for `postMessage` events from Flutterwave:

```typescript
window.addEventListener("message", (event) => {
  if (
    event.data.status === "successful" &&
    event.data.reference === reference
  ) {
    // Payment successful
  } else if (event.data.status === "failed" || "cancelled") {
    // Payment failed
  }
});
```

### Backend Webhook (Optional Enhancement)

For additional security, the backend can listen to Flutterwave webhooks to verify payments server-side:

1. Backend receives Flutterwave webhook
2. Verifies payment status
3. Updates database
4. Invalidates frontend cache via event/socket

### Cache Invalidation

When payment succeeds:

```typescript
// RTK Query automatically invalidates 'Credit' and 'Payment' tags
// This triggers useGetCreditBalanceQuery to refetch
```

## Configuration

### Environment Variables

```
VITE_API_BASE_URL=https://your-api.com/api/v1
```

### Flutterwave Settings (Backend)

- Public Key: Required for payment URL generation
- Secret Key: Required for webhook verification
- Currency: NGN (Nigerian Naira)

## Testing

### Test Payment Flow

1. Navigate to `/billings`
2. Select a credit package
3. Click "Purchase Credits"
4. Check payment notification
5. Modal should open with Flutterwave page
6. Complete test payment on Flutterwave sandbox
7. Verify success notification and credit balance update

### Test Cases

- [ ] Select different packages
- [ ] Initiate payment and verify modal opens
- [ ] Cancel payment midway
- [ ] Complete payment successfully
- [ ] Verify credit balance updates
- [ ] Test retry after failed attempt
- [ ] Test network error handling
- [ ] Verify notifications display correctly

## Security Considerations

### Frontend

- ✅ Iframe sandbox restrictions (`allow-same-origin allow-scripts allow-forms`)
- ✅ Origin verification for postMessage events
- ✅ Reference validation before processing payment completion
- ✅ No sensitive data in localStorage (handled by Redux auth)

### Backend

- Token-based authentication (Bearer token)
- Webhook signature verification (implement)
- Server-side payment verification (implement)
- Rate limiting on topup endpoint

### Best Practices

1. **Always verify payment on backend before crediting user**
2. **Use payment reference for idempotency**
3. **Store complete payment history**
4. **Implement webhook security**
5. **Add transaction logging for audits**

## Future Enhancements

### Phase 2

- [ ] Backend webhook verification
- [ ] Payment history view
- [ ] Receipt generation
- [ ] Multiple payment methods (beyond Flutterwave)
- [ ] Bulk purchase discounts
- [ ] Credit expiry management

### Phase 3

- [ ] Payment analytics dashboard
- [ ] Subscription/auto-topup
- [ ] Credit marketplace
- [ ] Mobile app integration

## Troubleshooting

### Modal doesn't open

- Check browser console for errors
- Verify `paymentUrl` is valid
- Check iframe sandbox permissions
- Verify Flutterwave API key is correct

### Payment doesn't complete

- Check network tab for API call success
- Verify backend endpoint `/verification-credits/topup`
- Check Flutterwave sandbox credentials
- Look for postMessage in browser console

### Balance doesn't update

- Check RTK Query cache invalidation
- Verify `useGetCreditBalanceQuery` is called
- Check backend response format
- Look for Redux state updates

### Credits not added to account

- Verify backend payment verification logic
- Check database transaction logs
- Verify payment reference matches
- Check permission/authorization

## Support

For issues or questions:

1. Check browser console for errors
2. Review this guide's troubleshooting section
3. Check backend logs
4. Contact Flutterwave support for payment gateway issues
