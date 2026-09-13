# Mastmo Club WebApp

A modern club management platform built with cutting-edge web technologies. Manage events, registrations, and teams with a secure admin dashboard.

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-99.5%25-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwind-css)
![JWT](https://img.shields.io/badge/JWT-Security-red?style=flat-square&logo=json-web-tokens)

## ✨ Features

- **🔐 Admin Dashboard** — Secure event & member management
- **📝 Event Registration** — Robust system with team support & duplicate prevention
- **⚡ Rate Limiting** — MongoDB-based distributed rate limiting
- **🛡️ Security** — JWT auth, HttpOnly cookies, middleware protection
- **✉️ Email Notifications** — Automated emails via Resend
- **📤 File Uploads** — UploadThing integration
- **📊 Observability** — Structured JSON logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Instance

### Setup

```bash
# Clone & install
git clone <repo>
cd MastmoClub-vgnt
npm install

# Configure environment
cp .env.example .env.local
# Fill in your credentials

# Run
npm run dev
```

## 📁 Project Structure

```
src/
├── actions/      — Server Actions (data mutations)
├── middleware.ts — Authentication & route protection
├── lib/
│   ├── rateLimit.ts  — Distributed rate limiting
│   └── logger.ts     — Structured logging
└── components/   — React components
```

## 🔑 Key Environment Variables

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
UPLOADTHING_SECRET=your_uploadthing_secret
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔒 Security Features

✅ JWT token-based authentication  
✅ HttpOnly cookies for token storage  
✅ Global middleware for route protection  
✅ Zod schema validation on all inputs  
✅ Race condition prevention in event registration  
✅ Constant-time secret comparison  

---

Built with TypeScript • Powered by Next.js • Secured by design
