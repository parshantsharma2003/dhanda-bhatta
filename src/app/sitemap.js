import { getSiteUrl } from "@/lib/seo";
import { getPublishedProducts } from "@/services/productService";

// Cache sitemap and revalidate once every 24 hours
export const revalidate = 86400;

/**
 * Dynamic Next.js Sitemap Generator (src/app/sitemap.js)
 * Adheres strictly to Google Search Essentials:
 * - Emits clean canonical URLs using the configured production SITE_URL.
 * - Dynamically includes only active, published products (no drafts or archived items).
 * - Excludes admin routes, private authentication routes, and internal API endpoints.
 * - Derives lastModified from actual content revision timestamps.
 */
export default async function sitemap() {
  const siteUrl = getSiteUrl();
  const buildDate = new Date();

  // 1. Core Public Static Pages
  const staticRoutes = [
    {
      url: `${siteUrl}`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: buildDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/delivery`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/gallery`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/enquiry`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/order`,
      lastModified: buildDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. Dynamic Published Products (Excluding drafts, archived, or unpublished items)
  let productRoutes = [];
  try {
    const { products } = await getPublishedProducts();
    if (Array.isArray(products)) {
      productRoutes = products
        .filter((product) => product && product.slug && product.published !== false)
        .map((product) => ({
          url: `${siteUrl}/products/${product.slug}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : buildDate,
          changeFrequency: "weekly",
          priority: 0.8,
        }));
    }
  } catch (error) {
    console.warn(`[sitemap] Failed to fetch dynamic products for sitemap: ${error.message}`);
  }

  return [...staticRoutes, ...productRoutes];
}
