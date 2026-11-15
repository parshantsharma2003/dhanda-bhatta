import mongoose from "mongoose";

const ProductImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, required: true, trim: true },
    caption: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductSpecificationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [120, "Product name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: "Structural Masonry",
      index: true,
    },
    grade: {
      type: String,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    description: {
      type: String,
      required: [true, "Full description is required"],
      trim: true,
    },
    images: {
      type: [ProductImageSchema],
      default: [],
    },
    specifications: {
      type: [ProductSpecificationSchema],
      default: [],
    },
    applications: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      trim: true,
      default: "Available for Batch Orders",
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "low_stock", "out_of_stock", "made_to_order"],
      default: "available",
      index: true,
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
      enum: ["published", "draft", "archived"],
      default: "published",
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    seo: {
      title: { type: String, trim: true, default: "" },
      description: { type: String, trim: true, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for queries
ProductSchema.index({ status: 1, displayOrder: 1 });
ProductSchema.index({ status: 1, featured: 1 });
ProductSchema.index({ isArchived: 1, status: 1 });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
