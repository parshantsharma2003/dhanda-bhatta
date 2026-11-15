import "server-only";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import { products as fallbackProducts } from "@/data/products";

/**
 * Normalizes a product document from MongoDB or fallback data into a uniform representation.
 */
function formatProduct(doc) {
  if (!doc) return null;

  return {
    id: doc._id ? doc._id.toString() : doc.id,
    name: doc.name,
    slug: doc.slug,
    category: doc.category || "Structural Masonry",
    grade: doc.grade || "",
    shortDescription: doc.shortDescription,
    description: doc.description,
    images: (doc.images || []).map((img) => ({
      src: img.url || img.src,
      alt: img.alt,
      caption: img.caption || "",
      isPrimary: Boolean(img.isPrimary),
      isPlaceholder: Boolean(img.isPlaceholder),
    })),
    specifications: doc.specifications || [],
    applications: doc.applications || [],
    availability: doc.availability || "Available for Batch Orders",
    availabilityStatus: doc.availabilityStatus || "available",
    featured: Boolean(doc.featured),
    published: doc.status ? doc.status === "published" : Boolean(doc.published),
  };
}

/**
 * Retrieves all published products.
 * Seamlessly falls back to local data if MongoDB is unconfigured or empty.
 */
export async function getPublishedProducts(options = {}) {
  const { category, featured, limit } = options;

  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();

      const query = { status: "published" };
      if (category && category !== "all") {
        query.category = category;
      }
      if (typeof featured === "boolean") {
        query.featured = featured;
      }

      let mQuery = Product.find(query).sort({ displayOrder: 1, createdAt: 1 });
      if (limit && Number(limit) > 0) {
        mQuery = mQuery.limit(Number(limit));
      }

      const dbProducts = await mQuery.lean().exec();

      if (dbProducts && dbProducts.length > 0) {
        return {
          source: "database",
          products: dbProducts.map(formatProduct),
        };
      }
    }
  } catch (error) {
    console.warn(
      `[productService] Database lookup unavailable, falling back to static products: ${error.message}`
    );
  }

  // Graceful fallback to verified static catalogue
  let filtered = [...fallbackProducts];
  if (category && category !== "all") {
    filtered = filtered.filter(
      (p) => p.category?.toLowerCase() === category.toLowerCase()
    );
  }
  if (typeof featured === "boolean") {
    filtered = filtered.filter((p) => Boolean(p.featured) === featured);
  }
  if (limit && Number(limit) > 0) {
    filtered = filtered.slice(0, Number(limit));
  }

  return {
    source: "static_fallback",
    products: filtered.map(formatProduct),
  };
}

/**
 * Retrieves a single published product by its slug.
 */
export async function getProductBySlug(slug) {
  if (!slug) return null;

  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const product = await Product.findOne({
        slug: slug.toLowerCase(),
        status: "published",
      })
        .lean()
        .exec();

      if (product) {
        return {
          source: "database",
          product: formatProduct(product),
        };
      }
    }
  } catch (error) {
    console.warn(
      `[productService] Database lookup for slug "${slug}" unavailable, falling back: ${error.message}`
    );
  }

  // Fallback to static catalogue
  const fallback = fallbackProducts.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase()
  );

  if (fallback) {
    return {
      source: "static_fallback",
      product: formatProduct(fallback),
    };
  }

  return null;
}
