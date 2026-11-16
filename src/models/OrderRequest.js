import mongoose from "mongoose";

const DeliveryLocationSchema = new mongoose.Schema(
  {
    villageOrCity: {
      type: String,
      required: [true, "Village or city is required"],
      trim: true,
      maxlength: 100,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
      maxlength: 80,
    },
    state: {
      type: String,
      default: "Haryana",
      trim: true,
      maxlength: 80,
    },
    pincode: {
      type: String,
      trim: true,
      maxlength: 10,
      default: null,
    },
  },
  { _id: false }
);

const QuotationSchema = new mongoose.Schema(
  {
    estimatedTotal: { type: Number, default: null },
    unitRate: { type: Number, default: null },
    vehicleHaulageRate: { type: Number, default: null },
    quotedAt: { type: Date, default: null },
    quotedBy: { type: String, default: null },
    notes: { type: String, trim: true, default: null },
  },
  { _id: false }
);

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

const OrderRequestSchema = new mongoose.Schema(
  {
    orderReference: {
      type: String,
      required: [true, "Order reference is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: [2, "Customer name must have at least 2 characters"],
      maxlength: [100, "Customer name cannot exceed 100 characters"],
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
    selectedProduct: {
      type: String,
      required: [true, "Product selection is required"],
      trim: true,
    },
    productSnapshot: {
      name: { type: String, default: null },
      category: { type: String, default: null },
      grade: { type: String, default: null },
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    productInstructions: {
      type: String,
      trim: true,
      maxlength: [1000, "Product instructions cannot exceed 1000 characters"],
      default: null,
    },
    deliveryLocation: {
      type: DeliveryLocationSchema,
      required: [true, "Delivery location is required"],
    },
    expectedDeliveryDate: {
      type: String,
      trim: true,
      default: null,
    },
    deliveryInstructions: {
      type: String,
      trim: true,
      maxlength: [1000, "Delivery instructions cannot exceed 1000 characters"],
      default: null,
    },
    isRequestOnly: {
      type: Boolean,
      default: true,
    },
    consent: {
      type: Boolean,
      required: [true, "Consent confirmation is required"],
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
        "pending_review",
        "contacted",
        "quoted",
        "quote_provided",
        "confirmed",
        "preparing",
        "dispatched",
        "delivered",
        "cancelled",
        "archived",
      ],
      default: "new",
      index: true,
    },
    quotation: {
      type: QuotationSchema,
      default: () => ({}),
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

OrderRequestSchema.index({ normalizedPhone: 1, createdAt: -1 });
OrderRequestSchema.index({ status: 1, createdAt: -1 });
OrderRequestSchema.index({ isArchived: 1, createdAt: -1 });
OrderRequestSchema.index({ isArchived: 1, status: 1 });

const OrderRequest =
  mongoose.models.OrderRequest || mongoose.model("OrderRequest", OrderRequestSchema);

export default OrderRequest;
