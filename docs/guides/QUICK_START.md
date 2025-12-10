# Quick Start: From Development to Production

Complete guide to go from local development to production deployment in 30 minutes.

## Step 1: Set Up Sentry (5 minutes)

```bash
# Run the Sentry wizard - it handles everything automatically
npx @sentry/wizard@latest -i nextjs --saas --org mastmo --project javascript-nextjs
```

**What it does:**
- Creates Sentry account/project
- Configures Next.js
- Sets up `.env.local`
- Initializes Sentry config files

**After wizard completes:**
- Copy the DSN shown at the end
- Paste into `.env.local` as `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN`

---

## Step 2: Configure Environment Variables (3 minutes)

Edit or create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mastmoclub

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=16-character-app-password-from-google

# Sentry (from wizard above)
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_DSN=https://...@sentry.io/...
```

### How to get GMAIL_APP_PASSWORD:
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → 2-Step Verification → App passwords
3. Select "Mail" and "Windows Computer"
4. Google generates a 16-character password → Copy it
5. Paste into `.env.local`

---

## Step 3: Test Everything Locally (5 minutes)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:3000
```

**Test these features:**
1. Homepage loads ✅
2. Admin login (user: `admin`, pass: `mastmo_admin_2025`) ✅
3. Create a test member → Check email ✅
4. Create a test event → Check admin panel ✅
5. Admin backup page loads ✅
6. Create a backup → Verify file created ✅

---

## Step 4: Verify Build (3 minutes)

```bash
npm run build
```

**Should see:**
```
✓ Compiled successfully
✓ Generating static pages
```

If errors: Check `.env.local` is correct and rebuild.

---

## Step 5: Push to GitHub (5 minutes)

```bash
# Check what will be committed
git status
git diff --cached | grep -i "password\|key\|secret"
# ^ Should return NOTHING

# Commit and push
git add .
git commit -m "MASTMO Club: Complete setup with auth, registration, backup, email, monitoring"
git push origin main
```

**Important:** `.env.local` is in `.gitignore` - will NOT be pushed (that's correct!)

---

## Step 6: Deploy to Vercel (10 minutes)

### 6.1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. "New Project" → Import your GitHub repo
3. Click "Deploy"

### 6.2: Add Environment Variables (CRITICAL!)
**Before first production deploy:**

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add these exact variables:

```
MONGODB_URI → mongodb+srv://...
GMAIL_USER → your-email@gmail.com
GMAIL_APP_PASSWORD → 16-character-password
NEXT_PUBLIC_SENTRY_DSN → https://...@sentry.io/...
SENTRY_DSN → https://...@sentry.io/...
NODE_ENV → production
```

3. Save
4. Go back to Deployments → Click "Redeploy" (not Deploy!)

### 6.3: Verify Production
- [ ] Visit https://your-app.vercel.app
- [ ] Admin login works
- [ ] Create test member → Email sent ✅
- [ ] Check Sentry dashboard for any errors ✅
- [ ] Try backup function ✅

---

## Step 7: Set Up Automated Backups (Optional but Recommended)

### Daily Backups via GitHub Actions

1. Go to GitHub Repo → Settings → Secrets and variables → Actions
2. Add secrets:
   ```
   MONGODB_URI=mongodb+srv://...
   ```

3. Backup workflow (`.github/workflows/backup.yml`) already configured
4. Test it: Go to Actions tab → "Backup Database Daily" → "Run workflow"
5. Check that backups are created (takes ~2 minutes)

For production backups to AWS S3:
1. Create S3 bucket on AWS
2. Add to GitHub secrets:
   ```
   AWS_S3_BUCKET=your-bucket
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   ```

---

## Success Checklist

✅ **Development:**
- [ ] `npm run build` passes
- [ ] `npm run dev` works
- [ ] All features tested locally

✅ **Code Quality:**
- [ ] No sensitive data in git
- [ ] `.gitignore` proper
- [ ] `.env.local` NOT in repo

✅ **Production:**
- [ ] Vercel deployment successful
- [ ] Environment variables set
- [ ] Site accessible and functional
- [ ] Sentry capturing errors
- [ ] Admin can access backup panel
- [ ] Automated backups configured

---

## Your Production URLs

```
Main App:        https://your-project.vercel.app
Admin Panel:     https://your-project.vercel.app/admin/login
Sentry Errors:   https://sentry.io/organizations/mastmo/issues/
GitHub Repo:     https://github.com/your-username/mastmo-club
```

---

## Common Issues & Solutions

### "Build fails: Cannot find module"
→ Run `npm ci --legacy-peer-deps` and rebuild

### "Sentry DSN not found"
→ Verify `NEXT_PUBLIC_SENTRY_DSN` in Vercel Environment Variables

### "Emails not sending"
→ Double-check `GMAIL_APP_PASSWORD` (must be 16 chars from Google)

### "Database connection failed"
→ Verify `MONGODB_URI` is correct and IP whitelist includes Vercel

### "Backup returns 401 Unauthorized"
→ Make sure you're logged in as admin (check admin_token cookie)

---

## Next Steps

1. **Customize Settings:**
   - Update college name if different
   - Add team/club branding
   - Modify email templates

2. **Production Hardening:**
   - Change admin password
   - Set up rate limiting
   - Enable advanced Sentry alerts

3. **Monitoring:**
   - Daily: Check Sentry for errors
   - Weekly: Review backup success
   - Monthly: Performance analysis

4. **Scaling (500+ members):**
   - Upgrade MongoDB tier
   - Add Redis caching
   - Implement email queue

---

## Need Help?

📚 **Documentation:**
- `SENTRY_SETUP.md` - Detailed Sentry guide
- `PRODUCTION_SETUP.md` - Production configuration
- `BACKUP_RECOVERY_PLAN.md` - Backup procedures
- `DEPLOYMENT_CHECKLIST.md` - Complete checklist

💬 **Support:**
- Check logs: `vercel logs` or Vercel Dashboard
- Sentry issues: https://sentry.io/organizations/mastmo/issues/
- GitHub: Create an issue in repository

---

**Total time to production: ~30 minutes** ⏱️

Good luck! 🚀
