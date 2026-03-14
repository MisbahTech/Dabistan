# Backend + Database Readiness Notes

## What was prepared

- Added a dedicated `backend/` workspace with layered folders:
  - `config`, `routes`, `controllers`, `services`, `repositories`, `middlewares`, `db`, `data`
- Added MongoDB collection guide (`backend/src/db/schema.md`)
- Added backend API endpoints for content (`/api/content/*`)
- Added frontend API base config and service wrappers:
  - `src/config/apiConfig.js`
  - `src/services/apiClient.js`
  - `src/services/contentApi.js`
- Added shared contract documentation:
  - `shared/contracts/content.contract.md`

## Next backend step

1. Replace seed-based repository with MongoDB queries in `backend/src/repositories/content.repository.js`
2. Add authentication and role middleware (if needed)
3. Point frontend components/routes to `contentApi` instead of local static files
