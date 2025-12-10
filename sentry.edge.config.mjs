// This file configures the Sentry edge-side SDK
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

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
    release: process.env.APP_VERSION || "1.0.0",
  });

  console.log("[Sentry] Edge-side SDK initialized");
} else {
  console.warn("[Sentry] SENTRY_DSN not configured. Error tracking is disabled.");
}
