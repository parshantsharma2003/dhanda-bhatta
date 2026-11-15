import crypto from "crypto";

/**
 * Generates human-readable, collision-resistant reference IDs for enquiries and order requests.
 * Format:
 *   Enquiry: ENQ-YYYYMMDD-XXXXX (e.g. ENQ-20261115-A8F2K)
 *   Order:   ORD-YYYYMMDD-XXXXX (e.g. ORD-20261115-W4T9P)
 */
export function generateReference(prefix = "ENQ") {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  // 5 characters of random uppercase alphanumeric (avoiding ambiguous chars like 0/O, 1/I)
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const randomBytes = crypto.randomBytes(5);
  let randomPart = "";
  for (let i = 0; i < 5; i++) {
    randomPart += chars[randomBytes[i] % chars.length];
  }

  return `${prefix.toUpperCase()}-${dateStr}-${randomPart}`;
}

export function generateEnquiryReference() {
  return generateReference("ENQ");
}

export function generateOrderReference() {
  return generateReference("ORD");
}
