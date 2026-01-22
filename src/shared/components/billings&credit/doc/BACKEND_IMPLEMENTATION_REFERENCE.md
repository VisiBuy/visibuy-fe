# Backend Implementation Reference

This document provides code examples and specifications for implementing the backend payment endpoint.

## API Endpoint Specification

### POST /verification-credits/topup

**Purpose**: Initiate a credit topup payment via Flutterwave

**Authentication**: Required (Bearer token)

**Request Body**

```json
{
  "packageId": "pkg_10_credits"
}
```

**Response Success (200)**

```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://checkout.flutterwave.com/pay/...",
    "reference": "FLW_REF_12345678"
  },
  "message": "Payment initiated successfully"
}
```

**Response Error (400/401/500)**

```json
{
  "success": false,
  "message": "Package not found"
}
```

---

## Credit Packages Reference

These are the packages the frontend expects:

```typescript
const CREDIT_PACKAGES = [
  {
    id: "pkg_10_credits",
    credits: 10,
    price: 5000, // Amount in Naira
  },
  {
    id: "pkg_25_credits",
    credits: 25,
    price: 12500,
  },
  {
    id: "pkg_50_credits",
    credits: 50,
    price: 25000,
  },
];
```

**Backend should**:

- Validate `packageId` is one of above
- Map packageId → credits amount
- Use price for Flutterwave payment amount

---

## Implementation Steps

### 1. Define Package Model

```python
# Example: Django
CREDIT_PACKAGES = {
    'pkg_10_credits': {'credits': 10, 'amount': 5000},
    'pkg_25_credits': {'credits': 25, 'amount': 12500},
    'pkg_50_credits': {'credits': 50, 'amount': 25000},
}
```

### 2. Create Payment Endpoint

```python
# Example: Django REST Framework

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import requests

CREDIT_PACKAGES = {
    'pkg_10_credits': {'credits': 10, 'amount': 5000},
    'pkg_25_credits': {'credits': 25, 'amount': 12500},
    'pkg_50_credits': {'credits': 50, 'amount': 25000},
}

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def topup_verification_credits(request):
    try:
        package_id = request.data.get('packageId')

        # Validate package
        if package_id not in CREDIT_PACKAGES:
            return Response(
                {'success': False, 'message': 'Invalid package'},
                status=400
            )

        package = CREDIT_PACKAGES[package_id]
        user = request.user

        # Generate Flutterwave payment URL
        flutterwave_response = requests.post(
            'https://api.flutterwave.com/v3/payments',
            headers={
                'Authorization': f'Bearer {FLUTTERWAVE_SECRET_KEY}',
                'Content-Type': 'application/json',
            },
            json={
                'tx_ref': f'VISIBUY_{user.id}_{int(time.time())}',  # Unique reference
                'amount': package['amount'],
                'currency': 'NGN',
                'redirect_url': 'https://yourapp.com/payment/callback',
                'customer': {
                    'email': user.email,
                    'name': user.full_name,
                    'phonenumber': user.phone,
                },
                'customizations': {
                    'title': 'Visibuy Credits',
                    'description': f"Purchase {package['credits']} credits",
                    'logo': 'https://yourapp.com/logo.png',
                },
                'meta': {
                    'package_id': package_id,
                    'user_id': user.id,
                    'credits': package['credits'],
                }
            }
        )

        if flutterwave_response.status_code != 200:
            return Response(
                {'success': False, 'message': 'Failed to initiate payment'},
                status=500
            )

        data = flutterwave_response.json()

        # Store payment record (for tracking)
        Payment.objects.create(
            user=user,
            package_id=package_id,
            amount=package['amount'],
            reference=data['data']['link'],  # or tx_ref
            status='PENDING',
            provider='flutterwave',
        )

        return Response({
            'success': True,
            'data': {
                'paymentUrl': data['data']['link'],
                'reference': data['data']['tx_ref'],
            }
        })

    except Exception as e:
        logger.error(f'Payment initiation error: {str(e)}')
        return Response(
            {'success': False, 'message': 'Server error'},
            status=500
        )
```

### 3. Create Webhook Handler

