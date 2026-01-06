# Project Overview

## Introduction
Mastmo Club WebApp is a comprehensive platform designed for the Mastmo student club. It facilitates event management, member registration, team formation, and administrative oversight. The application is built with performance, security, and scalability in mind, leveraging the latest Next.js features.

## Key Features

### 🛡️ Admin Dashboard
- **Secure Access:** Protected by robust JWT-based authentication and middleware.
- **Event Management:** Create, update, and delete events with rich media support.
- **Member Oversight:** View and manage club registrations and event participants.
- **Analytics:** Dashboard overview of club growth and event engagement.

### 📅 Event System
- **Dynamic Listings:** Events are displayed with real-time status (Open/Closed/Full).
- **Team Registration:** Supports both individual and team-based event registrations.
- **Duplicate Prevention:** Advanced logic to prevent duplicate entries across teams and individuals.
- **Email Notifications:** Automated confirmation emails upon successful registration.

### 🔒 Security
- **Rate Limiting:** MongoDB-backed distributed rate limiting to prevent abuse.
- **Input Validation:** Strict Zod schemas for all user inputs.
- **Internal API Hardening:** Constant-time secret comparison for inter-service communication.
- **Edge-Ready Auth:** Authentication compatible with Vercel Edge Runtime.

## Technology Stack

### Core
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Runtime:** Node.js / Vercel Edge

### Data & Storage
- **Database:** MongoDB (via Mongoose)
- **File Storage:** UploadThing
- **Caching:** Next.js Cache + Mongoose Connection Caching

### Authentication & Security
- **Auth:** Custom JWT implementation (`jose`)
- **Hashing:** bcrypt
- **Validation:** Zod

### UI/UX
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion, GSAP
- **3D:** React Three Fiber (Drei)

### DevOps & Tools
- **Email:** Resend
- **Linting:** ESLint
- **Testing:** Vitest
