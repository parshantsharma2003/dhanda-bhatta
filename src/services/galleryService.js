import "server-only";
import connectToDatabase from "@/lib/db";
import GalleryAsset from "@/models/GalleryAsset";
import { galleryItems as fallbackItems } from "@/data/gallery";

/**
 * Normalizes gallery documents for unified consumption.
 */
function formatGalleryItem(doc) {
  if (!doc) return null;

  return {
    id: doc._id ? doc._id.toString() : doc.id,
    type: doc.mediaType || doc.type || "image",
    category: doc.category,
    categoryLabel: doc.categoryLabel || doc.category,
    title: doc.title,
    caption: doc.caption || "",
    placeholderLabel: doc.placeholderLabel || doc.title,
    mediaSrc: doc.secureUrl || doc.mediaSrc,
    thumbnailUrl: doc.thumbnailUrl || null,
    aspect: doc.aspect || "16/9",
    duration: doc.duration || null,
    badge: doc.badge || null,
    featured: Boolean(doc.featured),
  };
}

/**
 * Retrieves all published gallery media assets.
 * Falls back to verified media placeholders if database is unconfigured or empty.
 */
export async function getPublishedGalleryAssets(options = {}) {
  const { category, mediaType, limit } = options;

  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();

      const query = { status: "published" };
      if (category && category !== "all") {
        query.category = category;
      }
      if (mediaType && mediaType !== "all") {
        query.mediaType = mediaType;
      }

      let mQuery = GalleryAsset.find(query).sort({ displayOrder: 1, createdAt: 1 });
      if (limit && Number(limit) > 0) {
        mQuery = mQuery.limit(Number(limit));
      }

      const dbAssets = await mQuery.lean().exec();

      if (dbAssets && dbAssets.length > 0) {
        return {
          source: "database",
          items: dbAssets.map(formatGalleryItem),
        };
      }
    }
  } catch (error) {
    console.warn(
      `[galleryService] Database lookup unavailable, falling back to static gallery: ${error.message}`
    );
  }

  // Graceful fallback
  let filtered = [...fallbackItems];
  if (category && category !== "all") {
    filtered = filtered.filter(
      (item) => item.category?.toLowerCase() === category.toLowerCase()
    );
  }
  if (mediaType && mediaType !== "all") {
    filtered = filtered.filter(
      (item) => item.type?.toLowerCase() === mediaType.toLowerCase()
    );
  }
  if (limit && Number(limit) > 0) {
    filtered = filtered.slice(0, Number(limit));
  }

  return {
    source: "static_fallback",
    items: filtered.map(formatGalleryItem),
  };
}
