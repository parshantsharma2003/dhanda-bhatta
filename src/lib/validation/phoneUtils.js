/**
 * Phone Number Normalization and Validation Utilities
 * Focuses on standard Indian mobile numbers with support for formatting.
 */

/**
 * Normalizes an Indian phone number:
 * Strips whitespace, dashes, parentheses, leading '+91', '91', or '0'.
 * Returns a 10-digit clean string if valid, or the sanitized string.
 */
export function normalizeIndianPhone(input) {
  if (!input || typeof input !== "string") return "";

  // Remove all non-digit characters except leading plus if any
  let cleaned = input.replace(/[\s\-\(\)\.]/g, "");

  // If starts with +91, remove +91
  if (cleaned.startsWith("+91")) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("0")) {
    // Leading zero trunk prefix in India
    cleaned = cleaned.slice(1);
  } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
    // 91 prefix without plus
    cleaned = cleaned.slice(2);
  }

  return cleaned;
}

/**
 * Validates whether the normalized string is a valid 10-digit Indian mobile number
 * Indian mobile numbers start with 6, 7, 8, or 9 and are exactly 10 digits.
 */
export function isValidIndianMobile(input) {
  const normalized = normalizeIndianPhone(input);
  return /^[6-9]\d{9}$/.test(normalized);
}

/**
 * Formats a 10-digit number for display e.g. "+91 98123-45678"
 */
export function formatIndianPhoneForDisplay(input) {
  const normalized = normalizeIndianPhone(input);
  if (normalized.length === 10) {
    return `+91 ${normalized.slice(0, 5)}-${normalized.slice(5)}`;
  }
  return input;
}
