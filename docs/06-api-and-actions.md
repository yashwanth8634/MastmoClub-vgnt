# API & Server Actions

## Server Actions
Server Actions are the primary way the client interacts with the server. They are located in `src/actions/`.

### Authentication (`src/actions/auth.ts`)
-   `loginAdmin(formData)`: Authenticates admin and sets `auth_token` cookie.
-   `logoutAdmin()`: Clears the `auth_token` cookie.

### Events (`src/actions/eventActions.ts`)
-   `createEvent(formData)`: Creates a new event. Protected by `verifyAdmin`.
-   `updateEvent(id, formData)`: Updates an existing event. Handles smart image cleanup (deletes unused images from UploadThing).
-   `deleteEvent(id)`: Deletes an event.

### Registration (`src/actions/EventRegistrationAction.ts`)
-   `registerForEvent(formData)`: Handles event registration.
    -   **Validation:** Zod schema validation.
    -   **Race Condition Check:** Checks if *any* participant (lead or member) is already registered.
    -   **Email:** Sends confirmation email via Resend.

## Internal APIs
Located in `src/app/api/internal/`. These endpoints are designed for system-to-system communication (e.g., n8n workflows).

### Security
All internal APIs require the `x-internal-secret` header. The value is compared against `INTERNAL_N8N_SECRET` using a **constant-time comparison** to prevent timing attacks.

### Endpoints
-   `POST /api/internal/mark-notified`: Marks a club member as notified.
-   `GET /api/internal/pending-memberships`: Retrieves members pending notification.

## Error Handling
The application uses standardized error classes defined in `src/lib/errors.ts`:
-   `AppError`: Base class.
-   `ValidationError` (400)
-   `AuthenticationError` (401)
-   `NotFoundError` (404)
-   `RateLimitError` (429)

## Logging
Structured logging is implemented via `src/lib/logger.ts`. Logs are output in JSON format for easy parsing by monitoring tools.
-   `logger.info(message, context)`
-   `logger.error(message, error, context)`
-   `logger.warn(message, context)`
