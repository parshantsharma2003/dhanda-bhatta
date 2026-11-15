import { getSiteUrl } from "@/lib/seo";

/**
 * Dynamic Next.js Robots Generator (src/app/robots.js)
 * Adheres strictly to Google Search Essentials:
 * - Allows crawling of all public marketing, product, and information pages.
 * - Disallows indexing of admin panels and backend API endpoints.
 * - Points crawlers to the canonical sitemap.xml.
 */
export default function robots() {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
