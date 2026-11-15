import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/requireAdmin";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { user } = await requireAdmin({
      isApi: true,
      headers: request.headers,
    });

    const body = await request.json().catch(() => ({}));
    const { publicId, resourceType = "image" } = body;

    if (!publicId || typeof publicId !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid asset publicId is required." },
        { status: 400 }
      );
    }

    const deleteResult = await deleteCloudinaryAsset(publicId, resourceType);

    await logSecurityEvent({
      eventType: "GALLERY_DELETED",
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: { publicId, resourceType },
    });

    return NextResponse.json(
      {
        success: true,
        data: deleteResult,
      },
      { status: 200 }
    );
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete Cloudinary asset" },
      { status }
    );
  }
}
