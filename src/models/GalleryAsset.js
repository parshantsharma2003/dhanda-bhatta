import mongoose from "mongoose";

const GalleryAssetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Asset title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [300, "Caption cannot exceed 300 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    categoryLabel: {
      type: String,
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
      index: true,
    },
    secureUrl: {
      type: String,
      required: [true, "Media URL is required"],
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      required: [true, "Alt text is required for accessibility"],
      trim: true,
    },
    aspect: {
      type: String,
      default: "16/9",
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    badge: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ["published", "archived"],
      default: "published",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

GalleryAssetSchema.index({ status: 1, category: 1, displayOrder: 1 });

const GalleryAsset =
  mongoose.models.GalleryAsset || mongoose.model("GalleryAsset", GalleryAssetSchema);

export default GalleryAsset;
