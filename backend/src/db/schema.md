# MongoDB Collections (Mongoose)

This backend uses Mongoose models with timestamps enabled.

## Collections

- `users`
  - Fields: `name`, `email`, `passwordHash`, `role`, `createdAt`, `updatedAt`
  - Roles: `admin`, `editor`
- `posts`
  - Fields: `title`, `slug`, `content`, `excerpt`, `category`, `featuredImage`, `attachment`, `status`, `author`, `publishedAt`, `createdAt`, `updatedAt`
  - Status: `draft`, `published`
- `categories`
  - Fields: `name`, `slug`, `description`, `createdAt`, `updatedAt`
- `videos`
  - Fields: `title`, `url`, `thumbnail`, `category`, `duration`, `description`, `publishedAt`, `createdAt`, `updatedAt`
- `mostreads`
  - Fields: `title`, `slug`, `category`, `rank`, `publishedAt`, `createdAt`, `updatedAt`
- `weathers`
  - Fields: `location`, `temperature`, `condition`, `createdAt`, `updatedAt`
- `exchangerates`
  - Fields: `base`, `currency`, `rate`, `createdAt`, `updatedAt`
- `uploads`
  - Fields: `filename`, `originalName`, `mimeType`, `size`, `url`, `uploadedBy`, `createdAt`, `updatedAt`
