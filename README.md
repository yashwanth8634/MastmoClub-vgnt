# MASTMO Club - Member Registration & Event Management System

A modern, full-stack web application for managing club memberships, event registrations, and team administration. Built with Next.js, MongoDB, and professional DevOps practices.

## ✨ Features

- **👥 Member Management:** Complete membership lifecycle from signup to approval
- **📅 Event Registration:** Event creation, registration, and capacity management
- **👨‍💼 Team Management:** Manage club teams and team members
- **📧 Email Notifications:** Automated emails for membership approvals, rejections, and event updates
- **🔐 Admin Dashboard:** Comprehensive management panel for administrators
- **💾 Database Backup & Recovery:** One-click backups and restore functionality
- **📊 Error Tracking:** Sentry integration for production monitoring
- **🚀 CI/CD Pipeline:** Automated testing and deployment via GitHub Actions
- **🎯 Performance:** Optimized with Next.js 16 and Turbopack

## 🚀 Quick Start

### For Development
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Fill in your environment variables
# - MongoDB URI
# - Gmail credentials
# - Sentry DSN (follow SENTRY_SETUP.md)

# Start development server
npm run dev
```

Visit http://localhost:3000

**Admin Credentials:**
- Username: `admin`
- Password: `mastmo_admin_2025`

### For Production
Follow the **[QUICK_START.md](./QUICK_START.md)** guide to deploy in 30 minutes.

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK_START.md](./QUICK_START.md)** | 30-minute guide from development to production |
| **[SENTRY_SETUP.md](./SENTRY_SETUP.md)** | Complete Sentry error tracking setup |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | Pre-deployment verification checklist |
| **[PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)** | Production configuration and scaling guide |
| **[BACKUP_RECOVERY_PLAN.md](./BACKUP_RECOVERY_PLAN.md)** | Database backup and recovery procedures |

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js 16, Server Components, API Routes
- **Database:** MongoDB, Mongoose ODM
- **Email:** Nodemailer with Gmail SMTP
- **Monitoring:** Sentry for error tracking and performance monitoring
- **Deployment:** Vercel (recommended), Docker-ready
- **CI/CD:** GitHub Actions for automated backups and deployments
- **Build:** Next.js with Turbopack

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Gmail account for email functionality
- (Optional) Sentry account for error tracking

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mastmo-club.git
   cd mastmo-club
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local` with your values:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/mastmoclub
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=16-char-app-password
   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
   SENTRY_DSN=https://...@sentry.io/...
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Main: http://localhost:3000
   - Admin: http://localhost:3000/admin/login

## 🎯 Usage

### Member Signup
1. Visit homepage
2. Click "Join Club"
3. Fill membership form
4. Admin approves in dashboard
5. Receives approval email

### Event Management
1. Admin creates event in Events Manager
2. Members register for events
3. Admin can approve registrations (if configured)
4. Members receive confirmation emails

### Database Backups
1. Admin → "Backup & Recovery"
2. Click "Create Backup Now"
3. Backups appear in list
4. Click "Restore" to recover from backup

### Monitoring Errors
1. Errors automatically sent to Sentry
2. View dashboard: https://sentry.io/organizations/mastmo/issues/
3. Set up alerts in Sentry

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy (automatic on push)

See [QUICK_START.md](./QUICK_START.md) for detailed instructions.

### Docker
```bash
docker build -t mastmo-club .
docker run -p 3000:3000 --env-file .env.production mastmo-club
```

## 📊 Capacity & Performance

### Can it handle 5000+ members?
✅ **YES**, with the following setup:

- **Database:** MongoDB M10+ tier
- **Hosting:** Vercel with Hobby plan or higher
- **Email:** Gmail SMTP (limit: ~300/hour)
- **Concurrent users:** 100-200
- **Database size:** ~20 MB

See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md#load-capacity-analysis) for detailed analysis.

## 🔒 Security Best Practices

✅ **Implemented:**
- Secure admin authentication with httpOnly cookies
- Password hashing for admin login
- Environment variable protection (`.env.local` in `.gitignore`)
- HTTPS enforced in production
- Email validation
- Roll number format validation
- Duplicate registration prevention

📋 **Recommended for production:**
- Change default admin password
- Enable rate limiting on APIs
- Set up AWS WAF or Cloudflare
- Regular security audits
- Monitor Sentry for suspicious patterns

## 🔄 Automated Backups

Backups run automatically every day at 2:00 AM UTC via GitHub Actions.

### Manual Backup
```bash
# Create backup
node scripts/backup.mjs

# Restore from backup
mongorestore --uri="mongodb://localhost:27017/mastmoclub" \
  --archive="backups/backup-2025-12-10T12-00-00.000Z" --gzip
```

See [BACKUP_RECOVERY_PLAN.md](./BACKUP_RECOVERY_PLAN.md) for complete guide.

## 📈 Monitoring & Analytics

### Sentry Dashboard
- **URL:** https://sentry.io/organizations/mastmo/issues/
- **Monitors:** Errors, performance, transactions
- **Alerts:** Configurable by severity

### Vercel Analytics
- **URL:** Vercel Dashboard → Analytics
- **Metrics:** Page load time, Web Vitals, edge requests

### Health Check
```bash
curl https://your-domain.vercel.app/api/health
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -m "Add my feature"`
3. Push to branch: `git push origin feature/my-feature`
4. Create Pull Request

## 📝 API Documentation

### Public Routes
- `GET /` - Homepage
- `GET /about` - About page
- `GET /events` - List all events
- `GET /events/[id]` - Event details
- `POST /events/[id]/register` - Register for event

### Admin Routes
- `POST /admin/login` - Admin login
- `GET /admin/dashboard-group/dashboard` - Dashboard
- `GET /admin/dashboard-group/members` - Manage members
- `GET /admin/dashboard-group/events` - Manage events
- `GET /admin/dashboard-group/backup` - Backup management
- `POST /api/backup` - Create backup
- `PUT /api/backup` - Restore backup
- `GET /api/health` - Health check

## 🐛 Troubleshooting

### Build fails
```bash
rm -rf .next node_modules
npm ci --legacy-peer-deps
npm run build
```

### Emails not sending
- Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are correct
- Check Gmail allows app passwords enabled
- Test locally first

### Database connection error
- Verify `MONGODB_URI` is correct
- Check IP whitelist on MongoDB Atlas
- Test connection locally

### Sentry not capturing errors
- Verify DSN is correct in `.env`
- Check browser console for Sentry errors
- Trigger test error to verify setup

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for more troubleshooting.

## 📄 License

This project is private and proprietary to MASTMO Club.

## 👥 Support

For issues, questions, or suggestions:
1. Check relevant documentation in `/docs`
2. Review existing GitHub issues
3. Create a new issue with details
4. Contact team lead

## 📞 Contact

**MASTMO Club**
- Instagram: [@mastmo_vgnt](https://instagram.com/mastmo_vgnt)
- College: Vignan Institute of Technology and Science
- Website: [Add your website]

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Status:** Production Ready

