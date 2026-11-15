# Dhanda Bhatta Company — Post-Launch SEO & Google Business Profile Checklist

**Target Business:** Dhanda Bhatta Company  
**Physical Kiln Location:** Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana - 126113  
**Service Radius:** Jind, Safidon, Assandh, Panipat, Gohana, and nearby Haryana regions  
**Website URL:** `https://dhandabhattacompany.com` (configurable via `NEXT_PUBLIC_SITE_URL`)

---

## 1. What Has Been Completed in Code (Automated Foundation)

| Feature | Technical Implementation | Status |
| :--- | :--- | :---: |
| **Configurable Canonical Base URL** | Handled in `@/lib/seo` via `NEXT_PUBLIC_SITE_URL` (never defaults to localhost) | Complete |
| **Page-Specific Metadata** | Unique titles, descriptions, and OpenGraph tags for every public page | Complete |
| **Dynamic XML Sitemap** | `src/app/sitemap.js` dynamically queries published products, excludes drafts & admin | Complete |
| **Crawler Directives (`robots.txt`)** | `src/app/robots.js` allows `/`, blocks `/admin/` and `/api/`, links to `sitemap.xml` | Complete |
| **Admin Route Protection** | `noindex, nofollow` metadata on all `/admin/...` and auth layout routes | Complete |
| **Schema.org Structured Data** | Verified `LocalBusiness`, `Organization`, `BreadcrumbList`, and `Product` JSON-LD | Complete |
| **Privacy-Safe GA4 Integration** | Optional GA4 component in `RootLayout`, tracks business events without transmitting PII | Complete |
| **Image & Web Vitals Optimization** | Next.js `<Image>` with priority on hero, AVIF/WebP formats, responsive sizes | Complete |

---

## 2. Mandatory Post-Launch Steps for the Owner

These steps require your direct access to the domain registrar, Google Search Console, and Google Business Profile.

---

### Step 1: Connect Your Custom Domain & Configure DNS

1. In your domain registrar (e.g. GoDaddy, Namecheap, Cloudflare), set up the DNS records provided by your hosting platform (Vercel):
   - **Type A:** `@` pointing to `76.76.21.21` (or your host IP)
   - **Type CNAME:** `www` pointing to `cname.vercel-dns.com`
2. Ensure SSL/TLS certificate is active and enforcing HTTPS.
3. Update environment variables in your hosting dashboard:
   ```env
   NEXT_PUBLIC_SITE_URL=https://dhandabhattacompany.com
   ```

---

### Step 2: Google Search Console Setup & Ownership Verification

> [!IMPORTANT]
> **Preferred Method:** Use **Domain Property** verification via DNS TXT record. This verifies both `http`, `https`, `www`, and non-www subdomains simultaneously.

#### A. Domain Property (Recommended)
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** and select **Domain** (left box).
3. Enter `dhandabhattacompany.com` (without `https://` or `www`).
4. Google will supply a TXT record (e.g., `google-site-verification=abc123...`).
5. Open your domain DNS management and add a new record:
   - **Type:** `TXT`
   - **Name / Host:** `@`
   - **Value:** Paste the verification string from Google.
   - **TTL:** Automatic or 3600 seconds.
6. Return to Google Search Console and click **Verify**. (DNS propagation may take 5–15 minutes).

#### B. HTML Meta Tag Fallback
If you cannot edit DNS records directly:
1. Select **URL Prefix** in Search Console and enter `https://dhandabhattacompany.com`.
2. Under "Other verification methods", select **HTML tag**.
3. Copy the token inside `content="..."`.
4. Add it to your hosting environment variables:
   ```env
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_copied_token_here
   ```
5. Redeploy your application and click **Verify**.

---

### Step 3: Submit Your Sitemap

1. Inside Google Search Console, navigate to **Indexing > Sitemaps** in the left sidebar.
2. In the "Add a new sitemap" input, enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**.
4. Within 24–48 hours, Google will report the status as **Success** and display the number of discovered URLs (homepage, about, products, published individual brick pages, gallery, delivery, contact, enquiry, order).

---

### Step 4: Inspect Important URLs

1. In the top search bar ("Inspect any URL in 'dhandabhattacompany.com'"), test:
   - `https://dhandabhattacompany.com`
   - `https://dhandabhattacompany.com/products`
   - `https://dhandabhattacompany.com/about`
   - `https://dhandabhattacompany.com/contact`
