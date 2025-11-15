# 🔐 Seller Authentication Setup Guide

## Overview

This document provides setup and configuration instructions for the migrated seller-only authentication system in the VisiBuy frontend application.

## 📋 What's Included

### ✅ Migrated Components

- **LoginForm**: Seller login with validation
- **SignUpForm**: Seller registration
- **PasswordForgotForm**: Password recovery
- **PasswordResetForm**: Password reset functionality
- **AuthScreen**: Responsive layout wrapper
- **Page Components**: Route-ready pages

### ✅ Features

- **Seller-Only Authentication**: No buyer references
- **TypeScript Support**: Full type safety
- **Form Validation**: Zod schema validation
- **Responsive Design**: Mobile and desktop layouts
- **Toast Notifications**: User feedback system
- **RTK Query Integration**: API state management

## 🚀 Quick Setup

### 1. Installation

```bash
# Dependencies are already installed
npm install
```

### 2. Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_APP_ENV=development
```

### 3. Start Development Server

```bash
npm run dev
```

## 📁 File Structure

```
src/
├── types/
│   └── auth.ts                    # Seller authentication types & schemas
├── hooks/
│   └── use-toast.ts              # Toast notification hook
├── components/
│   ├── AuthScreen.tsx            # Layout wrapper component
│   ├── LoginForm.tsx             # Login form component
│   ├── SignUpForm.tsx            # Registration form component
│   ├── PasswordForgotForm.tsx    # Password recovery form
│   └── PasswordResetForm.tsx     # Password reset form
├── pages/
│   ├── LoginPage.tsx             # Login page
│   ├── SignUpPage.tsx            # Registration page
│   ├── PasswordForgotPage.tsx    # Password recovery page
│   └── PasswordResetPage.tsx     # Password reset page
└── app/
    └── router.tsx                # Updated routing configuration
```

## 🔧 Configuration

### API Integration

The forms are configured to work with these endpoints:

```typescript
// Login
POST /auth/login
Body: { email: string, password: string }

// Register
POST /auth/register
Body: {
  fullName: string,
  email: string,
  password: string,
  phone: string,
  address: string
}

// Forgot Password
POST /auth/forgot-password
Body: { email: string }

// Reset Password
POST /auth/reset-password
Body: {
  password: string,
  confirmPassword: string,
  resetToken: string
}
```

### Form Validation Rules

#### Login Form

- **Email**: Required, valid email format
- **Password**: Required, minimum 1 character
- **Remember Me**: Optional boolean

#### Registration Form

- **Full Name**: Required, 2-100 characters
- **Email**: Required, valid email format
- **Phone**: Required, 10-15 characters
- **Address**: Required, 10-200 characters
- **Password**: Required, minimum 8 characters
- **Confirm Password**: Must match password
- **Terms Acceptance**: Required to be true

#### Password Reset

- **Password**: Required, minimum 8 characters
- **Confirm Password**: Must match password
- **Reset Token**: Required from URL params

## 🎨 Styling & Theming

### Tailwind CSS Classes

The components use these design patterns:

```css
/* Primary Colors */
bg-blue-600      /* Primary buttons/backgrounds */
text-blue-600    /* Links and accents */
border-gray-200  /* Form borders */

/* Typography */
text-4xl font-bold    /* Headings */
text-lg font-semibold /* Labels */
text-base             /* Body text */

/* Layout */
max-w-xl mx-auto      /* Centered content */
space-y-6            /* Vertical spacing */
rounded-xl           /* Border radius */
```

### Responsive Breakpoints

- **Mobile**: `< 768px` - Stacked layout, full-width forms
- **Desktop**: `≥ 768px` - Side-by-side layout with branding

## 🔒 Security Features

### Input Validation

- Email format validation
- Password strength requirements
- XSS protection via React
- Input sanitization

### Authentication Flow

1. Form validation on client-side
2. API call to authentication endpoint
3. Token storage in Redux state
4. Redirect to protected routes
5. Token included in subsequent API calls

## 🧪 Testing

### Manual Testing

See `SELLER_AUTH_TESTING_GUIDE.md` for comprehensive testing instructions.

### Automated Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests with coverage
npm run test:coverage
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Import Errors

**Problem**: `Module not found` errors
**Solution**: Check file paths and exports in `tsconfig.json`

#### 2. TypeScript Errors

**Problem**: Type errors in components
**Solution**: Verify imports in `src/types/auth.ts`

#### 3. Styling Issues

**Problem**: Components not styled correctly
**Solution**: Ensure Tailwind CSS is configured properly

#### 4. API Connection Issues

**Problem**: Forms not submitting
**Solution**: Check API endpoints and network connectivity

### Debug Mode

Enable debug logging:

```typescript
// In components, add console logs
console.log("Form data:", values);
console.log("API response:", response);
```

## 📚 Usage Examples

### Basic Login Implementation

```tsx
import { LoginForm } from "./components/LoginForm";

function App() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
```

### Custom AuthScreen Usage

```tsx
import { AuthScreen } from "./components/AuthScreen";

function CustomAuthPage() {
  return (
    <AuthScreen title='Custom Auth'>
      <YourCustomForm />
    </AuthScreen>
  );
}
```

## 🔄 Migration Notes

### What Changed

- ✅ Removed buyer role selection
- ✅ Updated to seller-only context
- ✅ Migrated to new UI component library
- ✅ Updated to RTK Query API structure
- ✅ Added TypeScript support
- ✅ Improved responsive design

### Backward Compatibility

- ❌ Not compatible with buyer authentication
- ❌ Role selection removed
- ✅ Same API endpoint structure
- ✅ Similar user experience

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_APP_ENV=production
```

## 📞 Support

### Documentation

- [Testing Guide](./SELLER_AUTH_TESTING_GUIDE.md)
- [Component Documentation](./docs/components.md)

### Development

- Check console for error messages
- Verify API endpoints are accessible
- Test on multiple devices/browsers

---

**Setup Status**: ✅ Complete
**Last Updated**: 15th October, 2025
**Version**: 1.0.0
