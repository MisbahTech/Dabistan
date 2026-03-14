# Dabistan Backend

Node/Express API backed by MongoDB with JWT auth, uploads, search, and pagination.

## Quick Start

1. Copy environment template:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm install`
3. Ensure MongoDB is running and `MONGODB_URI` points to your database.
4. Create an admin user:
   - `npm run create-admin`
5. (Optional) Load seed content into the database (destructive):
   - `npm run seed`
6. Run in dev mode:
   - `npm run dev`

## Auth

- `POST /api/auth/login` → `{ token, user }`
- `GET /api/auth/me` → `{ user }`

Send `Authorization: Bearer <token>` for admin routes.

## Public Read APIs (used by the UI)

- `GET /api/health`
- `GET /api/content/all`
- `GET /api/content/sections`
- `GET /api/content/sections/:slug`
- `GET /api/content/books`
- `GET /api/content/books/:slug`
- `GET /api/content/nav`
- `GET /api/content/contacts`

## Admin APIs (JWT protected)

- `GET /api/admin/sections`
- `POST /api/admin/sections`
- `GET /api/admin/sections/:id`
- `PUT /api/admin/sections/:id`
- `DELETE /api/admin/sections/:id`

- `GET /api/admin/books`
- `POST /api/admin/books`
- `GET /api/admin/books/:id`
- `PUT /api/admin/books/:id`
- `DELETE /api/admin/books/:id`

- `GET /api/admin/articles`
- `POST /api/admin/articles`
- `GET /api/admin/articles/:id`
- `PUT /api/admin/articles/:id`
- `DELETE /api/admin/articles/:id`

- `GET /api/admin/media-items`
- `POST /api/admin/media-items`
- `GET /api/admin/media-items/:id`
- `PUT /api/admin/media-items/:id`
- `DELETE /api/admin/media-items/:id`

- `GET /api/admin/links`
- `POST /api/admin/links`
- `GET /api/admin/links/:id`
- `PUT /api/admin/links/:id`
- `DELETE /api/admin/links/:id`

- `GET /api/admin/nav-links`
- `POST /api/admin/nav-links`
- `GET /api/admin/nav-links/:id`
- `PUT /api/admin/nav-links/:id`
- `DELETE /api/admin/nav-links/:id`

- `GET /api/admin/contacts`
- `POST /api/admin/contacts`
- `GET /api/admin/contacts/:id`
- `PUT /api/admin/contacts/:id`
- `DELETE /api/admin/contacts/:id`

- `POST /api/admin/uploads`

## User Management (admin-only)

- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/users/:id`
- `PUT /api/admin/users/:id/role`
- `PUT /api/admin/users/:id/password`
- `DELETE /api/admin/users/:id`

## Search & Pagination

List endpoints support:

- `q=search`
- `page=1`
- `page_size=20`

If any of those params are provided, responses return:

```json
{
  "data": [],
  "page": 1,
  "page_size": 20,
  "total": 0
}
```

## Database

- Base collection guide: `src/db/schema.md`
- DB connection utility: `src/db/connection.js`
- Seed script (destructive): `src/db/seed.js`
- Content bundle queries live in `src/repositories/content.repository.js`
