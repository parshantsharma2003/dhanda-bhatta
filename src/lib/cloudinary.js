import "server-only";
import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary Media Helper Utility
 * Server-side only: Prevents leaking API secrets to the browser.
 */

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Checks whether Cloudinary credentials are fully configured.
 */
export function isCloudinaryConfigured() {
  return Boolean(cloudName && apiKey && apiSecret);
}

/**
 * Generates an upload signature for authorized direct browser-to-Cloudinary uploads.
 * Never exposes the apiSecret to the client.
 */
export function generateUploadSignature(options = {}) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary credentials are not configured in environment variables.");
  }

  const {
    folder = "dhanda_bhatta",
    resourceType = "image",
    transformation = undefined,
  } = options;

  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign = {
    folder,
    timestamp,
  };

  if (transformation) {
    paramsToSign.transformation = transformation;
  }

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    resourceType,
  };
}

/**
 * Deletes a media asset from Cloudinary by its public ID.
 */
export async function deleteCloudinaryAsset(publicId, resourceType = "image") {
  if (!isCloudinaryConfigured()) {
    console.warn("[Cloudinary] Credentials not configured. Skipping remote deletion.");
    return { result: "skipped_unconfigured" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (err) {
    console.error(`[Cloudinary] Failed to delete asset "${publicId}":`, err.message);
    throw err;
  }
}

/**
 * Generates an optimized Cloudinary delivery URL with automatic format and quality.
 * If the input is already a full external URL or Cloudinary is unconfigured, returns the URL safely.
 */
export function buildOptimizedImageUrl(publicIdOrUrl, options = {}) {
  if (!publicIdOrUrl) return "";

  if (
    publicIdOrUrl.startsWith("http://") ||
    publicIdOrUrl.startsWith("https://")
  ) {
    if (!cloudName || !publicIdOrUrl.includes(`res.cloudinary.com/${cloudName}`)) {
      return publicIdOrUrl;
    }
  }

  if (publicIdOrUrl.startsWith("/")) {
    return publicIdOrUrl;
  }

  if (!cloudName) {
    return publicIdOrUrl;
  }

  const {
    width,
    height,
    crop = "limit",
    quality = "auto",
    format = "auto",
  } = options;

  const transforms = [`f_${format}`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);

  const transformString = transforms.join(",");
  const cleanId = publicIdOrUrl.replace(/^\/+/, "");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${cleanId}`;
}

/**
 * Generates a standard responsive srcset string for a Cloudinary image.
 */
export function buildCloudinarySrcSet(publicId, widths = [360, 640, 768, 1024, 1280, 1536]) {
  if (!isCloudinaryConfigured() || !publicId || publicId.startsWith("http") || publicId.startsWith("/")) {
    return null;
  }

  return widths
    .map((w) => `${buildOptimizedImageUrl(publicId, { width: w })} ${w}w`)
    .join(", ");
}
