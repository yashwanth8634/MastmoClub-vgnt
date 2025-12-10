// This file configures the Sentry browser-side SDK
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Production settings
    environment: process.env.NODE_ENV || "production",

    // Sample 10% of transactions in production
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Enable performance monitoring
    enableTracing: true,

    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

    // Session Replay configuration
    // Capture 100% of sessions with errors, 5% of all sessions
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0.1,
    
    // Ignore specific errors from third-party libraries
    ignoreErrors: [
      "top.GLOBALS",
      "Uncaught SyntaxError",
      "plugin",
    ],

    // Maximum breadcrumbs to store
    maxBreadcrumbs: 50,
  });

  console.log("[Sentry] Client-side SDK initialized");
} else {
  console.warn("[Sentry] NEXT_PUBLIC_SENTRY_DSN not configured. Error tracking is disabled.");
}

