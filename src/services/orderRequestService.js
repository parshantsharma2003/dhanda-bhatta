import "server-only";
import connectToDatabase from "@/lib/db";
import OrderRequest from "@/models/OrderRequest";
import { orderSchema } from "@/lib/validation/orderSchema";
import { normalizeIndianPhone } from "@/lib/validation/phoneUtils";
import { generateOrderReference } from "@/lib/reference";

/**
 * Creates and persists a customer bulk order request.
 * Clarifies this is an enquiry for quotation and stock dispatch, not a confirmed monetary transaction.
 *
 * @param {Object} rawData Untrusted form input from client
 * @param {Object} clientInfo Derived client metadata (ipHash, userAgent)
 * @returns {Promise<Object>} Safe public result containing public reference
 */
export async function createOrderRequest(rawData, clientInfo = {}) {
  // 1. Zod Schema Validation
  const validationResult = orderSchema.safeParse(rawData);
  if (!validationResult.success) {
    const errorDetails = validationResult.error.flatten().fieldErrors;
    const error = new Error("Validation failed for order request data");
    error.status = 400;
    error.details = errorDetails;
    throw error;
  }

  const data = validationResult.data;

  // 2. Honeypot Anti-Spam Check
  if (data.website_hp && data.website_hp.trim().length > 0) {
    const spamError = new Error("Invalid submission rejected");
    spamError.status = 400;
    throw spamError;
  }

  const normalizedPhone = normalizeIndianPhone(data.phoneNumber);
  const orderReference = generateOrderReference();
  let isPersisted = false;

  // 3. Database Persistence & Duplicate Check
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();

      // Check for duplicate submission within the past 2 minutes
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const duplicate = await OrderRequest.findOne({
        normalizedPhone,
        selectedProduct: data.selectedProduct,
        quantity: Number(data.quantity),
        createdAt: { $gte: twoMinutesAgo },
      }).lean();

      if (duplicate) {
        return {
          success: true,
          reference: duplicate.orderReference,
          message:
            "A matching order request was recently submitted. Our dispatch team is reviewing your requirements.",
          submittedAt: duplicate.createdAt.toISOString(),
          isDuplicate: true,
          isPersisted: true,
          isRequestOnly: true,
        };
      }

      // Create new order request document
      await OrderRequest.create({
        orderReference,
        customerName: data.customerName.trim(),
        phone: data.phoneNumber.trim(),
        normalizedPhone,
        email: data.email?.trim() || null,
        selectedProduct: data.selectedProduct.trim(),
        quantity: Number(data.quantity),
        productInstructions: data.productInstructions?.trim() || null,
        deliveryLocation: {
          villageOrCity: data.villageOrCity.trim(),
          district: data.district.trim(),
          state: data.state?.trim() || "Haryana",
          pincode: data.pincode?.trim() || null,
        },
        expectedDeliveryDate: data.expectedDeliveryDate?.trim() || null,
        deliveryInstructions: data.deliveryInstructions?.trim() || null,
        isRequestOnly: true,
        consent: true,
        consentAt: new Date(),
        privacyNoticeVersion: "1.0",
        status: "pending_review",
        ipHash: clientInfo.ipHash || null,
        userAgent: clientInfo.userAgent || null,
      });

      isPersisted = true;
    } catch (dbError) {
      console.error("[orderRequestService] Failed to persist order request to MongoDB:", dbError.message);
    }
  }

  return {
    success: true,
    reference: orderReference,
    message:
      "Your brick order request has been received! Our dispatch desk will calculate vehicle logistics and provide confirmed pricing.",
    submittedAt: new Date().toISOString(),
    isPersisted,
    isRequestOnly: true,
  };
}
