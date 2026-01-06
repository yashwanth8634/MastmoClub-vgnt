# Setup & Installation Guide

## Prerequisites
- **Node.js:** Version 18.17 or higher (Required for Next.js 14+)
- **npm:** Version 9+ or `pnpm`/`yarn`
- **MongoDB:** A running instance (Local or Atlas)

## Environment Variables
Create a `.env.local` file in the root directory. This file is git-ignored for security.

```env
# Database Connection
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# Authentication
JWT_SECRET=your_super_secret_random_string_at_least_32_chars

# Internal APIs (e.g., for n8n or cron jobs)
INTERNAL_N8N_SECRET=another_secure_secret_string

# File Uploads (UploadThing)
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# Email Service (Resend)
RESEND_API_KEY=re_...

# Application URL (Used for absolute links in emails/metadata)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd mastmo-club
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

## Development

To start the development server with hot-reloading:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

1.  **Build the application:**
    ```bash
    npm run build
    ```
    This command compiles TypeScript, optimizes images, and generates static pages.

2.  **Start the production server:**
    ```bash
    npm start
    ```

## Linting & Testing

-   **Run Linter:**
    ```bash
    npm run lint
    ```
-   **Run Tests:**
    ```bash
    npm test
    ```
