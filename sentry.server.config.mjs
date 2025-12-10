// This file configures the Sentry server-side SDK
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Production settings
    environment: process.env.NODE_ENV || "production",
    
    // Sample 10% of transactions in production to reduce volume
    // Increase to 0.5 (50%) for higher traffic, or 1.0 (100%) for critical issues
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // Sample 100% of errors (important for error tracking)
    maxBreadcrumbs: 50,
    
    // Enable performance monitoring
    enableTracing: true,
    
    // Release tracking
    release: process.env.APP_VERSION || "1.0.0",
    
    // Ignore specific errors (optional)
    ignoreErrors: [
      // Browser extensions
      "top.GLOBALS",
      // Generic errors
      "Uncaught SyntaxError",
    ],
  });
  
  console.log("[Sentry] Server-side SDK initialized with DSN:", SENTRY_DSN.substring(0, 20) + "...");
} else {
  console.warn("[Sentry] SENTRY_DSN not configured. Error tracking is disabled.");
}
