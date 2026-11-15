import { NextResponse } from "next/server";
import { getPublishedProducts } from "@/services/productService";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featuredParam = searchParams.get("featured");
    const limit = searchParams.get("limit");

    let featured = undefined;
    if (featuredParam === "true") featured = true;
    if (featuredParam === "false") featured = false;

    const { products, source } = await getPublishedProducts({
      category: category || undefined,
      featured,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        source,
        data: products,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("[api/public/products] Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve product catalogue",
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

export async function PUT() {
  return new NextResponse(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { Allow: "GET", "Content-Type": "application/json" },
  });
}

export async function DELETE() {
  return new NextResponse(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { Allow: "GET", "Content-Type": "application/json" },
  });
}
