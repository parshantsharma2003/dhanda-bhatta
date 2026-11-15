import { z } from "zod";
import { isValidIndianMobile, normalizeIndianPhone } from "./phoneUtils.js";

export const ENQUIRY_TYPES = [
  "Product availability",
  "Brick pricing",
  "Bulk order",
  "Delivery information",
  "General enquiry",
  "Other",
];

export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Please enter your full name (minimum 2 characters)" })
    .max(100, { message: "Name must not exceed 100 characters" }),

  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: "Please enter your mobile phone number" })
    .refine((val) => isValidIndianMobile(val), {
      message: "Please enter a valid 10-digit Indian mobile number (e.g. 98123 45678 or +91 9812345678)",
    }),

  email: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Please enter a valid email address (e.g. name@example.com)",
    }),

  enquiryType: z
    .string({ required_error: "Please select an enquiry category" })
    .refine((val) => ENQUIRY_TYPES.includes(val), {
      message: "Please select a valid enquiry category from the list",
    }),

  interestedProduct: z.string().trim().optional(),

  message: z
    .string()
    .trim()
    .min(10, { message: "Please provide your question or requirement (minimum 10 characters)" })
    .max(1500, { message: "Message cannot exceed 1500 characters" }),

  preferredContactMethod: z.enum(["Phone", "WhatsApp"], {
    required_error: "Please select your preferred contact method",
  }),

  consent: z.literal(true, {
    errorMap: () => ({ message: "You must confirm that your details are accurate" }),
  }),

  // Spam preparation: honeypot field (must remain empty)
  website_hp: z.string().max(0, { message: "Spam detected" }).optional(),
});
