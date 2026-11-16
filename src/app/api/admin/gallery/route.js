import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import GalleryAsset from "@/models/GalleryAsset";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

const GalleryAssetInputSchema = z.object({
  title: z.string().trim().min(2).max(120),
  caption: z.string().trim().max(300).optional().default(""),
  category: z.string().trim().min(1),
  categoryLabel: z.string().trim().optional(),
  mediaType: z.enum(["image", "video"]).default("image"),
  secureUrl: z.string().trim().min(1),
  thumbnailUrl: z.string().trim().optional().default(""),
  altText: z.string().trim().min(1),
  aspect: z.string().trim().default("16/9"),
  duration: z.string().trim().optional().default(""),
  badge: z.string().trim().optional().default(""),
  featured: z.boolean().default(false),
  displayOrder: z.coerce.number().default(0),
  status: z.enum(["published", "archived"]).default("published"),
});

export async function GET(request) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const mediaType = searchParams.get("mediaType");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const filter = {};
    if (category && category !== "all") filter.category = category;
    if (mediaType && mediaType !== "all") filter.mediaType = mediaType;
    if (status && status !== "all") filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { caption: { $regex: search, $options: "i" } },
      ];
    }

    let total = 0;
    let items = [];

    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      total = await GalleryAsset.countDocuments(filter);
      items = await GalleryAsset.find(filter)
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    }

    return NextResponse.json({
      success: true,
      data: {
        assets: items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
      assets: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch gallery items" },
      { status }
    );
  }
}

export async function POST(request) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });

    const raw = await request.json().catch(() => ({}));
    const parseRes = GalleryAssetInputSchema.safeParse(raw);

    if (!parseRes.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parseRes.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const newAsset = await GalleryAsset.create(parseRes.data);

    await logSecurityEvent({
      eventType: "ADMIN_LOGIN_SUCCESS",
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: { action: "GALLERY_CREATED", assetId: newAsset._id.toString(), title: newAsset.title },
    });

    try {
      revalidatePath("/gallery");
      revalidatePath("/");
    } catch (e) {
      console.warn("[revalidatePath] Error invalidating gallery cache:", e.message);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Gallery asset added successfully",
        data: newAsset,
      },
      { status: 201 }
    );
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create gallery asset" },
      { status }
    );
  }
}
