# Visibuy Starter

This starter contains a minimal Vite + React + TypeScript scaffold optimized for a Visibuy-style app:
- RTK Query baseApi with automatic refresh flow
- authApi + authSlice for JWT access + HttpOnly refresh cookie pattern
- ProtectedRoute + withAuth HOC for permission-based guarding
- Tailwind CSS base setup

## How to use

1. unzip or open the folder
2. run `npm install` (or `pnpm`/`yarn`)
3. create `.env` with `VITE_API_BASE_URL` pointing to your backend
4. run `npm run dev`

## Notes

- Backend must implement `/auth/login`, `/auth/refresh`, `/auth/logout` endpoints.
- `refresh` should read a secure HttpOnly refresh cookie and return `{ accessToken, user, permissions }`
- Frontend uses `credentials: 'include'` in the base query to send cookies.

