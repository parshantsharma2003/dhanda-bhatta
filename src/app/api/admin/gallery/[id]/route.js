import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import GalleryAsset from "@/models/GalleryAsset";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

const GalleryUpdateSchema = z.object({
  title: z.string().trim().min(2).max(120).optional(),
  caption: z.string().trim().max(300).optional(),
  category: z.string().trim().min(1).optional(),
  categoryLabel: z.string().trim().optional(),
  mediaType: z.enum(["image", "video"]).optional(),
  secureUrl: z.string().trim().min(1).optional(),
  thumbnailUrl: z.string().trim().optional(),
  altText: z.string().trim().min(1).optional(),
  aspect: z.string().trim().optional(),
  duration: z.string().trim().optional(),
  badge: z.string().trim().optional(),
  featured: z.boolean().optional(),
  displayOrder: z.coerce.number().optional(),
  status: z.enum(["published", "archived"]).optional(),
});

export async function PUT(request, context) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    const raw = await request.json().catch(() => ({}));
    const parseRes = GalleryUpdateSchema.safeParse(raw);

    if (!parseRes.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: parseRes.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const asset = await GalleryAsset.findByIdAndUpdate(id, parseRes.data, { new: true });

    if (!asset) {
      return NextResponse.json({ success: false, message: "Gallery asset not found" }, { status: 404 });
    }

    await logSecurityEvent({
      eventType: "ADMIN_LOGIN_SUCCESS",
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: { action: "GALLERY_UPDATED", assetId: id },
    });

    try {
      revalidatePath("/gallery");
      revalidatePath("/");
    } catch (e) {
      console.warn("[revalidatePath] Error invalidating gallery cache:", e.message);
    }

    return NextResponse.json({
      success: true,
      message: "Gallery asset updated successfully",
      data: asset,
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update gallery asset" },
      { status }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    await connectToDatabase();
    const asset = await GalleryAsset.findByIdAndDelete(id);

    if (!asset) {
      return NextResponse.json({ success: false, message: "Gallery asset not found" }, { status: 404 });
    }

    await logSecurityEvent({
      eventType: "GALLERY_DELETED",
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: { action: "GALLERY_DELETED", assetId: id, title: asset.title },
    });

    try {
      revalidatePath("/gallery");
      revalidatePath("/");
    } catch (e) {
      console.warn("[revalidatePath] Error invalidating gallery cache:", e.message);
    }

    return NextResponse.json({
      success: true,
      message: "Gallery asset removed successfully",
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete gallery asset" },
      { status }
    );
  }
}
