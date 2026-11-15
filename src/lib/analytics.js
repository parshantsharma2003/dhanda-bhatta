/**
 * Privacy-Safe Google Analytics 4 Event Dispatcher
 *
 * STRICT PRIVACY REQUIREMENT:
 * Never transmits customer names, phone numbers, email addresses, or raw message text.
 * Only transmits sanitized, non-PII operational events.
 */

export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  // Filter out any potential PII keys before dispatch
  const sanitizedParams = {};
  const forbiddenKeys = [
    "name",
    "customername",
    "fullname",
    "phone",
    "phonenumber",
    "mobile",
    "email",
    "message",
    "address",
    "siteaddress",
    "note",
    "deliveryinstructions",
  ];

  Object.entries(params).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    if (!forbiddenKeys.some((f) => lowerKey.includes(f))) {
      sanitizedParams[key] = value;
    }
  });

  try {
    window.gtag("event", eventName, sanitizedParams);
  } catch (err) {
    // Fail silently in development/blocked environments
    console.debug(`[analytics] Event ${eventName} skipped:`, err.message);
  }
}

/**
 * Convenience dispatchers for key business interactions
 */
export const analyticsEvents = {
  phoneClick: (location = "unknown") =>
    trackEvent("click_phone", {
      channel: "telephone",
      placement: location,
    }),

  whatsappClick: (location = "unknown") =>
    trackEvent("click_whatsapp", {
      channel: "whatsapp",
      placement: location,
    }),

  directionsClick: () =>
    trackEvent("click_directions", {
      destination: "Village Kalwa Kiln",
    }),

  enquirySubmit: (enquiryType, product = "General") =>
    trackEvent("enquiry_submitted", {
      enquiry_category: enquiryType || "general",
      product_interest: product || "none",
    }),

  orderRequestSubmit: (product, quantityTier) =>
    trackEvent("bulk_order_requested", {
      product_name: product || "standard_brick",
      quantity_tier: quantityTier || "unspecified",
    }),

  productView: (productName, category) =>
    trackEvent("view_product_details", {
      item_name: productName,
      item_category: category,
    }),
};
