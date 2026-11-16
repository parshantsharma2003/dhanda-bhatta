import mongoose from "mongoose";

const SiteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Content key is required"],
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
      index: true,
    },
    publishedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    draftData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
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

SiteContentSchema.index({ key: 1, status: 1 });

const SiteContent =
  mongoose.models.SiteContent || mongoose.model("SiteContent", SiteContentSchema);

export default SiteContent;
