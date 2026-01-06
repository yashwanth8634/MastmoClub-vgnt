# Mastmo Club WebApp

## Overview
The Mastmo Club WebApp is a Next.js application designed to manage club events, registrations, and team memberships. It features a secure admin dashboard, event management, and automated email notifications.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (Jose) + HttpOnly Cookies
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **File Uploads:** UploadThing
- **Email:** Resend

## Key Features
- **Admin Dashboard:** Secure area for managing events and members.
- **Event Registration:** Robust registration system with team support and duplicate checks.
- **Rate Limiting:** MongoDB-based distributed rate limiting for serverless environments.
- **Security:**
    - Global Middleware for route protection.
    - Constant-time secret comparison for internal APIs.
    - Secure, HttpOnly cookies.
- **Observability:** Structured JSON logging.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Instance

### Environment Variables
Create a `.env.local` file with the following:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
INTERNAL_N8N_SECRET=your_internal_secret
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Architecture Highlights
- **Server Actions:** Used for all data mutations (`src/actions`).
- **Middleware:** `src/middleware.ts` handles authentication globally.
- **Rate Limiting:** `src/lib/rateLimit.ts` uses MongoDB to track request counts.
- **Logging:** `src/lib/logger.ts` provides structured logs.

## Security
- **Authentication:** Admin routes are protected by `middleware.ts` which verifies JWT tokens.
- **Input Validation:** All server actions use `Zod` schemas to validate input.
- **Race Conditions:** Event registration uses a "Check-Then-Act" strategy with comprehensive queries to prevent duplicates.
