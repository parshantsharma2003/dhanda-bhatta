import { normalizeIndianPhone } from "@/lib/validation/phoneUtils";
import { siteConfig } from "@/config/site";

/**
 * Enhanced Submission Service for Phase 5 Backend
 * Connects directly to Next.js Route Handlers (`/api/enquiries` & `/api/order-requests`).
 * Safely persists records to MongoDB Atlas and provides official reference IDs.
 */

export async function submitEnquiry(data) {
  const normalizedPhone = normalizeIndianPhone(data.phoneNumber);

  const payload = {
    fullName: data.fullName.trim(),
    phoneNumber: normalizedPhone,
    email: data.email?.trim() || null,
    enquiryType: data.enquiryType,
    interestedProduct: data.interestedProduct || null,
    message: data.message.trim(),
    preferredContactMethod: data.preferredContactMethod || "Phone",
    consent: true,
    website_hp: data.website_hp || "",
  };

  let apiResponse = null;
  let reference = null;
  let isPersisted = false;
  let message = "";

  try {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    apiResponse = await res.json();

    if (!res.ok) {
      throw new Error(
        apiResponse.message || `Submission failed with status ${res.status}`
      );
    }

    reference = apiResponse.reference;
    isPersisted = Boolean(apiResponse.isPersisted);
    message = apiResponse.message;
  } catch (err) {
    console.warn("[submissionService] API call encountered error, activating fallback:", err.message);
    // If the server was unreachable or error occurred, generate a client fallback reference
    // so customer experience is completely seamless and they can still use WhatsApp/Phone actions.
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    reference = `ENQ-${dateStr}-DIRECT`;
    message =
      "Your enquiry was formatted successfully. Please confirm directly with our dispatch desk via WhatsApp or Call.";
  }

  return {
    success: true,
    reference,
    isPersisted,
    message,
    payload,
    directActions: {
      phone: siteConfig.contact.primaryPhone,
      phoneDisplay: siteConfig.contact.primaryPhoneDisplay,
      whatsappUrl: createWhatsAppEnquiryUrl(payload, reference),
    },
  };
}

export async function submitOrderRequest(data) {
  const normalizedPhone = normalizeIndianPhone(data.phoneNumber);

  const payload = {
    customerName: data.customerName.trim(),
    phoneNumber: normalizedPhone,
    email: data.email?.trim() || null,
    selectedProduct: data.selectedProduct,
    quantity: Number(data.quantity),
    productInstructions: data.productInstructions?.trim() || null,
    villageOrCity: data.villageOrCity.trim(),
    district: data.district.trim(),
    state: data.state?.trim() || "Haryana",
    pincode: data.pincode?.trim() || null,
    expectedDeliveryDate: data.expectedDeliveryDate || null,
    deliveryInstructions: data.deliveryInstructions?.trim() || null,
    consent: true,
    website_hp: data.website_hp || "",
  };

  let apiResponse = null;
  let reference = null;
  let isPersisted = false;
  let message = "";

  try {
    const res = await fetch("/api/order-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    apiResponse = await res.json();

    if (!res.ok) {
      throw new Error(
        apiResponse.message || `Submission failed with status ${res.status}`
      );
    }

    reference = apiResponse.reference;
    isPersisted = Boolean(apiResponse.isPersisted);
    message = apiResponse.message;
  } catch (err) {
    console.warn("[submissionService] API order request error, activating fallback:", err.message);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    reference = `ORD-${dateStr}-DIRECT`;
    message =
      "Your order request was formatted successfully. Please confirm dispatch logistics directly with our desk.";
  }

  return {
    success: true,
    reference,
    isPersisted,
    isRequestOnly: true,
    message,
    payload: {
      ...payload,
      deliveryLocation: {
        villageOrCity: payload.villageOrCity,
        district: payload.district,
        state: payload.state,
        pincode: payload.pincode,
      },
    },
    directActions: {
      phone: siteConfig.contact.primaryPhone,
      phoneDisplay: siteConfig.contact.primaryPhoneDisplay,
      whatsappUrl: createWhatsAppOrderUrl(payload, reference),
    },
  };
}

export function createWhatsAppEnquiryUrl(payload, reference = "") {
  const text = [
    `*Dhanda Bhatta Company - Customer Enquiry*`,
    reference ? `*Reference ID: ${reference}*` : null,
    `Name: ${payload.fullName}`,
    `Phone: ${payload.phoneNumber}`,
    `Type: ${payload.enquiryType}`,
    payload.interestedProduct ? `Product: ${payload.interestedProduct}` : null,
    `Preferred Contact: ${payload.preferredContactMethod}`,
    `Message: ${payload.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function createWhatsAppOrderUrl(payload, reference = "") {
  const locationStr = [
    payload.villageOrCity || payload.deliveryLocation?.villageOrCity,
    payload.district || payload.deliveryLocation?.district,
    payload.state || payload.deliveryLocation?.state,
    payload.pincode || payload.deliveryLocation?.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const text = [
    `*Dhanda Bhatta Company - Bulk Order Request*`,
    reference ? `*Reference ID: ${reference}*` : null,
    `Customer: ${payload.customerName}`,
    `Phone: ${payload.phoneNumber}`,
    `Product: ${payload.selectedProduct}`,
    `Quantity: ${Number(payload.quantity).toLocaleString("en-IN")} bricks`,
    `Delivery Destination: ${locationStr}`,
    payload.expectedDeliveryDate ? `Target Date: ${payload.expectedDeliveryDate}` : null,
    payload.deliveryInstructions ? `Instructions: ${payload.deliveryInstructions}` : null,
    `Note: Requesting quotation and dispatch timeline.`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
