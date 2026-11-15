import mongoose from "mongoose";

const SecurityAuditLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: [true, "Audit event type is required"],
      enum: [
        "ADMIN_LOGIN_SUCCESS",
        "ADMIN_LOGIN_FAILURE",
        "ADMIN_LOGOUT",
        "TWO_FACTOR_ENROLLED",
        "TWO_FACTOR_SUCCESS",
        "TWO_FACTOR_FAILURE",
        "RECOVERY_CODE_SUCCESS",
        "RECOVERY_CODE_FAILURE",
        "PASSWORD_CHANGED",
        "SESSION_REVOKED",
        "UNAUTHORIZED_ADMIN_ACCESS",
        "RATE_LIMIT_TRIGGERED",
        "GALLERY_CREATED",
        "GALLERY_UPDATED",
        "GALLERY_DELETED",
        "PRODUCT_CREATED",
        "PRODUCT_UPDATED",
        "PRODUCT_DELETED",
        "ENQUIRY_STATUS_UPDATED",
        "ORDER_STATUS_UPDATED",
        "SETTINGS_UPDATED",
      ],
      index: true,
    },
    adminId: {
      type: String,
      default: null,
      index: true,
    },
    adminEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    outcome: {
      type: String,
      enum: ["SUCCESS", "FAILURE", "BLOCKED"],
      required: true,
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
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

SecurityAuditLogSchema.index({ eventType: 1, createdAt: -1 });
SecurityAuditLogSchema.index({ adminId: 1, createdAt: -1 });

const SecurityAuditLog =
  mongoose.models.SecurityAuditLog ||
  mongoose.model("SecurityAuditLog", SecurityAuditLogSchema);

export default SecurityAuditLog;
