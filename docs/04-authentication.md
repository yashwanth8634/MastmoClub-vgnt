# Authentication & Security

## Overview
Authentication is handled via **JSON Web Tokens (JWT)** stored in secure, HTTP-only cookies. The system is designed to be compatible with the Vercel Edge Runtime, which is required for Next.js Middleware.

## Admin Authentication Flow

1.  **Login:**
    -   Admin submits email/password to `loginAdmin` action (`src/actions/auth.ts`).
    -   System verifies credentials against the `Admin` collection in MongoDB.
    -   Passwords are hashed using `bcrypt`.
    -   **Robustness:** The system handles potential schema caching issues by checking for both `passwordHash` (DB) and `passwordhash` (Stale Mongoose Schema).

2.  **Token Generation:**
    -   Upon success, a JWT is signed using `jose` (Edge-compatible library).
    -   Payload includes `id`, `email`, and `role`.
    -   Token expires in 1 day.

3.  **Cookie Storage:**
    -   The token is stored in a cookie named `auth_token`.
    -   **Attributes:**
        -   `httpOnly: true` (Inaccessible to client-side JS)
        -   `secure: true` (HTTPS only in production)
        -   `sameSite: "lax"` (CSRF protection)
        -   `path: "/"`

4.  **Middleware Protection:**
    -   `src/middleware.ts` intercepts all requests to `/admin/*`.
    -   It verifies the `auth_token` using `verifyAuthToken` helper.
    -   Invalid or missing tokens result in a redirect to `/admin/login`.

## Security Measures

### Rate Limiting
-   **Implementation:** `src/lib/rateLimit.ts`
-   **Storage:** MongoDB (`RateLimit` collection)
-   **Logic:** Tracks requests by IP address.
-   **Why MongoDB?** In-memory stores do not work in serverless environments where memory is not shared between lambda instances.

### Internal API Hardening
-   **Scope:** `src/app/api/internal/*`
-   **Protection:** Requires `x-internal-secret` header.
-   **Comparison:** Uses **constant-time string comparison** (`crypto.timingSafeEqual`) to prevent timing attacks.

### Input Validation
-   All Server Actions use **Zod** schemas to strictly validate input types, formats, and constraints before processing.
