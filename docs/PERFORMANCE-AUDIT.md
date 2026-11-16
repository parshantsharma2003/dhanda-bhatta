# Performance Audit & Bottleneck Analysis

**Project:** Dhanda Bhatta Company (Village Kalwa, Pillukhera, Jind, Haryana)  
**Live Target:** `https://dhanda-bhatta.vercel.app/`  
**Engineer:** Senior Next.js Performance & Infrastructure Specialist  
**Audit Date:** November 2026  
**Status:** COMPLETE (Baseline Established & Root Causes Identified)

---

## 1. Executive Summary

An exhaustive performance and infrastructure audit was conducted on the production Next.js 16 deployment of Dhanda Bhatta Company. By directly measuring the production endpoints on Vercel Edge, inspecting the compiled build bundles, profiling database connection lifecycles, and reviewing the App Router rendering tree, the primary root causes of slow initial loading, delayed navigation clicks, and perceived transition lag were definitively identified.

### Key Measured Metrics (Live Baseline Before Optimization)

| Route | Vercel Edge Cache | Cache-Control Header | Measured TTFB | Total Transfer Time | Route Classification |
|---|---|---|---|---|---|
| **`/` (Homepage)** | `MISS` | `private, no-cache, no-store` | **10,933 ms** (10.9s) | **12,842 ms** | Dynamic Serverless SSR |
| **`/about`** | `MISS` | `private, no-cache, no-store` | **5,571 ms** (5.6s) | **6,853 ms** | Dynamic Serverless SSR |
| **`/products`** | `MISS` | `private, no-cache, no-store` | **5,331 ms** (5.3s) | **5,537 ms** | Dynamic Serverless SSR |
| **`/gallery`** | `MISS` | `private, no-cache, no-store` | **5,114 ms** (5.1s) | **5,295 ms** | Dynamic Serverless SSR |
| **`/products/first-class-red-bricks`** | `PRERENDER` | `public, max-age=0, must-revalidate` | **671 ms** | **812 ms** | SSG (Static Prerender) |
| **`/delivery`** | `PRERENDER` | `public, max-age=0, must-revalidate` | **442 ms** | **654 ms** | Static Prerender |
| **`/contact`** | `PRERENDER` | `public, max-age=0, must-revalidate` | **357 ms** | **627 ms** | Static Prerender |

**The empirical pattern is unmistakable:**
Statically prerendered routes (`/delivery`, `/contact`, `/products/[slug]`) respond in **350ms – 670ms**. In stark contrast, the public pages marked with `force-dynamic` (`/`, `/about`, `/products`, `/gallery`) take **5,100ms – 10,930ms** on every single request because they force a cold/warm serverless function invocation, establish a TLS connection to MongoDB Atlas, execute database lookups, and dynamically render HTML with zero edge caching.

---

## 2. Confirmed Root Causes & Findings

### Finding 1 (CONFIRMED — CRITICAL SEVERITY): Forced Dynamic Rendering on Public Content Pages
1. **Problem:** Public, high-traffic pages (`/`, `/about`, `/products`, `/gallery`) have `export const dynamic = "force-dynamic"` configured.
2. **Evidence:**
   - Source inspection: `src/app/page.js:15`, `src/app/about/page.js:15`, `src/app/products/page.js:22`, `src/app/gallery/page.js:24`.
   - Next.js build output: flags `/`, `/about`, `/products`, `/gallery` as `ƒ (Dynamic) server-rendered on demand`.
   - Live HTTP headers: `x-vercel-cache: MISS`, `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`.
   - Measured TTFB on `https://dhanda-bhatta.vercel.app/`: Homepage TTFB is **10,933 ms**.
3. **Affected Components/Routes:**
   - `src/app/page.js` (`/`)
   - `src/app/about/page.js` (`/about`)
   - `src/app/products/page.js` (`/products`)
   - `src/app/gallery/page.js` (`/gallery`)
4. **Impact:** Complete invalidation of Vercel Edge CDN caching. Every single visitor pays the full cold-start, TLS handshake, MongoDB query, and React SSR penalty.
5. **Recommended Correction:**
   - Remove `export const dynamic = "force-dynamic"`.
   - Implement Incremental Static Regeneration (ISR) with `export const revalidate = 300` (5 minutes) or `60` seconds.
   - Configure on-demand cache revalidation (`revalidatePath`) in admin CRUD routes (`/api/admin/products`, `/api/admin/gallery`, `/api/admin/content/[key]`, `/api/admin/settings`) so published content reflects immediately while visitors get sub-50ms TTFB from edge cache.

