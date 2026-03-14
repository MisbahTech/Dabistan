# Dabistan Admin Portal

Professional admin/editor portal with JWT auth, role-based access, posts management, and file uploads.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs
- Uploads: Multer

## How to Run Guide

Follow these steps to set up and run the Dabistan Admin Portal locally.

### 1. Prerequisites

- **Node.js**: v18 or higher recommended.
- **MongoDB**: A local instance or a MongoDB Atlas connection string.
- **Package Manager**: `npm` (comes with Node.js).

### 2. Database Setup

You can run MongoDB locally or using Docker.

#### Option A: Using Docker (Recommended)
1.  Navigate to the backend directory: `cd backend`
2.  Ensure your `.env` is configured (see Backend Setup below).
3.  Start the database:
    ```bash
    docker-compose up -d
    ```
    This will start a MongoDB container named `local-mongo` on the port specified by `MONGO_PORT` in your `.env`.

#### Option B: Local Installation
1.  Ensure **MongoDB** is running on your system (default port `27017`).
2.  If using a local instance, the URI in your backend `.env` will likely be `mongodb://localhost:27017/dabistan`.
3.  You don't need to manually create the database; Mongoose will create it on the first connection.

### 3. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Copy the example environment file: `cp .env.example .env`
    - Open `.env` and fill in the required values (especially `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`).
4.  (Optional) Seed Initial Data:
    - The server automatically seeds the admin user on startup if it doesn't exist.
    - To manually create an admin: `npm run create-admin`
5.  Run the Development Server:
    ```bash
    npm run dev
    ```
    The backend will start at `http://localhost:5000` (or the port specified in `.env`).

### 4. Frontend Setup

1.  Navigate to the root directory (where the frontend lives):
    ```bash
    cd ..
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Ensure `.env` exists if you need to point to a custom API URL (default is `http://localhost:5000/api`).
4.  Run the Development Server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:5173`.

### 5. Accessing the Portal

- **URL**: `http://localhost:5173/login`
- **Default Credentials**: Use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` you defined in the backend `.env` file.

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
