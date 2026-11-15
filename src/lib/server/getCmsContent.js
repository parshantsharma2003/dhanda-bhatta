import "server-only";
import connectToDatabase from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import SiteSettings from "@/models/SiteSettings";

/**
 * Retrieves published CMS data for a given page key.
 * Safely falls back to null if no custom published data exists.
 *
 * @param {string} key Key identifier e.g. "homepage", "about", "faqs"
 * @returns {Promise<Object|null>}
 */
export async function getCmsContent(key) {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const doc = await SiteContent.findOne({ key, status: "published" }).lean();
      if (doc?.publishedData && Object.keys(doc.publishedData).length > 0) {
        return JSON.parse(JSON.stringify(doc.publishedData));
      }
    }
  } catch (err) {
    console.warn(`[getCmsContent] Fallback used for ${key}:`, err.message);
  }
  return null;
}

/**
 * Retrieves the singleton global site settings.
 * Safely falls back to null if database record does not exist.
 *
 * @returns {Promise<Object|null>}
 */
export async function getGlobalSiteSettings() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const doc = await SiteSettings.findOne({ key: "general" }).lean();
      if (doc) {
        return JSON.parse(JSON.stringify(doc));
      }
    }
  } catch (err) {
    console.warn("[getGlobalSiteSettings] Fallback used:", err.message);
  }
  return null;
}
