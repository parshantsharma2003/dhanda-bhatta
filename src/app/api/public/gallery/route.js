import { NextResponse } from "next/server";
import { getPublishedGalleryAssets } from "@/services/galleryService";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const mediaType = searchParams.get("mediaType");
    const limit = searchParams.get("limit");

    const { items, source } = await getPublishedGalleryAssets({
      category: category || undefined,
      mediaType: mediaType || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        count: items.length,
        source,
        data: items,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("[api/public/gallery] Error fetching gallery media:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve gallery media",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return new NextResponse(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { Allow: "GET", "Content-Type": "application/json" },
  });
}
