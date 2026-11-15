import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { generateUploadSignature, isCloudinaryConfigured } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

export async function POST(request) {
  try {
    const { user } = await requireAdmin({
      isApi: true,
      headers: request.headers,
    });

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          isConfigured: false,
          message:
            "Cloudinary credentials (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET) are not set. Media will use local storage/placeholder mode.",
        },
        { status: 200 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { resourceType = "image", mimeType, fileSize, folder = "dhanda_bhatta" } = body;

    // Validate mime type & size
    if (resourceType === "image") {
      if (mimeType && !ALLOWED_IMAGE_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { success: false, message: "Invalid image format. Allowed: JPG, PNG, WebP." },
          { status: 400 }
        );
      }
      if (fileSize && fileSize > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { success: false, message: "Image exceeds 10MB limit." },
          { status: 400 }
        );
      }
    } else if (resourceType === "video") {
      if (mimeType && !ALLOWED_VIDEO_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { success: false, message: "Invalid video format. Allowed: MP4, WebM." },
          { status: 400 }
        );
      }
      if (fileSize && fileSize > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          { success: false, message: "Video exceeds 100MB limit." },
          { status: 400 }
        );
      }
    }

    const signatureData = generateUploadSignature({
      folder,
      resourceType,
    });

    return NextResponse.json(
      {
        success: true,
        isConfigured: true,
        data: signatureData,
      },
      { status: 200 }
    );
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to generate upload signature" },
      { status }
    );
  }
}