---

### Finding 2 (CONFIRMED — HIGH SEVERITY): Missing `loading.js` Boundaries Causing Unresponsive Navigation & Button Freezes
1. **Problem:** There are zero `loading.js` or instant fallback boundaries in `src/app/`.
2. **Evidence:**
   - Filesystem audit confirms zero `loading.js` files across the entire application.
   - When a user taps or clicks `<Link href="/about">` or `<Link href="/products">` on mobile or desktop, Next.js initiates an RSC data fetch. Because the destination is dynamic, Next.js must wait for the serverless function to respond before updating the DOM. Without a `loading.js` boundary, React Suspense cannot swap in a loading skeleton or progress indicator.
3. **Affected Components/Routes:**
   - Root navigation (`Navbar.js`, `MobileMenu.js`, `MobileNav.js`, `DesktopNav.js`, `Button.js`)
   - All page transitions between `/`, `/about`, `/products`, `/gallery`, `/delivery`, `/contact`.
4. **Impact:** Screen appears frozen for several seconds after clicking. Users assume buttons or links are broken, leading to repeated tapping, frustrated abandonment, and elevated interaction latency (INP).
5. **Recommended Correction:**
   - Create lightweight, accessible `loading.js` components with instant skeleton outlines for `src/app/loading.js`, `src/app/about/loading.js`, `src/app/products/loading.js`, `src/app/gallery/loading.js`.
   - Ensure instant visual feedback when links or action buttons are pressed.

---

### Finding 3 (CONFIRMED — MEDIUM SEVERITY): Sequential & Redundant Database Lookups During SSR
1. **Problem:** Homepage server component executes sequential database queries (`getCmsContent("homepage")`, `getGlobalSiteSettings()`, `getPublishedProducts({ limit: 3 })`) without edge memoization.
2. **Evidence:**
   - `src/app/page.js`: awaits `Promise.all([getCmsContent("homepage"), getGlobalSiteSettings()])`, and then nested child `<ProductShowcase />` awaits `getPublishedProducts({ limit: 3 })`.
   - If Mongoose connection has to reconnect or establish new TCP sockets to Atlas during cold start, this introduces sequential 1,500ms – 3,000ms stalls.
3. **Affected Components/Routes:**
   - `src/app/page.js`
   - `src/components/sections/ProductShowcase.js`
   - `src/lib/server/getCmsContent.js`
   - `src/services/productService.js`
4. **Impact:** Unnecessary server execution time and latency spikes.
5. **Recommended Correction:**
   - Under ISR, the rendered page is pre-computed at build time and cached at edge, completely eliminating run-time database lookups for public visitors.
   - For background revalidations, add index-covered lookups and connection pool reuse (`maxPoolSize: 10`, `minPoolSize: 0` for serverless to prevent zombie socket drains).

---

### Finding 4 (CONFIRMED — MEDIUM SEVERITY): Static Multi-Weight Font Loading Instead of Single Variable Fonts
1. **Problem:** `next/font/google` for `Archivo` and `Inter` is configured with arrays of 5 discrete static weights (`["400", "500", "600", "700", "800"]` and `["300", "400", "500", "600", "700"]`).
2. **Evidence:**
   - `src/app/layout.js:10-22`.
   - Both `Archivo` and `Inter` are modern variable fonts. Specifying an explicit weight array forces Next.js to fetch multiple separate font files instead of a single, highly optimized variable font file.
3. **Affected Components/Routes:**
   - `src/app/layout.js` (Global root layout affecting all pages).
4. **Impact:** Unnecessary network requests and byte transfer for font assets in the critical rendering path.
5. **Recommended Correction:**
   - Configure `Archivo` and `Inter` as variable fonts (omitting the discrete `weight` array or setting `variable: "--font-archivo"` with variable axes), reducing font asset downloads to 1 file per family.

---

### Finding 5 (CONFIRMED — MEDIUM SEVERITY): Heavy Interactive Components Included in Critical Bundle
1. **Problem:** `GalleryLightbox` modal is imported statically in `src/components/ui/GalleryGrid.js`, even though the lightbox is only opened when a user explicitly taps an image.
2. **Evidence:**
   - `src/components/ui/GalleryGrid.js:7`: `import GalleryLightbox from "./GalleryLightbox";`.
   - The lightbox contains modal event handlers, backdrop controls, and keyboard navigation that are unnecessary during initial page render.