2. Click **Test Live URL**.
3. Verify that Google can fetch the page and detects the `LocalBusiness` and `BreadcrumbList` structured data without errors.
4. Click **Request Indexing** on the homepage to jumpstart initial crawling.

---

## 3. Google Business Profile (Local SEO Optimization)

Local map pack rankings (e.g. searching *"brick manufacturer in Jind"* or *"bhatta in Pillukhera"*) depend heavily on having a verified, complete Google Business Profile.

### Exact Business Identity Consistency (NAP)
Ensure your Name, Address, and Phone number are 100% identical on your Google Business Profile and website:

- **Business Name:** `Dhanda Bhatta Company`  
  *(Do not append keyword spam like "Dhanda Bhatta Company - Best Cheap Red Bricks in Haryana". Google suspends profiles with keyword-stuffed names).*
- **Primary Business Category:** `Brick Manufacturer`
- **Secondary Category:** `Building Materials Supplier`
- **Physical Address:**  
  `Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana 126113`
- **Service Area:**  
  Set your service radius to cover: `Jind`, `Safidon`, `Assandh`, `Panipat`, `Gohana`, and surrounding Haryana villages.
- **Website Link:** `https://dhandabhattacompany.com`
- **Primary Phone Number:** `+91 99966-69463` (Kiln Call Desk)
- **WhatsApp Support Number:** `+91 82956-69463`
- **Google Maps Listing:** `https://share.google/60pwtYCEIZ6sF7aGz`
- **Official Social Profiles:**
  - Instagram: `https://www.instagram.com/dhanda.bhatta?srtk=dXBjZmhmdzAwM3U4`
  - Facebook: `https://www.facebook.com/share/1Js74GJbZ8/`
  - YouTube: `https://www.youtube.com/@dhandabhattacompany`
- **Kiln Dispatch Hours:** `Monday – Sunday: 7:00 AM – 7:00 PM`

### Real Business Photography Checklist
Upload genuine, authentic high-resolution photos directly from your facility:
- [ ] Front entrance / approach road sign near Dharoli Gausala in Kalwa.
- [ ] Active Bull's trench kiln chambers during firing.
- [ ] Shaded drying hacks with green clay bricks.
- [ ] Organized stockyard piles of Class-1 red bricks.
- [ ] Tractor trolley and commercial trucks being loaded for dispatch.
- [ ] Close-up of brick edges, stamp, and clean texture.
*(Avoid generic stock photos downloaded from the internet; Google prioritizes real geocoded mobile uploads).*

### Genuine Review Collection Strategy
1. Never buy fake reviews or solicit reviews in exchange for discounts (violates Google Business Profile guidelines).
2. After completing a successful batch delivery to a local contractor, builder, or homeowner in Kalwa, Pillukhera, or Jind, send a direct WhatsApp message:
   > *"Namaste [Name], thank you for choosing Dhanda Bhatta Company for your brick supply. If you are satisfied with our brick quality and timely delivery, could you kindly take 1 minute to leave us an honest review on Google? [Insert your Google Review Short Link]"*
3. Reply to every review professionally within 48 hours.

---

## 4. Performance & Core Web Vitals Monitoring

Google ranks websites based on three Core Web Vitals thresholds:
- **Largest Contentful Paint (LCP):** Under **2.5 seconds** (time to load the largest visual section).
- **Interaction to Next Paint (INP):** Under **200 milliseconds** (how quickly the site responds to clicks/taps).
- **Cumulative Layout Shift (CLS):** Under **0.1** (stability of elements while loading).

### How to Monitor:
1. **Lab Testing:** Run [Google PageSpeed Insights](https://pagespeed.web.dev/) on your live domain.
2. **Field Data (CrUX):** In Search Console under **Experience > Core Web Vitals**, monitor real-user field data once 28 days of traffic accumulate.

---

## 5. Multi-Lingual (Hindi & English) Roadmap

The current website runs on clean, semantic English with localized Haryana geographical context. If you decide to add dedicated Hindi pages in the future:
1. Never use machine-translated duplicate spam pages.
2. Add a clean route pattern like `/hi/` (e.g. `/hi/about`, `/hi/products`).
3. Maintain reciprocal `<link rel="alternate" hreflang="hi-IN" href="..." />` annotations.
4. Keep the canonical URL pointing to the language-specific version.
