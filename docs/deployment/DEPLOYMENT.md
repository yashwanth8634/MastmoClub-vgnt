# Production Deployment Guide

This document provides instructions for deploying and maintaining the application in a production environment.

## 1. Deployment Platform

The recommended deployment platform is [Vercel](https://vercel.com), as the application is built with Next.js. Vercel provides a seamless deployment experience with built-in CI/CD, scalability, and HTTPS.

To deploy:
1.  Push the code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Create a new project on Vercel and import the Git repository.
3.  Vercel will automatically detect that it is a Next.js project and configure the build settings.

## 2. Environment Variables

Before deploying, you must configure the environment variables in the Vercel project settings. Go to your project's **Settings > Environment Variables** and add the variables listed in `.env.example`.

You should configure variables for both **Production** and **Preview** environments.

**Important Security Note**: `SENTRY_AUTH_TOKEN` is a secret used during the build process to upload source maps. Ensure it is only exposed to the build environment and not to the runtime environment.

## 3. CI/CD Pipeline

While Vercel provides a basic CI/CD workflow (deploy on push), a more robust pipeline should be configured to ensure code quality and stability.

The `github-actions-example.yml` file in the root of this project provides a template for a GitHub Actions workflow that:
1.  Installs dependencies.
2.  Runs the linter (`npm run lint`).
3.  Runs the test suite (`npm run test:run`).
4.  Performs a security audit on dependencies (`npm audit`).

This workflow should be adapted and integrated into your repository's `.github/workflows` directory.

## 4. Database Management

-   **Backups**: A manual backup script is located at `scripts/backup.mjs`. For production, it is critical to automate this process. See the `BACKUP_RECOVERY_PLAN.md` file for instructions on setting up automated backups.
-   **Recovery**: The recovery process is detailed in `BACKUP_RECOVERY_PLAN.md`.

## 5. Observability

-   **Logging**: The application uses `pino` for structured logging. In Vercel, logs can be viewed in the project's **Logs** tab. For long-term storage and analysis, consider integrating Vercel logs with a third-party log management service.
-   **Error Tracking & APM**: Sentry is integrated for real-time error tracking and performance monitoring. Ensure the `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` environment variables are correctly configured.
-   **Health Checks**: A health check endpoint is available at `/api/health`. This can be used with an external uptime monitoring service (e.g., UptimeRobot, Better Uptime) to get notifications if the application or database becomes unresponsive.
