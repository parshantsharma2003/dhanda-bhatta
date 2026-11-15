import mongoose from "mongoose";

const InternalNoteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    adminId: { type: String, required: true },
    adminName: { type: String, default: "Admin" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ActivityTimelineSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    previousStatus: { type: String, default: null },
    newStatus: { type: String, default: null },
    adminId: { type: String, default: null },
    adminName: { type: String, default: null },
    note: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const EnquirySchema = new mongoose.Schema(
  {
    enquiryReference: {
      type: String,
      required: [true, "Enquiry reference is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must have at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    normalizedPhone: {
      type: String,
      required: [true, "Normalized phone number is required"],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    enquiryType: {
      type: String,
      required: [true, "Enquiry category is required"],
      trim: true,
    },
    interestedProduct: {
      type: String,
      trim: true,
      default: null,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    preferredContactMethod: {
      type: String,
      enum: ["Phone", "WhatsApp"],
      default: "Phone",
    },
    consent: {
      type: Boolean,
      required: [true, "Consent is required"],
      validate: {
        validator: (v) => v === true,
        message: "Consent confirmation is mandatory",
      },
    },
    consentAt: {
      type: Date,
      default: Date.now,
    },
    privacyNoticeVersion: {
      type: String,
      default: "1.0",
    },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "quoted",
        "closed",
        "spam",
        "in_progress",
        "resolved",
        "archived",
      ],
      default: "new",
      index: true,
    },
    internalNotes: {
      type: [InternalNoteSchema],
      default: [],
    },
    timeline: {
      type: [ActivityTimelineSchema],
      default: [],
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    ipHash: {
      type: String,
      index: true,
    },
    userAgent: {
      type: String,
      maxlength: 250,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for querying recent enquiries by normalized phone or status
EnquirySchema.index({ normalizedPhone: 1, createdAt: -1 });
EnquirySchema.index({ status: 1, createdAt: -1 });
EnquirySchema.index({ isArchived: 1, createdAt: -1 });

const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);

export default Enquiry;
