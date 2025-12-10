# Sentry Setup Guide

This guide walks you through setting up Sentry error tracking for the MASTMO Club application.

## Quick Start (Automated Setup)

The easiest way to set up Sentry is using the Sentry wizard:

```bash
npx @sentry/wizard@latest -i nextjs --saas --org mastmo --project javascript-nextjs
```

This command will:
1. ✅ Create a Sentry account (if needed)
2. ✅ Set up a new project for Next.js
3. ✅ Configure environment variables
4. ✅ Update your Next.js configuration automatically
5. ✅ Initialize Sentry SDK files

**Simply follow the prompts in the wizard.**

---

## Manual Setup (If Wizard Fails)

If the wizard doesn't work, follow these steps:

### 1. Create Sentry Account & Project

1. Go to [https://sentry.io/](https://sentry.io/) and sign up
2. Click "Create Organization" and enter: `mastmo`
3. Click "Create Project" and select:
   - **Platform:** Next.js
   - **Project name:** javascript-nextjs (or any name)
4. Copy your **DSN** (looks like: `https://key@sentry.io/123456`)

### 2. Set Environment Variables

Create `.env.local` in your project root:

```env
# From Sentry > Settings > Projects > [Your Project] > Client Keys (DSN)
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
SENTRY_DSN=https://your-key@sentry.io/your-project-id
```

For production (Vercel dashboard):
- Go to Settings → Environment Variables
- Add the same variables

### 3. Initialize Sentry Config Files

Create `sentry.server.config.mjs`:

```mjs
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  attachStacktrace: true,
  integrations: [],
});
```

Create `sentry.client.config.mjs`:

```mjs
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
});
```

Create `sentry.edge.config.mjs`:

```mjs
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
});
```

### 4. Update Next.js Config

Update `next.config.ts`:

```typescript
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  // your config
};

export default withSentryConfig(nextConfig, {
  silent: true,
  hideSourceMaps: true,
  disableLogger: true,
});
```

---

## Accessing Sentry Dashboard

Once set up, monitor errors at:

```
https://sentry.io/organizations/mastmo/issues/
```

### Common Features:

| Feature | Path |
|---------|------|
| **All Issues** | Issues → List |
| **Error Details** | Click any issue |
| **Performance** | Performance → Transactions |
| **Session Replay** | Sessions → List |
| **Release Tracking** | Releases |
| **Alerts** | Alerts → Create Alert Rule |

---

## Testing Your Setup

### 1. Test Error Capture (Development)

Add this to any page to trigger an error:

```tsx
// src/app/test-error/page.tsx
export default function TestErrorPage() {
  return (
    <button onClick={() => {
      throw new Error("Test error from MASTMO");
    }}>
      Trigger Test Error
    </button>
  );
}
```

Visit `http://localhost:3000/test-error` and click the button.

Check Sentry: Errors should appear in your Issues dashboard within 30 seconds.

### 2. Test Performance Monitoring

Build and deploy a small change. Sentry will automatically track:
- Page load time
- Server response time
- Database query duration

---

## Configuration Reference

### Environment Variables

```env
# Required
NEXT_PUBLIC_SENTRY_DSN=https://key@sentry.io/project-id
SENTRY_DSN=https://key@sentry.io/project-id

# Optional but recommended
SENTRY_AUTH_TOKEN=your-auth-token  # For source map uploads
SENTRY_ENVIRONMENT=production       # Separate staging/prod tracking
SENTRY_RELEASE=1.0.0               # Track releases
```

### Sample Rate Recommendations

| Environment | `tracesSampleRate` | `replaysSessionSampleRate` | Note |
|-------------|------------------|----------------------|------|
| **Development** | 1.0 (100%) | 1.0 (100%) | Capture everything for debugging |
| **Staging** | 0.5 (50%) | 0.1 (10%) | Balance coverage and quota |
| **Production** | 0.1 (10%) | 0.05 (5%) | Keep costs low |

---

## Monitoring Your Application

### What Sentry Tracks:

✅ **Errors & Exceptions**
- Unhandled errors in Next.js
- Server-side errors
- Client-side JavaScript errors

✅ **Performance**
- Page load time
- API response time
- Database queries (with integration)

✅ **Releases**
- Track errors by version
- Compare performance across versions

✅ **User Sessions**
- Session replay with errors
- User interactions leading to issues

### Set Up Alerts

1. Go to Sentry → Alerts → Create Alert Rule
2. Select: "Issues" → "For each new issue"
3. Set notification: Email or Slack
4. Save

---

## Troubleshooting

### "DSN not found" error

**Solution:** Make sure `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` are set in `.env.local` and rebuilt.

```bash
npm run build
npm run dev
```

### Errors not appearing in Sentry

1. Check DSN is correct (copy from Sentry dashboard)
2. Make sure `NODE_ENV=production` in build
3. Clear `.next` folder: `rm -rf .next`
4. Rebuild: `npm run build`

### Source maps not uploading

1. Generate auth token: Sentry → Settings → Auth Tokens
2. Add to `.env`: `SENTRY_AUTH_TOKEN=your-token`
3. Rebuild and deploy

---

## Vercel Integration

For automatic Sentry integration on Vercel:

1. Go to Vercel Dashboard → Project Settings
2. Add Environment Variables:
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://...
   SENTRY_DSN=https://...
   SENTRY_AUTH_TOKEN=...
   ```
3. Redeploy
4. Errors will appear in Sentry within seconds

---

## Best Practices

✅ **DO:**
- Monitor error rates daily
- Set up alerts for critical errors
- Track performance trends
- Use releases to correlate errors with code changes
- Regularly review and fix top issues

❌ **DON'T:**
- Ignore low-level warnings (they compound)
- Skip performance optimization when errors increase
- Leave sensitive data in error messages
- Forget to update release version on deploy

---

## Getting Help

- **Sentry Docs:** https://docs.sentry.io/
- **Next.js Integration:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Community:** https://discord.gg/sentry