```python
# Listen for payment completion from Flutterwave

@api_view(['POST'])
def flutterwave_webhook(request):
    """
    Webhook called by Flutterwave when payment completes
    """
    try:
        payload = request.data

        # Verify webhook signature
        hash = request.headers.get('verificationhash')
        flutterwave_hash = os.environ.get('FLUTTERWAVE_HASH')

        if hash != flutterwave_hash:
            return Response(status=401)

        reference = payload.get('txRef')
        status = payload.get('status')

        # Update payment record
        payment = Payment.objects.get(reference=reference)

        if status == 'successful':
            payment.status = 'COMPLETED'
            payment.save()

            # Credit user's account
            user = payment.user
            package = CREDIT_PACKAGES[payment.package_id]

            user.verification_credits += package['credits']
            user.save()

            logger.info(f'Credits added to user {user.id}')

        elif status == 'failed':
            payment.status = 'FAILED'
            payment.save()

        return Response({'status': 'success'})

    except Exception as e:
        logger.error(f'Webhook error: {str(e)}')
        return Response(status=500)
```

### 4. URL Configuration

```python
# urls.py

urlpatterns = [
    path('api/v1/verification-credits/topup/', topup_verification_credits),
    path('api/v1/webhooks/flutterwave/', flutterwave_webhook),
]
```

---

## Flutterwave API Keys

Get from: https://dashboard.flutterwave.com/settings/security

```env
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST_xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_xxxxx
FLUTTERWAVE_HASH=flutterwave   # Webhook hash
```

---

## Payment Flow Diagram

```
User Frontend
    │
    ├─ Selects Package
    │
    ├─ POST /verification-credits/topup
    │     └─ Body: { packageId: "pkg_10_credits" }
    │
    └─ Backend
         │
         ├─ Validate package
         │
         ├─ Call Flutterwave API
         │     └─ Create payment session
         │
         ├─ Store payment record (PENDING)
         │
         └─ Return { paymentUrl, reference }
              │
              └─ Frontend receives URL
                   │
                   ├─ Open Modal with iframe
                   │
                   ├─ User completes payment on Flutterwave
                   │
                   ├─ Flutterwave sends Webhook
                   │     │
                   │     └─ Backend receives webhook
                   │          │
                   │          ├─ Verify signature
                   │          │
                   │          ├─ Update payment (COMPLETED/FAILED)
                   │          │
                   │          └─ If successful: Add credits to user
                   │
                   └─ Frontend detects success via postMessage
                        │
                        └─ Show success notification
                             │
                             └─ Refresh credit balance
```

---

## Error Handling

**Invalid Package**

- Status: 400
- Message: "Invalid package"

**User Not Authenticated**

- Status: 401
- Message: "Unauthorized"

**Flutterwave API Error**

- Status: 500
- Message: "Failed to initiate payment"

**Server Error**

- Status: 500
- Message: "Server error"

---

## Testing with Sandbox

### 1. Flutterwave Sandbox Cards

**Success**:

```
4242 4242 4242 4242
Expiry: Any future date
CVV: Any 3 digits
```

**Decline**:

```
4111 1111 1111 1111
```

### 2. Test Endpoint

```bash
curl -X POST http://localhost:8000/api/v1/verification-credits/topup/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"packageId": "pkg_10_credits"}'
```

### 3. Expected Response

```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://checkout.flutterwave.com/pay/...",
    "reference": "FLW_REF_12345678"
  }
}
```

---

## Database Schema

### Payment Table

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    package_id VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    reference VARCHAR(255) UNIQUE,
    status VARCHAR(20),  -- PENDING, COMPLETED, FAILED
    provider VARCHAR(50),  -- flutterwave
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_reference ON payments(reference);
```

### User Credits Update

```sql
-- When payment completes:
UPDATE users
SET verification_credits = verification_credits + [CREDITS_AMOUNT]
WHERE id = [USER_ID];
```

---

## Important Notes

1. **Idempotency**: Same payment reference should not credit twice
2. **Verification**: Always verify with Flutterwave, not just frontend postMessage
3. **Storage**: Keep all payment records for audit trail
4. **Webhook**: Implement webhook signature verification
5. **Rate Limiting**: Protect endpoint from abuse
6. **Logging**: Log all payment attempts and results

---

## Support

- Flutterwave Docs: https://developer.flutterwave.com/
- Sandbox: https://app.flutterwave.com/dashboard/transactions
- Test Cards: https://developer.flutterwave.com/docs/test-cards/
