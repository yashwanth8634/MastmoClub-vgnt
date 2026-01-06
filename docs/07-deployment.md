# Deployment Guide

## Vercel Deployment (Recommended)

The application is optimized for deployment on [Vercel](https://vercel.com).

### 1. Project Setup
1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the project in Vercel.
3.  Select **Next.js** as the framework preset.

### 2. Environment Variables
Configure the following environment variables in the Vercel Project Settings:

| Variable | Description |
| :--- | :--- |
| `MONGODB_URI` | Connection string for MongoDB Atlas. |
| `JWT_SECRET` | Strong secret for signing tokens. |
| `INTERNAL_N8N_SECRET` | Secret for internal API protection. |
| `UPLOADTHING_SECRET` | UploadThing Secret Key. |
| `UPLOADTHING_APP_ID` | UploadThing App ID. |
| `RESEND_API_KEY` | API Key for Resend email service. |
| `NEXT_PUBLIC_APP_URL` | The production URL (e.g., `https://mastmo-club.vercel.app`). |

### 3. Build & Output Settings
-   **Build Command:** `npm run build`
-   **Output Directory:** `.next` (Default)
-   **Install Command:** `npm install`

## Edge Runtime Considerations
-   **Middleware:** The `src/middleware.ts` runs on the Vercel Edge Runtime. It uses `jose` for JWT verification because standard Node.js `jsonwebtoken` is not compatible with Edge.
-   **Database:** Server Actions run in Serverless Functions (Node.js). The `src/lib/db.ts` file implements a caching pattern (`global.mongoose`) to reuse the database connection across hot lambdas, preventing connection exhaustion.

## Troubleshooting

### Build Failures
-   Ensure all environment variables are set.
-   Check for TypeScript errors locally with `npm run build`.
-   Verify that `resend` and `jose` are in `dependencies` (not `devDependencies`).

### Runtime Errors
-   **504 Gateway Timeout:** Long-running database queries. Ensure indexes are created (see `docs/05-database.md`).
-   **429 Too Many Requests:** Rate limiting is active. Check `src/lib/rateLimit.ts` configuration.
