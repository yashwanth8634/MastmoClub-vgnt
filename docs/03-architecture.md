# System Architecture

## Project Structure

The project follows the standard Next.js App Router structure with a focus on separating concerns between UI, logic, and data access.

```
src/
├── actions/        # Server Actions (Business Logic & Mutations)
├── app/            # Next.js App Router (Pages, Layouts, API Routes)
├── components/     # React Components (UI)
│   ├── admin/      # Admin-specific components
│   └── ui/         # Reusable UI elements
├── lib/            # Utilities & Helpers
│   ├── auth.ts     # Authentication logic
│   ├── db.ts       # Database connection
│   ├── logger.ts   # Structured logging
│   └── rateLimit.ts # Rate limiting logic
├── models/         # Mongoose Models (Data Schema)
└── middleware.ts   # Global Request Middleware
```

## Data Flow

1.  **Client Interaction:** User interacts with a form (e.g., Event Registration).
2.  **Server Action:** The form submission triggers a Server Action (e.g., `registerForEvent` in `src/actions/EventRegistrationAction.ts`).
3.  **Validation:** The action validates input using **Zod** schemas.
4.  **Security Check:**
    -   **Rate Limiting:** Checks MongoDB-backed rate limits.
    -   **Authentication:** Verifies admin session (if applicable).
5.  **Database Operation:** The action interacts with MongoDB via Mongoose models.
6.  **Response:** The action returns a success/error object to the client.
7.  **UI Update:** The client displays a toast notification or redirects.

## Key Components

### Server Actions (`src/actions`)
We use Server Actions for all data mutations. This eliminates the need for separate API routes for most CRUD operations, keeping logic close to the UI.

### Middleware (`src/middleware.ts`)
The middleware runs on the Edge and intercepts requests to `/admin/*`. It verifies the JWT token in the `auth_token` cookie before allowing access.

### Database Layer (`src/lib/db.ts`)
Manages the MongoDB connection. It implements a caching mechanism (`global.mongoose`) to prevent connection exhaustion during development hot-reloads.
