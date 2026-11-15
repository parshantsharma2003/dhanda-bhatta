# Dhanda Bhatta Company — Official Business Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/atlas)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-purple.svg)](https://www.better-auth.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

Production web application and operational portal for **Dhanda Bhatta Company**, an established kiln-fired red clay brick manufacturing and supply enterprise located in **Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana, India**.

---

## 🏗️ Technology Architecture

- **Framework:** Next.js (App Router, Turbopack, Server Components by default)
- **Language:** JavaScript strictly (ES Modules, zero TypeScript)
- **Styling:** Tailwind CSS 4 with custom editorial & industrial design tokens
- **Database:** MongoDB Atlas with Mongoose ORM & connection pooling
- **Authentication:** Better Auth with official MongoDB adapter, Argon2id password hashing, and mandatory TOTP 2FA
- **Media Delivery:** Cloudinary with signed administrative uploads and responsive srcset generation
- **SEO & Search:** Schema.org JSON-LD graph (`LocalBusiness`, `Organization`, `Product`, `Breadcrumbs`), dynamic XML sitemaps, robots protocol, and OpenGraph cards
- **Deployment Target:** Vercel (Production & Preview environments)

---

## 📁 Repository Structure

```
dbc/
├── docs/                             # Operational & launch documentation
│   ├── DEPLOYMENT.md                 # Complete Vercel & GitHub deployment guide
│   ├── PRODUCTION-ENVIRONMENT.md     # Production environment variables & Atlas setup
│   ├── PRODUCTION-LAUNCH-REPORT.md   # Pre-flight audit & readiness verification
│   └── SEO-LAUNCH-CHECKLIST.md       # Owner Google Search Console & NAP checklist
├── public/                           # Optimized static web assets (images, SVGs)
├── scripts/                          # Administrative, provisioning & test suites
│   ├── create-admin.js               # Initial Super Admin provisioning script
│   ├── init-production-db.js         # Production database initialization & indexing
│   ├── seed.js                       # Non-destructive catalogue & gallery seed
│   ├── test-api-routes.js            # API endpoint integration test suite
│   ├── test-db-connection.js         # MongoDB connection health verification
│   ├── test-phase6-auth.js           # Better Auth & 2FA security test suite
│   ├── test-phase7-admin.js          # Admin dashboard & management test suite
│   └── test-phase8-seo.js            # Comprehensive 87-point SEO test suite
├── src/
│   ├── app/                          # Next.js App Router routes & layouts
│   │   ├── (public)/                 # Public pages (/, /about, /products, /gallery, etc.)
│   │   ├── admin/                    # Administrative portal & 2FA gates (noindex)
│   │   ├── api/                      # REST API endpoints (public & protected admin)
│   │   ├── robots.js                 # Dynamic robots.txt crawler protocol
│   │   └── sitemap.js                # Dynamic sitemap.xml indexing generator
│   ├── components/                   # Reusable UI, layout & administrative components
│   ├── config/                       # Central site & navigation configuration
│   ├── data/                         # Verified baseline product & gallery data
│   ├── lib/                          # Database, auth, security, SEO & Cloudinary utilities
│   ├── models/                       # Mongoose database models & schemas
│   └── services/                     # Business logic & repository services
├── .env.example                      # Environment variables template with blank placeholders
├── next.config.mjs                   # Next.js configuration & security headers
├── vercel.json                       # Vercel deployment & region configuration (bom1)
└── package.json                      # Dependencies and npm scripts
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20.x or later
- Local MongoDB or MongoDB Atlas cluster URI
- Git

### 2. Installation
```bash
git clone <repository-url>
cd dbc
npm install
```

### 3. Environment Configuration
Copy the template and configure your local settings:
```bash
cp .env.example .env.local
```

Configure at minimum:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/dhanda_bhatta
MONGODB_DB_NAME=dhanda_bhatta
SITE_URL=http://localhost:3000
BETTER_AUTH_SECRET=dbc-development-auth-secret-change-in-production-min-32-chars
```

### 4. Initialize Database
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public site.

---

## 🔐 Administrative Access & 2FA

Public registration is strictly disabled. To provision the initial Super Admin account:

```bash
npm run admin:create -- --email="owner@dhandabhatta.com" --name="Bhatta Owner" --password="YourSecurePassword@2025"
```

1. Navigate to `http://localhost:3000/admin/login`.
2. Enter your credentials.
3. On first login, complete mandatory **TOTP Two-Factor Authentication** setup using Google Authenticator or Microsoft Authenticator.
4. Securely store the single-use emergency backup recovery codes.

---

## 🧪 Verification & Test Suites

The repository includes comprehensive automated test suites:

```bash
# Verify database connection pooling & connectivity
npm run test:db

# Run ESLint across all source files
npm run lint

# Execute Better Auth & session security test suite
npm run test:auth

# Execute Phase 7 Admin dashboard management test suite
node scripts/test-phase7-admin.js

# Execute Phase 8 SEO & Search Optimization test suite (87 assertions)
node scripts/test-phase8-seo.js

# Compile production build with Turbopack
npm run build
```

---

## 🌐 Production Deployment

Refer to the complete guides in the `docs/` directory:
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Production Environment Guide](docs/PRODUCTION-ENVIRONMENT.md)
- [Production Pre-Flight & Launch Report](docs/PRODUCTION-LAUNCH-REPORT.md)
- [SEO & Search Console Launch Checklist](docs/SEO-LAUNCH-CHECKLIST.md)

---

## 📄 License & Ownership

Proprietary — All rights reserved © Dhanda Bhatta Company, Village Kalwa, Pillukhera, Jind, Haryana, India.
