# Deployment Checklist

Complete this checklist before pushing to GitHub and deploying to production.

## Pre-Deployment Setup

### Code Quality
- [ ] Run `npm run build` - No errors
- [ ] Run `npm run dev` - App starts without issues
- [ ] Test admin login works
- [ ] Test member signup form
- [ ] Test event registration
- [ ] Test backup/recovery functionality
- [ ] Check for any console errors in browser DevTools

### Environment Configuration

#### Local Development (.env.local)
```bash
MONGODB_URI=mongodb://localhost:27017/mastmoclub
GMAIL_USER=your-test-email@gmail.com
GMAIL_APP_PASSWORD=16-char-password
NEXT_PUBLIC_SENTRY_DSN=https://... (get from Sentry)
SENTRY_DSN=https://... (get from Sentry)
```

- [ ] All environment variables set
- [ ] `.env.local` is in `.gitignore` (never push secrets!)

#### Sentry Setup
- [ ] Follow instructions in `SENTRY_SETUP.md`
- [ ] Run: `npx @sentry/wizard@latest -i nextjs --saas --org mastmo --project javascript-nextjs`
- [ ] Verify Sentry DSN in `.env.local`
- [ ] Test error capture: Create test error and verify it appears in Sentry

#### Database
- [ ] MongoDB connection working locally
- [ ] MongoDB Atlas cluster created for production
- [ ] Connection string ready: `mongodb+srv://...`
- [ ] Database backups created and tested

#### Email
- [ ] Gmail account ready (use a dedicated account or app password)
- [ ] 16-character app password generated
- [ ] Test email sending: Create a test member and verify email received
- [ ] All email templates reviewed and branded

### GitHub Setup
- [ ] Repository created on GitHub
- [ ] `.gitignore` includes: `/node_modules`, `/.next`, `.env*`, `/backups`
- [ ] Sensitive files not committed
- [ ] README.md complete and accurate
- [ ] Repository visibility set (public/private as needed)

```bash
# Verify nothing sensitive is in git:
git status
git diff --cached
```

### Files Ready to Commit
- [ ] `.env.example` - Has all needed variables (no real values)
- [ ] `.gitignore` - Proper configuration
- [ ] `SENTRY_SETUP.md` - Setup instructions
- [ ] `DEPLOYMENT_CHECKLIST.md` - This file
- [ ] `PRODUCTION_SETUP.md` - Production guide
- [ ] `BACKUP_RECOVERY_PLAN.md` - Backup procedures
- [ ] `src/app/api/backup/route.ts` - Backup API
- [ ] `src/app/admin/dashboard-group/backup/page.tsx` - Backup UI
- [ ] `.github/workflows/backup.yml` - Automated backups
- [ ] `.github/workflows/deploy.yml` - CI/CD pipeline

---

## Push to GitHub

```bash
# Check status
git status

# Stage all changes (except .env files which are in .gitignore)
git add .

# Verify nothing sensitive is being committed
git diff --cached | grep -i "password\|key\|token\|secret"
# ^ This should return NOTHING

# Commit
git commit -m "Initial MASTMO Club setup: auth, registration, backup, email, monitoring"

# Push to GitHub
git push origin main
```

---

## Vercel Deployment

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select project settings (keep defaults)
5. Click "Deploy"

### 2. Set Environment Variables
**Important:** Must do before first deploy!

Go to: Vercel → Project Settings → Environment Variables

Add:
```
MONGODB_URI = mongodb+srv://...
GMAIL_USER = your-email@gmail.com
GMAIL_APP_PASSWORD = 16-char-password
NEXT_PUBLIC_SENTRY_DSN = https://...
SENTRY_DSN = https://...
NODE_ENV = production
```

- [ ] All variables set
- [ ] Redeployed after adding variables

### 3. First Production Deploy
```bash
# In Vercel dashboard, click "Redeploy" (not "Deploy")
```

