import { NextResponse } from "next/server";
import { getProductBySlug } from "@/services/productService";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  try {
    const params = await context.params;
    const slug = params?.slug;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Product slug is required" },
        { status: 400 }
      );
    }

    const result = await getProductBySlug(slug);

    if (!result || !result.product) {
      return NextResponse.json(
        { success: false, message: `Product "${slug}" was not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        source: result.source,
        data: result.product,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("[api/public/products/[slug]] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve product details" },
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
