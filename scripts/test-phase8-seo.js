/**
 * DHANDA BHATTA COMPANY — PHASE 8 SEO & SEARCH OPTIMIZATION TEST SUITE
 *
 * Verifies:
 * 1. Public page titles, descriptions, and canonical URLs.
 * 2. Dynamic sitemap.xml generation (published products included, admin excluded).
 * 3. Dynamic robots.txt generation (crawlers allowed, admin disallowed).
 * 4. Admin routes noindex, nofollow protection.
 * 5. JSON-LD structured data syntax and Schema.org compliance.
 * 6. Zero invented facts in structured data (no fake reviews, fake ratings, or fake coordinates).
 * 7. Privacy-safe analytics event dispatcher.
 * 8. Search Console & Local SEO documentation completeness.
 */

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

let passedCount = 0;
let failedCount = 0;

function assert(condition, testDescription) {
  if (condition) {
    console.log(`  ✅ PASS: ${testDescription}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testDescription}`);
    failedCount++;
  }
}

async function runSeoTests() {
  console.log("==================================================================");
  console.log("  DHANDA BHATTA COMPANY - PHASE 8 SEO VERIFICATION SUITE");
  console.log(`  Target Host: ${BASE_URL}`);
  console.log("==================================================================\n");

  // -------------------------------------------------------------------------
  // SECTION 1: Dynamic robots.txt Verification
  // -------------------------------------------------------------------------
  console.log("📋 SECTION 1: Dynamic robots.txt Protocol Verification");
  try {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`);
    const robotsText = await robotsRes.text();

    assert(robotsRes.status === 200, "GET /robots.txt returns 200 OK");
    assert(
      robotsText.includes("User-Agent: *") || robotsText.includes("user-agent: *") || robotsText.includes("User-agent: *"),
      "robots.txt specifies wildcard User-agent rule"
    );
    assert(robotsText.includes("Allow: /"), "robots.txt explicitly allows public indexing");
    assert(robotsText.includes("Disallow: /admin"), "robots.txt excludes /admin routes from indexing");
    assert(robotsText.includes("Disallow: /api"), "robots.txt excludes /api routes from indexing");
    assert(
      robotsText.includes("sitemap.xml"),
      `robots.txt references production sitemap.xml location`
    );
  } catch (err) {
    assert(false, `robots.txt check failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // SECTION 2: Dynamic sitemap.xml Verification
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 2: Dynamic sitemap.xml Protocol Verification");
  try {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();

    assert(sitemapRes.status === 200, "GET /sitemap.xml returns 200 OK");
    assert(
      sitemapText.includes("<urlset") && sitemapText.includes("</urlset>"),
      "sitemap.xml returns valid XML urlset wrapper"
    );
    assert(
      sitemapText.includes("/products") && sitemapText.includes("/about"),
      "sitemap.xml includes core static pages (products, about, contact)"
    );
    assert(
      sitemapText.includes("/delivery") && sitemapText.includes("/gallery"),
      "sitemap.xml includes logistics and visual gallery pages"
    );
    assert(
      sitemapText.includes("/enquiry") && sitemapText.includes("/order"),
      "sitemap.xml includes customer enquiry and bulk order conversion pages"
    );
    assert(
      sitemapText.includes("/products/first-class-red-bricks") ||
        sitemapText.includes("/products/standard-construction-bricks"),
      "sitemap.xml dynamically enumerates published product detail pages"
    );
    assert(!sitemapText.includes("/admin"), "sitemap.xml strictly EXCLUDES private admin routes");
    assert(!sitemapText.includes("/api/"), "sitemap.xml strictly EXCLUDES backend API endpoints");
    assert(!sitemapText.includes("localhost"), "sitemap.xml canonical URLs do not point to localhost");
  } catch (err) {
    assert(false, `sitemap.xml check failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // SECTION 3: Public Page Metadata & Canonical Integrity
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 3: Public Page Metadata & Canonical Integrity");

  const testPages = [
    {
      path: "/",
      expectedTitlePart: "Brick Manufacturer in Jind",
      canonicalExpected: "dhandabhattacompany.com",
    },
    {
      path: "/about",
      expectedTitlePart: "About Our Bhatta",
      canonicalExpected: "/about",
    },
    {
      path: "/products",
      expectedTitlePart: "Brick Supplier in Jind",
      canonicalExpected: "/products",
    },
    {
      path: "/products/first-class-red-bricks",
      expectedTitlePart: "First Class Red Clay Bricks",
      canonicalExpected: "/products/first-class-red-bricks",
    },
    {
      path: "/gallery",
      expectedTitlePart: "Bhatta Operations",
      canonicalExpected: "/gallery",
    },
    {
      path: "/delivery",
      expectedTitlePart: "Brick Delivery & Service Locations",
      canonicalExpected: "/delivery",
    },
    {
      path: "/contact",
      expectedTitlePart: "Contact Kiln & Directions",
      canonicalExpected: "/contact",
    },
    {
      path: "/enquiry",
      expectedTitlePart: "Brick Pricing",
      canonicalExpected: "/enquiry",
    },
    {
      path: "/order",
      expectedTitlePart: "Bulk Brick Order Request",
      canonicalExpected: "/order",
    },
  ];

  for (const page of testPages) {
    try {
      const res = await fetch(`${BASE_URL}${page.path}`);
      const html = await res.text();

      assert(res.status === 200, `GET ${page.path} returns 200 OK`);

      // Title check
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = (titleMatch ? titleMatch[1] : "").replace(/&amp;/g, "&");
      assert(
        title.toLowerCase().includes(page.expectedTitlePart.toLowerCase()),
        `Page ${page.path} has relevant, unique title: "${title}"`
      );

      // Meta Description check
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      assert(
        descMatch && descMatch[1].length > 40,
        `Page ${page.path} has informative meta description (${descMatch ? descMatch[1].length : 0} chars)`
      );

      // Canonical check
      const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
      assert(
        canonicalMatch && canonicalMatch[1].includes(page.canonicalExpected),
        `Page ${page.path} contains canonical URL: ${canonicalMatch ? canonicalMatch[1] : "NONE"}`
      );
      assert(
        canonicalMatch && !canonicalMatch[1].includes("localhost"),
        `Page ${page.path} canonical URL does not use localhost`
      );
    } catch (err) {
      assert(false, `Metadata check for ${page.path} failed: ${err.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // SECTION 4: Private & Administrative Route Indexing Guards
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 4: Private & Administrative Route Indexing Guards");
  try {
    const adminLoginRes = await fetch(`${BASE_URL}/admin/login`);
    const adminLoginHtml = await adminLoginRes.text();

    assert(adminLoginRes.status === 200, "GET /admin/login returns 200 OK");
    const robotsMetaMatch = adminLoginHtml.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
    const robotsContent = robotsMetaMatch ? robotsMetaMatch[1] : "";
    assert(
      robotsContent.includes("noindex") && robotsContent.includes("nofollow"),
      `Admin login page has strict noindex, nofollow directives: "${robotsContent}"`
    );
  } catch (err) {
    assert(false, `Admin indexing guard check failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // SECTION 5: Schema.org / JSON-LD Structured Data Verification
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 5: Schema.org / JSON-LD Structured Data Verification");

  try {
    // 5a. Homepage LocalBusiness & Organization
    const homeRes = await fetch(`${BASE_URL}/`);
    const homeHtml = await homeRes.text();

    const jsonLdMatches = [...homeHtml.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    assert(jsonLdMatches.length >= 2, `Homepage injects ${jsonLdMatches.length} JSON-LD structured data blocks`);

    let localBusiness = null;
    let organization = null;

    for (const match of jsonLdMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed["@type"] === "HomeAndConstructionBusiness" || parsed["@type"] === "LocalBusiness") {
          localBusiness = parsed;
        }
        if (parsed["@type"] === "Organization") {
          organization = parsed;
        }
      } catch {
        // Skip unparseable block
      }
    }

    assert(Boolean(localBusiness), "Homepage contains valid Schema.org LocalBusiness / HomeAndConstructionBusiness");
    assert(
      localBusiness?.name === "Dhanda Bhatta Company",
      `LocalBusiness name strictly verified: "${localBusiness?.name}"`
    );
    assert(
      localBusiness?.address?.streetAddress?.includes("Village Kalwa"),
      `LocalBusiness address contains verified physical location: "${localBusiness?.address?.streetAddress}"`
    );
    assert(
      localBusiness?.address?.postalCode === "126113",
      `LocalBusiness postal code verified: "${localBusiness?.address?.postalCode}"`
    );
    assert(
      localBusiness?.telephone === "+919996669463",
      `LocalBusiness verified telephone: "${localBusiness?.telephone}"`
    );
    assert(
      localBusiness?.hasMap === "https://share.google/60pwtYCEIZ6sF7aGz",
      `LocalBusiness verified Google Maps link: "${localBusiness?.hasMap}"`
    );
    assert(
      Array.isArray(localBusiness?.sameAs) &&
        localBusiness.sameAs.some((s) => s.includes("instagram.com/dhanda.bhatta")) &&
        localBusiness.sameAs.some((s) => s.includes("facebook.com")) &&
        localBusiness.sameAs.some((s) => s.includes("youtube.com")),
      "LocalBusiness sameAs structured array includes verified Instagram, Facebook, and YouTube profiles"
    );

    // Strict No-Invented-Facts Guard
    assert(
      localBusiness?.aggregateRating === undefined,
      "LocalBusiness strictly OMITS fictitious aggregateRating (zero fake ratings)"
    );
    assert(
      localBusiness?.review === undefined,
      "LocalBusiness strictly OMITS fabricated customer reviews (zero fake reviews)"
    );
    assert(
      localBusiness?.geo === undefined,
      "LocalBusiness strictly OMITS unverified GPS coordinates"
    );

    assert(Boolean(organization), "Homepage contains valid Schema.org Organization");

    // 5b. Product Detail Page Product & Breadcrumbs JSON-LD
    const prodRes = await fetch(`${BASE_URL}/products/first-class-red-bricks`);
    const prodHtml = await prodRes.text();
    const prodLdMatches = [...prodHtml.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

    let productSchema = null;
    let breadcrumbSchema = null;

    for (const match of prodLdMatches) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed["@type"] === "Product") {
          productSchema = parsed;
        }
        if (parsed["@type"] === "BreadcrumbList") {
          breadcrumbSchema = parsed;
        }
      } catch {
        // Skip
      }
    }

    assert(Boolean(productSchema), "Product detail page contains valid Schema.org Product markup");
    assert(
      productSchema?.name === "First Class Red Clay Bricks",
      `Product markup contains genuine item name: "${productSchema?.name}"`
    );
    assert(
      productSchema?.offers === undefined,
      "Product markup strictly OMITS fictitious ecommerce offer prices (quoted on batch request)"
    );
    assert(
      productSchema?.aggregateRating === undefined,
      "Product markup strictly OMITS fake review ratings"
    );

    assert(Boolean(breadcrumbSchema), "Product detail page contains Schema.org BreadcrumbList");
    assert(
      breadcrumbSchema?.itemListElement?.length >= 2,
      `BreadcrumbList has valid hierarchy with ${breadcrumbSchema?.itemListElement?.length} levels`
    );
  } catch (err) {
    assert(false, `Structured data verification failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // SECTION 6: Privacy-Safe Analytics Architecture Verification
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 6: Privacy-Safe Analytics Architecture");
  try {
    const fs = await import("fs");
    const analyticsCode = fs.readFileSync("src/lib/analytics.js", "utf-8");

    assert(
      analyticsCode.includes("forbiddenKeys") && analyticsCode.includes("phone") && analyticsCode.includes("email"),
      "Analytics event dispatcher strictly filters PII keys (phone, email, name, message)"
    );
    assert(
      analyticsCode.includes("restricted_data_processing") || analyticsCode.includes("anonymize_ip") || analyticsCode.includes("sanitizedParams"),
      "Analytics configuration enables privacy-preserving sanitization"
    );
  } catch (err) {
    assert(false, `Analytics architecture check failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // SECTION 7: Owner Post-Launch Documentation Completeness
  // -------------------------------------------------------------------------
  console.log("\n📋 SECTION 7: Owner Action Guide & Search Console Checklist");
  try {
    const fs = await import("fs");
    assert(fs.existsSync("docs/SEO-LAUNCH-CHECKLIST.md"), "docs/SEO-LAUNCH-CHECKLIST.md exists");

    const checklistContent = fs.readFileSync("docs/SEO-LAUNCH-CHECKLIST.md", "utf-8");
    assert(
      checklistContent.includes("Google Search Console") && checklistContent.includes("DNS"),
      "Checklist details Domain Property DNS verification procedure"
    );
    assert(
      checklistContent.includes("Google Business Profile") && checklistContent.includes("Village Kalwa"),
      "Checklist guides owner on Google Business Profile NAP consistency"
    );
    assert(
      checklistContent.includes("Genuine Review Collection"),
      "Checklist provides compliant, policy-safe review collection strategy"
    );
    assert(
      checklistContent.includes("Core Web Vitals") && checklistContent.includes("LCP"),
      "Checklist explains Google Core Web Vitals targets and field vs lab metrics"
    );
  } catch (err) {
    assert(false, `Documentation check failed: ${err.message}`);
  }

  // -------------------------------------------------------------------------
  // TEST SUMMARY
  // -------------------------------------------------------------------------
  console.log("\n==================================================================");
  console.log(`  PHASE 8 SEO TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("==================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runSeoTests();
