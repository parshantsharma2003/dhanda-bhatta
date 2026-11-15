import "server-only";
import connectToDatabase from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { enquirySchema } from "@/lib/validation/enquirySchema";
import { normalizeIndianPhone } from "@/lib/validation/phoneUtils";
import { generateEnquiryReference } from "@/lib/reference";

/**
 * Creates and persists a customer enquiry.
 *
 * @param {Object} rawData Untrusted form input from client
 * @param {Object} clientInfo Derived client metadata (ipHash, userAgent)
 * @returns {Promise<Object>} Safe public result containing public reference
 */
export async function createEnquiry(rawData, clientInfo = {}) {
  // 1. Zod Schema Validation
  const validationResult = enquirySchema.safeParse(rawData);
  if (!validationResult.success) {
    const errorDetails = validationResult.error.flatten().fieldErrors;
    const error = new Error("Validation failed for enquiry data");
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
  const enquiryReference = generateEnquiryReference();
  let isPersisted = false;

  // 3. Database Persistence & Duplicate Check
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();

      // Check for duplicate submission within the past 2 minutes
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const duplicate = await Enquiry.findOne({
        normalizedPhone,
        message: data.message.trim(),
        createdAt: { $gte: twoMinutesAgo },
      }).lean();

      if (duplicate) {
        // Return existing reference to prevent spamming duplicate records
        return {
          success: true,
          reference: duplicate.enquiryReference,
          message:
            "A matching enquiry was recently submitted. Our dispatch desk has already received your request.",
          submittedAt: duplicate.createdAt.toISOString(),
          isDuplicate: true,
          isPersisted: true,
        };
      }

      // Create new enquiry document
      await Enquiry.create({
        enquiryReference,
        fullName: data.fullName.trim(),
        phone: data.phoneNumber.trim(),
        normalizedPhone,
        email: data.email?.trim() || null,
        enquiryType: data.enquiryType,
        interestedProduct: data.interestedProduct?.trim() || null,
        message: data.message.trim(),
        preferredContactMethod: data.preferredContactMethod || "Phone",
        consent: true,
        consentAt: new Date(),
        privacyNoticeVersion: "1.0",
        status: "new",
        ipHash: clientInfo.ipHash || null,
        userAgent: clientInfo.userAgent || null,
      });

      isPersisted = true;
    } catch (dbError) {
      console.error("[enquiryService] Failed to persist enquiry to MongoDB:", dbError.message);
      // In development or when DB is temporarily unreachable, still generate reference
      // so user experience is uninterrupted and direct WhatsApp/Phone actions can proceed
    }
  }

  return {
    success: true,
    reference: enquiryReference,
    message:
      "Thank you! Your enquiry has been received. Our dispatch desk will review your requirements and reach out.",
    submittedAt: new Date().toISOString(),
    isPersisted,
  };
}
