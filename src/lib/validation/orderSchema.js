import { z } from "zod";
import { isValidIndianMobile } from "./phoneUtils.js";

export const orderSchema = z.object({
  // Customer Information
  customerName: z
    .string()
    .trim()
    .min(2, { message: "Please enter your full name (minimum 2 characters)" })
    .max(100, { message: "Name must not exceed 100 characters" }),

  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: "Please enter your contact mobile number" })
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

  // Product Information
  selectedProduct: z
    .string()
    .trim()
    .min(1, { message: "Please select a brick product or assistance option" }),

  quantity: z
    .coerce
    .number({ invalid_type_error: "Please enter a valid numeric quantity" })
    .int({ message: "Quantity must be a whole number of bricks" })
    .positive({ message: "Quantity must be greater than zero" })
    .max(10000000, { message: "For large enterprise tenders exceeding 10M units, please contact us directly" }),

  productInstructions: z.string().trim().max(1000).optional(),

  // Delivery Information
  villageOrCity: z
    .string()
    .trim()
    .min(2, { message: "Please specify your village, town or city name" })
    .max(100, { message: "Location name must not exceed 100 characters" }),

  district: z
    .string()
    .trim()
    .min(2, { message: "Please specify the district (e.g. Jind, Sonipat, Rohtak, etc.)" })
    .max(80, { message: "District name must not exceed 80 characters" }),

  state: z
    .string()
    .trim()
    .min(2, { message: "Please specify the state" })
    .default("Haryana"),

  pincode: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[1-9][0-9]{5}$/.test(val), {
      message: "Please enter a valid 6-digit Indian PIN code (e.g. 126113)",
    }),

  expectedDeliveryDate: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const selected = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
      },
      { message: "Expected delivery date cannot be in the past" }
    ),

  deliveryInstructions: z.string().trim().max(1000).optional(),

  // Consent
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must confirm that your details are accurate" }),
  }),

  // Spam preparation: honeypot field
  website_hp: z.string().max(0, { message: "Spam detected" }).optional(),
});
