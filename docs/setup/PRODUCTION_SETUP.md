# Production Configuration Guide - MASTMO Club

This guide covers setting up MASTMO Club for production with proper configuration for handling up to 5000+ members.

## Table of Contents
1. [Environment Variables](#environment-variables)
2. [Sentry Configuration](#sentry-configuration)
3. [Database Optimization](#database-optimization)
4. [Performance & Load Testing](#performance--load-testing)
5. [Deployment Checklist](#deployment-checklist)

---

## Environment Variables

Create a `.env.production` file with the following variables:

```env
# Application
NODE_ENV=production
APP_VERSION=1.0.0

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mastmoclub?retryWrites=true&w=majority

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Sentry Error Tracking
SENTRY_DSN=https://your-key@sentry.io/your-project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
NEXT_PUBLIC_APP_VERSION=1.0.0
```

---

## Sentry Configuration

### Step 1: Create a Sentry Account

1. Go to https://sentry.io/signup/
2. Sign up with your email
3. Create a new organization (name it "MASTMO Club" or similar)
4. Create a new project
   - **Platform:** Next.js
   - **Alert Rule:** Enable "Alert me on every new issue"

### Step 2: Get Your DSN

After creating the project:
1. Go to **Settings** → **Projects** → **[Your Project]** → **Client Keys (DSN)**
2. Copy the DSN (looks like: `https://xxxx@xxxx.ingest.sentry.io/xxxxx`)

### Step 3: Configure Environment Variables

Add to your `.env.production`:
```env
SENTRY_DSN=https://your-key@sentry.io/your-project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
```

### Step 4: Production Sentry Settings

The application is configured with production-optimized settings:

**Server-side (sentry.server.config.mjs):**
- `tracesSampleRate: 0.1` (10% of transactions sampled)
- `environment: "production"`
- Performance monitoring enabled
- Max 50 breadcrumbs for memory efficiency

**Client-side (sentry.client.config.mjs):**
- `tracesSampleRate: 0.1` (10% of transactions)
- `replaysSessionSampleRate: 0.05` (5% of sessions recorded)
- `replaysOnErrorSampleRate: 1.0` (100% of error sessions recorded)

### Why These Values?

- **10% trace sampling:** Reduces cost while capturing representative data
- **5% session replay:** Balances insights with bandwidth/storage costs
- **100% error replay:** Critical for debugging production issues

### Adjusting for Your Needs

If you have **high error rates**, increase sampling:
```javascript
tracesSampleRate: process.env.NODE_ENV === "production" ? 0.5 : 1.0,  // 50% instead of 10%
replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0.5,  // 10% instead of 5%
```

---

## Database Optimization

### MongoDB Atlas Setup (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0 tier can handle moderate load)
3. For 5000+ members, upgrade to **M10 or higher**

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/mastmoclub?retryWrites=true&w=majority
```

### Database Performance for 5000+ Members

**Estimated Data:**
- 5000 members × ~1KB per member = 5MB
- 500 events × ~2KB per event = 1MB
- 10,000 registrations × ~1KB = 10MB
- **Total: ~20MB** (very manageable)

**Recommended Indexes (already configured):**
- `members.email + eventName` (sparse)
- `members.phone + eventName` (sparse)
- `members.rollNo + eventName` (sparse)

### Add More Indexes if Needed

```javascript
// In MongoDB Atlas console:
db.registrations.createIndex({ "members.email": 1 }, { sparse: true })
db.registrations.createIndex({ "members.phone": 1 }, { sparse: true })
db.registrations.createIndex({ "members.rollNo": 1 }, { sparse: true })
db.registrations.createIndex({ eventName: 1 })
db.events.createIndex({ createdAt: -1 })
```

---

## Performance & Load Testing

### Can It Handle 5000 Members?

**YES**, with proper configuration. Here's the breakdown:

#### Hardware Requirements (Minimal)

- **RAM:** 1GB minimum (2GB recommended)
- **CPU:** 1 vCPU (2 vCPU recommended)
- **Storage:** 50GB SSD
- **Network:** 1Mbps minimum

#### Estimated Throughput

- **Concurrent Users:** 100-200
- **Requests per second:** 50-100
- **Registration submissions:** 50+ per minute
- **Email sends:** 1-5 per second

#### Bottlenecks & Solutions

| Bottleneck | Impact | Solution |
|-----------|--------|----------|
| Database queries | High | Add MongoDB indexes ✅ (configured) |
| Email sending | Medium | Use queue system (optional) |
| Memory usage | Low | Node.js heap: 512MB default ✅ |
| Static assets | Low | Use CDN (Cloudflare, etc.) |

#### Load Test Example

```bash
# Using Apache Bench (ab)
ab -n 10000 -c 100 https://your-domain.com/api/health

# This simulates 10,000 requests with 100 concurrent users
```

Expected results for production:
- Response time: 50-200ms
- Success rate: 99%+
- Errors: <1%

---

## Production Deployment Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] Sentry DSN added and tested
- [ ] Gmail app password configured
- [ ] MongoDB Atlas cluster created and connection tested
- [ ] Backups configured (see BACKUP_RECOVERY_PLAN.md)

### Deployment

- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors
- [ ] All tests passing (if applicable)
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting enabled

### Post-Deployment

- [ ] Monitor Sentry dashboard for errors
- [ ] Check application logs
- [ ] Test email notifications
- [ ] Verify database connectivity
- [ ] Monitor performance metrics
- [ ] Set up alerting in Sentry

---

## Email Configuration (Gmail)

### Get Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification (if not already enabled)
3. Go to **App passwords**
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Add to `.env.production`:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   ```

**Note:** This is different from your actual Gmail password!

---

## Scaling Beyond 5000 Members

If you need to scale further:

1. **Upgrade MongoDB:** Use M30 or higher tier
2. **Add Caching:** Implement Redis for frequently accessed data
3. **Load Balancer:** Use multiple app instances behind a load balancer
4. **CDN:** Serve static assets from Cloudflare or similar
5. **Email Queue:** Implement Bull/BullMQ for email processing
6. **Database Replication:** Set up read replicas

---

## Monitoring & Maintenance

### Key Metrics to Monitor

```javascript
// Check Sentry Dashboard for:
- Error rates (should be <1%)
- Performance metrics (p95 response time <500ms)
- User sessions
- Transaction throughput

// Check Application Logs for:
- Email sending failures
- Database connection issues
- Authentication failures
```

### Health Check

```bash
# Test the health endpoint
curl https://your-domain.com/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-12-10T12:00:00Z",
  "uptime": 86400
}
```

---

## Troubleshooting

### Sentry Not Capturing Errors

1. Verify DSN is correct in `.env.production`
2. Check that `NODE_ENV=production` is set
3. Restart the application
4. Test by visiting `/api/health`

### Emails Not Sending

1. Verify Gmail credentials in `.env.production`
2. Check that "Less secure app access" is enabled (or use App Password)
3. Check application logs: `npm run build && npm run start`
4. Verify email syntax in error response

### Database Connection Issues

1. Check MongoDB Atlas network access (IP whitelist)
2. Verify connection string format
3. Test connection: `mongosh "mongodb+srv://..."`

---

## Support & Resources

- **Sentry Documentation:** https://docs.sentry.io/product/
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Next.js Production:** https://nextjs.org/docs/deployment
- **Nodemailer (Email):** https://nodemailer.com/

---

**Last Updated:** December 10, 2025  
**Version:** 1.0.0
