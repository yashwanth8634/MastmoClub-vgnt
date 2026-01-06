# Database Schema

## Overview
The application uses **MongoDB** with **Mongoose** for object modeling. The database connection is managed in `src/lib/db.ts` using a global caching pattern to ensure efficient connection management in a serverless environment.

## Models

### 1. Admin (`src/models/Admin.ts`)
Stores administrator credentials.
-   `name`: String (Required)
-   `email`: String (Required, Unique, Lowercase)
-   `passwordHash`: String (Required, bcrypt hash)
-   `role`: String (Required)

### 2. Event (`src/models/Event.ts`)
Stores event details.
-   `title`: String (Required)
-   `description`: String (Required)
-   `date`: String (Required)
-   `time`: String (Required)
-   `location`: String (Required)
-   `registrationOpen`: Boolean (Default: true)
-   `isLive`: Boolean (Default: true)
-   `maxRegistrations`: Number (Default: 0 - Unlimited)
-   `currentRegistrations`: Number (Default: 0)
-   `isTeamEvent`: Boolean (Default: false)
-   `minTeamSize`: Number (Default: 1)
-   `maxTeamSize`: Number (Default: 1)
-   `rules`: [String]
-   `gallery`: [String] (URLs from UploadThing)

### 3. EventRegistration (`src/models/EventRegistration.ts`)
Stores user registrations for events.
-   `eventId`: ObjectId (Ref: Event)
-   `fullName`: String
-   `rollNo`: String
-   `year`: String
-   `branch`: String
-   `section`: String
-   `teamName`: String (Optional)
-   `teamMembers`: Array of Objects `{ name, rollNo, branch, section }`
-   **Indexes:**
    -   Compound Unique Index: `{ eventId: 1, rollNo: 1 }` (Prevents duplicate main registrations)

### 4. RateLimit (`src/models/RateLimit.ts`)
Stores IP-based rate limit counters.
-   `key`: String (IP Address)
-   `count`: Number
-   `resetAt`: Date
-   **Indexes:**
    -   TTL Index on `resetAt` (ExpireAfterSeconds: 0) - Automatically cleans up old entries.

### 5. ClubRegistration (`src/models/ClubRegistration.ts`)
Stores general club membership details.
-   `member`: Object (Personal details)
-   `status`: String (pending/approved/rejected)
-   `notificationSent`: Boolean
