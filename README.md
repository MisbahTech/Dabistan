# Dabistan Admin Portal

Professional admin/editor portal with JWT auth, role-based access, posts management, and file uploads.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs
- Uploads: Multer

## Quick Start

### Backend

1. Create `backend/.env` from `backend/.env.example`.
2. Start MongoDB locally.
3. Install dependencies:
   - `cd backend`
   - `npm install`
4. Run the server:
   - `npm run dev`

The server seeds a default admin user if `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set.

### Frontend

1. Create `.env` from `.env.example` if needed.
2. Install dependencies:
   - `npm install`
3. Run the app:
   - `npm run dev`

## Key Routes

Backend:
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/posts`
- `GET/POST/PUT/DELETE /api/users` (admin only)
- `POST /api/uploads`

Frontend:
- `/login`
- `/dashboard`
- `/posts`
- `/categories`
- `/videos`
- `/most-read`
- `/weather`
- `/exchange-rates`
- `/users` (admin only)

## Environment Variables

Frontend `.env`:
- `VITE_API_BASE_URL`

Backend `backend/.env`:
- `PORT`
- `CORS_ORIGIN`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## Notes

- Editors can manage posts only.
- Admins can manage posts and editor users.
- Uploaded files are served from `/uploads`.