3. **Affected Components/Routes:**
   - `src/components/ui/GalleryGrid.js`
   - `/gallery` page
4. **Impact:** Larger initial JavaScript bundle and unnecessary hydration work on mobile devices.
5. **Recommended Correction:**
   - Use dynamic import with `ssr: false` for `GalleryLightbox`:
     ```javascript
     const GalleryLightbox = dynamic(() => import("./GalleryLightbox"), { ssr: false });
     ```

---

### Finding 6 (CONFIRMED — LOW-TO-MEDIUM SEVERITY): Third-Party Script Loading Order
1. **Problem:** Google Analytics 4 is injected with `strategy="afterInteractive"`, which can compete with React hydration on low-powered mobile devices.
2. **Evidence:**
   - `src/components/analytics/GoogleAnalytics.js:19`.
3. **Affected Components/Routes:**
   - Global root layout (`src/app/layout.js`).
4. **Impact:** Potential minor increase in Total Blocking Time (TBT) on mobile devices during initial hydration.
5. **Recommended Correction:**
   - Change `strategy="afterInteractive"` to `strategy="lazyOnload"` so analytics scripts load only after the main thread is completely idle and interactive.

---

### Finding 7 (CONFIRMED — LOW SEVERITY): Missing Real-User Monitoring (RUM)
1. **Problem:** `@vercel/speed-insights` is not installed or configured.
2. **Evidence:**
   - `package.json` lacks `@vercel/speed-insights`.
   - Vercel dashboard cannot track field Core Web Vitals (LCP, INP, CLS) from actual visitors.
3. **Affected Components/Routes:**
   - Whole application observability.
4. **Impact:** Blindness to real-world visitor experiences across different networks in Haryana and North India.
5. **Recommended Correction:**
   - Install `@vercel/speed-insights` and embed `<SpeedInsights />` in `src/app/layout.js`.

---

## 3. Suspected Issues (Investigated & Clarified)

### Suspected Issue A: Vercel Function Region Mismatch
- **Hypothesis:** Vercel functions might be running in Washington (`iad1`) or Europe while MongoDB is in India.
- **Investigation & Evidence:**
  - Header `x-vercel-id: bom1::bom1::...` proves Vercel Edge and Functions are running in **`bom1` (Mumbai, India)**.
  - DNS and TCP testing to MongoDB Atlas host (`dhanda-bhatta-dev.frrt8yd.mongodb.net`) confirmed shards are in AWS `ap-south-1` (Mumbai). TCP ping is ~114ms from local machine and < 15ms inside AWS Mumbai.
- **Verdict:** Region is matched (both in Mumbai, India). The delay is not geographical distance; it is the fact that SSR lambdas were executing dynamically on every request without edge caching.

### Suspected Issue B: Excessive Client Bundle Overload
- **Hypothesis:** Massive dependencies (e.g. Moment.js, Lodash) might be bloating the client bundle.
- **Investigation & Evidence:**
  - `package.json` review reveals a clean, lean dependency tree (Next.js 16, React 19, Tailwind CSS 4, Lucide React, Better Auth, Zod, Mongoose).
  - Admin charts (`Recharts`) are strictly isolated to admin pages (`/admin/dashboard`), not loaded on public pages.
- **Verdict:** Public page JavaScript footprint is lightweight. The issue was dynamic execution latency, not bloated bundle size.

---

## 4. Prioritized Optimization Roadmap

| Priority | Bottleneck / Action | Target Impact | Implementation Step |
|---|---|---|---|
| **P1** | Convert public routes (`/`, `/about`, `/products`, `/gallery`) from `force-dynamic` to ISR (`revalidate = 300`) with on-demand `revalidatePath` | TTFB drops from 10,933ms to < 50ms (Edge HIT) | Task 8 & 6 |
| **P2** | Add lightweight `loading.js` boundaries and skeleton screens | Navigation feels immediate; zero frozen clicks | Task 7 |
| **P3** | Optimize font loading to single variable fonts for Archivo & Inter | Reduces font network requests and head-blocking | Task 5 |
| **P4** | Code-split heavy interactive components (`GalleryLightbox`) | Reduces initial client JS payload on gallery | Task 3 |
| **P5** | Shift Google Analytics to `lazyOnload` and install `@vercel/speed-insights` | Decreases TBT, enables real-user Core Web Vitals | Task 9 & 11 |
| **P6** | Add compound database indexes on `SiteContent`, `Enquiry`, `OrderRequest` | Faster revalidation and admin dashboard queries | Task 6 |
