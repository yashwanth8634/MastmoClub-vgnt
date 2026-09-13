# MASTMO Club Portal 🧮

The official web platform for **MASTMO**, the mathematical and technical club of Vignan Institute of Technology and Science (VGNT). This platform manages club memberships, event registrations, and administrative reporting, bridging the gap between mathematical theory and modern engineering applications.

## 🚀 Core Features

* **Strict Event Registration:** Automated validation system that verifies a student's roll number, branch (e.g., CSE, EIE, CSM), and section against the active club database. Only 'approved' club members can register for events.
* **Team-Based Logic:** Seamless registration for group events, including automatic consistency checks to ensure all team members belong to the appropriate branch/section and are valid club members.
* **Admin Dashboard:** Secure backend interface for generating real-time Class Reports and Team Reports based on current event registrations.
* **Automated Email Notifications:** Instantly sends confirmation emails to students upon successful registration.
* **Cloudflare Protected Infrastructure:** Secured via Cloudflare Bot Fight Mode, Smart Shield caching, and strict SSL/TLS encryption.

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript
* **Database:** MongoDB Atlas (Mongoose ORM)
* **Styling:** Tailwind CSS
* **Validation:** Zod
* **Deployment:** Vercel
* **Infrastructure & DNS:** Cloudflare (DNSSEC, DMARC, SPF, Email Routing)

## 📋 Prerequisites

Before running this project locally, ensure you have the following installed:
* Node.js (v18.x or higher)
* npm or yarn
* A MongoDB Atlas Cluster

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email Configuration (SMTP / NodeMailer / Resend)
EMAIL_USER=mastmo.vgnt@gmail.com
EMAIL_PASS=your_app_password
