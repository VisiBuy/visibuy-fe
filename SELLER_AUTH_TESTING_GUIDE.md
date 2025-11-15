# 🧪 Seller Authentication Testing Guide

## Overview

This guide provides comprehensive testing instructions for the migrated seller-only authentication system.

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Access Authentication Pages

- **Login**: http://localhost:5173/login
- **Sign Up**: http://localhost:5173/signup
- **Password Recovery**: http://localhost:5173/password-recovery
- **Password Reset**: http://localhost:5173/password-reset

## 🧪 Testing Scenarios

### Test Case 1: Login Functionality

**Objective**: Verify seller login works correctly

**Steps**:

1. Navigate to `/login`
2. Enter valid seller credentials:
   - Email: `seller@example.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Results**:

- ✅ Form validates input fields
- ✅ Loading spinner appears during submission
- ✅ Success toast notification appears
- ✅ Redirects to `/dashboard` on success
- ✅ Authentication state updates in Redux

**Error Scenarios**:

- ❌ Invalid email format → Validation error
- ❌ Empty fields → Required field errors
- ❌ Wrong credentials → Error toast notification

### Test Case 2: Registration Functionality

**Objective**: Verify new seller registration

**Steps**:

1. Navigate to `/signup`
2. Fill registration form:
   - Full Name: `John Seller`
   - Email: `new-seller@example.com`
   - Phone: `+2348012345678`
   - Address: `123 Business Street, Lagos`
   - Password: `secure-password-123`
   - Confirm Password: `secure-password-123`
   - ✅ Accept Terms & Conditions
3. Click "Create Seller Account"

**Expected Results**:

- ✅ All fields validate properly
- ✅ Password confirmation matches
- ✅ Terms acceptance required
- ✅ Success toast appears
- ✅ Redirects to `/login` page

### Test Case 3: Password Recovery Flow

**Objective**: Test forgot password functionality

**Steps**:

1. Navigate to `/password-recovery`
2. Enter registered email: `seller@example.com`
3. Click "Send Reset Link"

**Expected Results**:

- ✅ Email validation works
- ✅ Success message appears
- ✅ Redirects back to login page
- ✅ Reset email sent (check console logs)

### Test Case 4: Password Reset Flow

**Objective**: Test password reset with token

**Steps**:

1. Navigate to `/password-reset?token=reset-token-123`
2. Enter new password:
   - Password: `new-password-123`
   - Confirm Password: `new-password-123`
3. Click "Update Password"

**Expected Results**:

- ✅ Password validation (minimum 8 characters)
- ✅ Password confirmation matches
- ✅ Success toast appears
- ✅ Redirects to login page

### Test Case 5: Dashboard Redirection

**Objective**: Verify post-login navigation

**Steps**:

1. Login successfully
2. Verify URL changes to `/dashboard`
3. Check that DashboardPage component loads

**Expected Results**:

- ✅ Automatic redirect to `/dashboard`
- ✅ ProtectedRoute allows access
- ✅ Dashboard content displays

## 🔧 Manual Testing Checklist

### Form Validation

- [ ] Email format validation
- [ ] Password strength requirements
- [ ] Required field indicators (\*)
- [ ] Real-time validation feedback
- [ ] Terms acceptance checkbox

### UI/UX Testing

- [ ] Responsive design (mobile/desktop)
- [ ] Loading states and spinners
- [ ] Toast notifications display correctly
- [ ] Form layout and styling
- [ ] Logo and branding consistency

### Navigation Testing

- [ ] All auth routes accessible
- [ ] Proper redirects after actions
- [ ] Back button functionality
- [ ] Link navigation works

### Error Handling

- [ ] Network error scenarios
- [ ] Invalid input handling
- [ ] API failure states
- [ ] User-friendly error messages

## 🛠️ API Integration Testing

### Backend Endpoints Required

```javascript
// These endpoints should be implemented in your backend
POST / api / v1 / auth / login; // Seller login
POST / api / v1 / auth / register; // Seller registration
POST / api / v1 / auth / forgot - password; // Password recovery
POST / api / v1 / auth / reset - password; // Password reset
```

### Mock API Testing

For testing without backend:

1. Check browser console for API calls
2. Verify request payloads are correct
3. Confirm error handling for failed requests

## 📱 Mobile Testing

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-Specific Tests

- [ ] Touch interactions work
- [ ] Keyboard doesn't overlap forms
- [ ] Text remains readable
- [ ] Buttons are appropriately sized

## 🔍 Debugging Tips

### Common Issues

1. **Import Errors**: Check file paths and exports
2. **TypeScript Errors**: Verify type definitions
3. **Styling Issues**: Check Tailwind classes
4. **API Errors**: Monitor network tab

### Debug Tools

- Browser DevTools Console
- React DevTools
- Redux DevTools
- Network tab for API calls

## ✅ Success Criteria

All test cases should pass:

- ✅ Login functionality works
- ✅ Registration creates new sellers
- ✅ Password recovery sends emails
- ✅ Password reset updates credentials
- ✅ Dashboard redirection functions
- ✅ All forms validate properly
- ✅ Error handling works correctly
- ✅ UI is responsive and accessible

## 🚨 Known Limitations

- Password recovery emails require email service setup
- Registration requires backend API integration
- Some features may need backend implementation

## 📞 Support

For issues or questions:

1. Check this testing guide
2. Review console error messages
3. Verify API endpoints are available
4. Check network connectivity

---

**Testing Status**: ✅ Ready for Development Testing
**Last Updated**: $(date)
**Version**: 1.0.0
