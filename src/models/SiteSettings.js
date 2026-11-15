import mongoose from "mongoose";

const SiteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "general",
      index: true,
    },
    business: {
      name: { type: String, default: "Dhanda Bhatta Company" },
      description: {
        type: String,
        default: "Leading brick manufacturing and supply facility based in Village Kalwa, Jind, Haryana.",
      },
      address: {
        type: String,
        default: "Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana 126113",
      },
      phone: { type: String, default: "+919996669463" },
      phoneDisplay: { type: String, default: "+91 99966-69463" },
      whatsappNumber: { type: String, default: "918295669463" },
      email: { type: String, default: "contact@dhandabhatta.com" },
      googleMapsUrl: {
        type: String,
        default: "https://share.google/60pwtYCEIZ6sF7aGz",
      },
      embeddedMapUrl: { type: String, default: "" },
      logoUrl: { type: String, default: "" },
      openingHours: { type: String, default: "Mon - Sat: 7:00 AM - 7:00 PM (IST)" },
      deliveryAvailabilityMessage: {
        type: String,
        default: "Delivery available across Jind, Safidon, Panipat, Assandh, and nearby Haryana districts.",
      },
      serviceableLocations: {
        type: [String],
        default: ["Jind", "Pillukhera", "Safidon", "Panipat", "Assandh", "Gohana", "Rohtak", "Kaithal"],
      },
    },
    social: {
      facebook: { type: String, default: "https://www.facebook.com/share/1Js74GJbZ8/" },
      instagram: { type: String, default: "https://www.instagram.com/dhanda.bhatta?srtk=dXBjZmhmdzAwM3U4" },
      youtube: { type: String, default: "https://www.youtube.com/@dhandabhattacompany" },
    },
    delivery: {
      zones: {
        type: [
          {
            name: String,
            district: String,
            maxDistanceKm: Number,
            minOrderQuantity: Number,
            estimatedDays: String,
          },
        ],
        default: [
          {
            name: "Zone 1 (Local Kalwa & Pillukhera)",
            district: "Jind",
            maxDistanceKm: 15,
            minOrderQuantity: 1000,
            estimatedDays: "Same day to 24 hours",
          },
          {
            name: "Zone 2 (Safidon, Assandh & Jind Town)",
            district: "Jind / Karnal",
            maxDistanceKm: 35,
            minOrderQuantity: 3000,
            estimatedDays: "24 to 48 hours",
          },
          {
            name: "Zone 3 (Panipat & Gohana Outer Belt)",
            district: "Panipat / Sonipat",
            maxDistanceKm: 60,
            minOrderQuantity: 5000,
            estimatedDays: "2 to 3 days",
          },
        ],
      },
      vehicleTypes: {
        type: [String],
        default: [
          "Tractor Trolley (3,000 - 4,000 bricks)",
          "Medium Commercial Truck (6,000 - 8,000 bricks)",
          "Heavy Multi-Axle Hauler (12,000 - 16,000 bricks)",
        ],
      },
      unloadingNotice: {
        type: String,
        default: "Standard delivery quote includes truck transport to motorable road. Site unloading requires manual labour or mechanical tipper arrangements.",
      },
    },
    seo: {
      defaultTitle: {
        type: String,
        default: "Dhanda Bhatta Company | Premium Red Clay Bricks | Kalwa, Jind",
      },
      defaultDescription: {
        type: String,
        default: "Dhanda Bhatta Company manufactures premium red clay bricks in Village Kalwa, Pillukhera, Jind, Haryana. Reliable brick supply with delivery across nearby areas.",
      },
      defaultOgImage: { type: String, default: "/images/hero.jpg" },
      robotsIndexing: { type: Boolean, default: true },
    },
    updatedBy: {
      type: String,
      default: "System",
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
