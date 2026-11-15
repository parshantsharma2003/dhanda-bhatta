/**
 * Dhanda Bhatta Company - MongoDB Seed Script
 *
 * Populates MongoDB Atlas with initial verified product catalogue and gallery placeholders.
 * Usage: node scripts/seed.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import { products as initialProducts } from "../src/data/products.js";
import { galleryItems as initialGallery } from "../src/data/gallery.js";

// Load environment variables
dotenv.config({ path: ".env.local" });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || "dhanda_bhatta";
const isProd = process.env.NODE_ENV === "production" || DB_NAME.toLowerCase().includes("prod");
const allowProduction = process.argv.includes("--allow-production");

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in environment. Exiting seed script.");
  process.exit(1);
}

if (isProd && !allowProduction) {
  console.error(
    "⚠️ PRODUCTION SAFETY GUARD: Detected production database namespace (\"" +
      DB_NAME +
      "\"). Running seed scripts against production requires the explicit flag: --allow-production"
  );
  process.exit(1);
}

// Redact credentials for logging
function redact(uri) {
  return uri.replace(/(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@/i, "$1***:***@");
}

async function runSeed() {
  console.log(`🌱 Connecting to MongoDB Atlas (${redact(MONGODB_URI)})...`);

  await mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME,
    serverSelectionTimeoutMS: 8000,
  });

  console.log(`✅ Connected successfully to database: "${mongoose.connection.db.databaseName}"`);

  // Models
  const Product =
    mongoose.models.Product ||
    mongoose.model(
      "Product",
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );

  const GalleryAsset =
    mongoose.models.GalleryAsset ||
    mongoose.model(
      "GalleryAsset",
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );

  // 1. Seed Products
  const existingProductsCount = await Product.countDocuments();
  console.log(`📦 Current products in database: ${existingProductsCount}`);

  if (existingProductsCount === 0) {
    console.log(`Inserting ${initialProducts.length} catalogue products...`);
    const formattedProducts = initialProducts.map((p, idx) => ({
      name: p.name,
      slug: p.slug,
      category: p.category || "Structural Masonry",
      grade: p.name.includes("First Class") ? "Grade A" : "Standard",
      shortDescription: p.shortDescription,
      description: p.description,
      images: (p.images || []).map((img, i) => ({
        url: img.src,
        alt: img.alt,
        caption: img.caption || "",
        isPrimary: i === 0,
      })),
      specifications: p.specifications || [],
      applications: p.applications || [],
      availability: p.availability || "Available for Batch Orders",
      availabilityStatus: "available",
      featured: Boolean(p.featured),
      displayOrder: idx + 1,
      status: "published",
    }));

    await Product.insertMany(formattedProducts);
    console.log(`✅ Successfully seeded ${formattedProducts.length} products.`);
  } else {
    console.log(`ℹ️ Products collection already contains records. Skipping insertion.`);
  }

  // 2. Seed Gallery
  const existingGalleryCount = await GalleryAsset.countDocuments();
  console.log(`🖼️ Current gallery assets in database: ${existingGalleryCount}`);

  if (existingGalleryCount === 0) {
    console.log(`Inserting ${initialGallery.length} gallery assets...`);
    const formattedAssets = initialGallery.map((item, idx) => ({
      title: item.title,
      caption: item.caption,
      category: item.category,
      categoryLabel: item.categoryLabel,
      mediaType: item.type === "video" ? "video" : "image",
      secureUrl: item.mediaSrc,
      thumbnailUrl: item.mediaSrc,
      altText: item.title,
      aspect: item.aspect || "16/9",
      duration: item.duration || null,
      badge: item.badge || null,
      featured: idx < 3,
      displayOrder: idx + 1,
      status: "published",
    }));

    await GalleryAsset.insertMany(formattedAssets);
    console.log(`✅ Successfully seeded ${formattedAssets.length} gallery assets.`);
  } else {
    console.log(`ℹ️ Gallery collection already contains records. Skipping insertion.`);
  }

  console.log("🎉 Seeding complete. Closing connection.");
  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error("❌ Seeding failed with error:", err.message);
  process.exit(1);
});