- [ ] Build succeeds (check Vercel logs)
- [ ] Pages load without errors
- [ ] Admin login works
- [ ] Forms submit successfully
- [ ] Emails send successfully
- [ ] Errors appear in Sentry

---

## Post-Deployment Tests

### Core Functionality
- [ ] Visit main page: https://your-domain.vercel.app
- [ ] Visit admin: https://your-domain.vercel.app/admin/login
  - Username: `admin`
  - Password: `mastmo_admin_2025`
- [ ] Create test member (signup form)
- [ ] Check test email received
- [ ] Create test event
- [ ] Test event registration
- [ ] Create backup from admin panel
- [ ] Check backup appears in list

### Monitoring
- [ ] Sentry dashboard shows no errors
- [ ] Check Sentry performance metrics
- [ ] Set up alert notifications in Sentry

### Security
- [ ] Change admin password:
  ```bash
  # In MongoDB:
  # 1. Change the password in code or database
  # 2. Update in production .env
  # 3. Redeploy
  ```
- [ ] Verify `.env` variables are not exposed
- [ ] Verify backups are stored securely
- [ ] HTTPS is enabled (default on Vercel)

---

## Automated Backups

### GitHub Actions Setup
- [ ] Backups workflow created (`.github/workflows/backup.yml`)
- [ ] AWS S3 bucket created for backup storage (optional but recommended)
- [ ] GitHub secrets configured:
  ```
  MONGODB_URI = mongodb+srv://...
  AWS_S3_BUCKET = your-bucket-name (optional)
  AWS_REGION = us-east-1 (optional)
  AWS_ACCESS_KEY_ID = ... (optional)
  AWS_SECRET_ACCESS_KEY = ... (optional)
  ```
- [ ] Test workflow manually: Click "Run workflow" in GitHub Actions
- [ ] Backup file created successfully

---

## Ongoing Maintenance

### Daily
- [ ] Monitor Sentry for errors
- [ ] Check if backup completed in GitHub Actions

### Weekly
- [ ] Review error trends in Sentry
- [ ] Check database size and growth
- [ ] Verify automated backups are running

### Monthly
- [ ] Test backup restoration procedure
- [ ] Review performance metrics
- [ ] Update dependencies: `npm update`

### On Each Deploy
- [ ] Test admin login again
- [ ] Verify email sending
- [ ] Check Sentry for new errors
- [ ] Monitor Vercel deployment logs

---

## Troubleshooting

### Build fails on Vercel
- [ ] Check Vercel logs for specific error
- [ ] Verify all environment variables are set
- [ ] Try rebuilding locally: `npm run build`
- [ ] Check Node.js version matches

### Emails not sending
- [ ] Verify GMAIL_USER and GMAIL_APP_PASSWORD are correct
- [ ] Check Gmail account allows less secure apps
- [ ] Test locally first
- [ ] Check email logs in app API

### Sentry not capturing errors
- [ ] Verify DSN is correct
- [ ] Check network tab - errors being sent?
- [ ] Try triggering test error manually
- [ ] Check Sentry project settings

### Backup API returns 401
- [ ] Verify you're logged in as admin
- [ ] Check admin_token cookie exists
- [ ] Try login again
- [ ] Clear browser cookies

---

## Scaling (After 500+ Members)

When you reach production scale:

- [ ] Upgrade MongoDB tier: M0 → M10+
- [ ] Consider Redis caching
- [ ] Set up email queue (Bull/BullMQ)
- [ ] Enable CDN for static assets
- [ ] Monitor database connection pooling
- [ ] Review Sentry performance thresholds

---

## Success Criteria

✅ All checks passing = Ready for production!

- [ ] Build succeeds
- [ ] All features work
- [ ] Errors captured in Sentry
- [ ] Backups running automatically
- [ ] Admin can manage system
- [ ] Members can register
- [ ] Emails send successfully
- [ ] Security best practices followed

---

**Last Updated:** December 2025  
**Next Review:** After first month of production

