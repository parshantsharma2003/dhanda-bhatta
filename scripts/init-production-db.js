/**
 * Dhanda Bhatta Company - Production Database Initialization & Health Verification
 *
 * Idempotent, non-destructive script to verify and initialize production database schemas,
 * create performance indexes, and seed verified business content without test records.
 *
 * Usage:
 *   node scripts/init-production-db.js
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import { products as initialProducts } from "../src/data/products.js";
import { galleryItems as initialGallery } from "../src/data/gallery.js";
import { BUSINESS_INFO } from "../src/lib/seo.js";

dotenv.config({ path: ".env.production.local" });
dotenv.config({ path: ".env.local" });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || "dhanda_bhatta_prod";

function redact(uri) {
  if (!uri) return "[NOT_SET]";
  return uri.replace(/(mongodb(\+srv)?:\/\/)([^:]+):([^@]+)@/i, "$1***:***@");
}

async function initializeProductionDb() {
  console.log("==================================================================");
  console.log("  DHANDA BHATTA COMPANY — PRODUCTION DATABASE INITIALIZATION");
  console.log("==================================================================");
  console.log(`Target Database:  ${DB_NAME}`);
  console.log(`Cluster URI:      ${redact(MONGODB_URI)}\n`);

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not configured. Provide it in environment variables.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB Atlas with TLS...");
  await mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  const db = mongoose.connection.db;
  console.log(`✅ Connected successfully to "${db.databaseName}".\n`);

  // Helper for safe idempotent index creation
  async function safeCreateIndex(collection, spec, options = {}) {
    try {
      await collection.createIndex(spec, options);
    } catch (err) {
      if (err.code === 85 || err.codeName === "IndexOptionsConflict") {
        // Index already exists with equivalent key specifications
        return;
      }
      throw err;
    }
  }

  // 1. Ensure Indexes on Collections
  console.log("🔧 Verifying & creating production indexes...");

  // Products
  await safeCreateIndex(db.collection("products"), { slug: 1 }, { unique: true, background: true });
  await safeCreateIndex(db.collection("products"), { status: 1, displayOrder: 1 }, { background: true });
  await safeCreateIndex(db.collection("products"), { status: 1, featured: 1 }, { background: true });

  // Enquiries
  await safeCreateIndex(db.collection("enquiries"), { enquiryReference: 1 }, { unique: true, background: true });
  await safeCreateIndex(db.collection("enquiries"), { normalizedPhone: 1, createdAt: -1 }, { background: true });
  await safeCreateIndex(db.collection("enquiries"), { status: 1, createdAt: -1 }, { background: true });

  // Order Requests
  await safeCreateIndex(db.collection("orderrequests"), { orderReference: 1 }, { unique: true, background: true });
  await safeCreateIndex(db.collection("orderrequests"), { normalizedPhone: 1, createdAt: -1 }, { background: true });
  await safeCreateIndex(db.collection("orderrequests"), { status: 1, createdAt: -1 }, { background: true });

  // Gallery
  await safeCreateIndex(db.collection("galleryassets"), { status: 1, displayOrder: 1 }, { background: true });
  await safeCreateIndex(db.collection("galleryassets"), { category: 1 }, { background: true });

  // Security Audit Log
  await safeCreateIndex(db.collection("securityauditlogs"), { eventType: 1, createdAt: -1 }, { background: true });
  await safeCreateIndex(db.collection("securityauditlogs"), { adminId: 1, createdAt: -1 }, { background: true });

  // Site Settings & Content
  await safeCreateIndex(db.collection("sitesettings"), { key: 1 }, { unique: true, background: true });
  await safeCreateIndex(db.collection("sitecontents"), { key: 1 }, { unique: true, background: true });

  // Better Auth Core Collections
  await safeCreateIndex(db.collection("user"), { email: 1 }, { unique: true, background: true });
  await safeCreateIndex(db.collection("session"), { token: 1 }, { unique: true, background: true });
  await safeCreateIndex(db.collection("account"), { providerId: 1, accountId: 1 }, { background: true });

  console.log("✅ All production indexes verified and created.\n");

  // 2. Ensure Verified Site Settings exist
  console.log("📋 Verifying production site settings...");
  const settingsColl = db.collection("sitesettings");
  const existingSettings = await settingsColl.findOne({ key: "general" });

  if (!existingSettings) {
    console.log("Inserting verified site settings from official business records...");
    await settingsColl.insertOne({
      key: "general",
      businessName: BUSINESS_INFO.name,
      tagline: "Brick Manufacturer & Supplier in Jind, Haryana",
      description: BUSINESS_INFO.description,
      address: {
        street: BUSINESS_INFO.address.streetAddress,
        village: "Kalwa",
        tehsil: "Pillukhera",
        district: "Jind",
        state: "Haryana",
        pincode: BUSINESS_INFO.address.postalCode,
        landmark: "Near Dharoli Gausala",
      },
      contact: {
        primaryPhone: BUSINESS_INFO.telephone,
        secondaryPhone: "",
        whatsappNumber: "918295669463",
        email: "contact@dhandabhattacompany.com",
        isPlaceholder: false,
      },
      location: {
        directionsUrl: BUSINESS_INFO.mapsUrl,
        embeddedMapUrl: "",
        kilnCoordinates: "",
      },
      socialLinks: {
        instagram: "https://www.instagram.com/dhanda.bhatta?srtk=dXBjZmhmdzAwM3U4",
        facebook: "https://www.facebook.com/share/1Js74GJbZ8/",
        youtube: "https://www.youtube.com/@dhandabhattacompany",
        linkedin: "",
        twitter: "",
      },
      operatingHours: {
        weekdays: "6:00 AM – 7:00 PM",
        weekends: "6:00 AM – 7:00 PM",
        note: "Kiln firing operates 24/7 during seasonal production",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Verified site settings initialized.");
  } else {
    console.log("ℹ️ Site settings already exist. Preserving existing values.");
  }

  // 3. Seed Catalogue Products if Empty (Non-destructive)
  const productColl = db.collection("products");
  const prodCount = await productColl.countDocuments();
  if (prodCount === 0) {
    console.log(`\n📦 Initializing ${initialProducts.length} verified catalogue products...`);
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await productColl.insertMany(formattedProducts);
    console.log(`✅ Seeded ${formattedProducts.length} verified catalogue products.`);
  } else {
    console.log(`\nℹ️ Found ${prodCount} existing products. Preserving catalogue.`);
  }

  // 4. Seed Gallery Assets if Empty
  const galleryColl = db.collection("galleryassets");
  const galleryCount = await galleryColl.countDocuments();
  if (galleryCount === 0) {
    console.log(`\n🖼️ Initializing ${initialGallery.length} verified kiln gallery items...`);
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await galleryColl.insertMany(formattedAssets);
    console.log(`✅ Seeded ${formattedAssets.length} verified gallery assets.`);
  } else {
    console.log(`\nℹ️ Found ${galleryCount} existing gallery assets. Preserving media.`);
  }

  // 5. Check Admin User Status
  const userColl = db.collection("user");
  const adminUser = await userColl.findOne({ role: "admin" });
  console.log("\n👤 Admin Account Status:");
  if (adminUser) {
    console.log(`   Admin configured: "${adminUser.email}"`);
    console.log(`   2FA Enrolled:     ${adminUser.twoFactorEnabled ? "Yes (Enforced)" : "Pending (Will enforce on login)"}`);
  } else {
    console.log("   ⚠️ No administrator account found in this database.");
    console.log("   👉 Run: npm run admin:create -- --email=\"owner@yourdomain.com\" --password=\"YourStrongPass123!\"");
  }

  console.log("\n==================================================================");
  console.log("  PRODUCTION DATABASE VERIFICATION COMPLETE");
  console.log("==================================================================");

  await mongoose.disconnect();
}

initializeProductionDb().catch((err) => {
  console.error("❌ Initialization failed:", err);
  process.exit(1);
});
