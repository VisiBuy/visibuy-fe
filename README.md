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
- `refresh` should read a secure HttpOnly refresh cookie and return `{ accessToken, user, permissions }`.  
- Frontend uses `credentials: 'include'` in the base query to send cookies.

---

## 🧾 Developer Contribution Notice

By contributing to this repository, you acknowledge that:  
- You are part of the Visibuy development team and all work contributed (code, designs, or documentation) becomes the **exclusive intellectual property of Visibuy**.  
- You agree to keep all project code, assets, and documentation **confidential** and not share, reproduce, or distribute them without prior written authorization from Visibuy.  
- You may reference your personal contributions **only for portfolio or learning purposes**, provided no proprietary details or internal code are disclosed.  
- All contributions are subject to internal review and approval before integration into production.

---

💙 *Thank you for helping build trust in online shopping with Visibuy.*
