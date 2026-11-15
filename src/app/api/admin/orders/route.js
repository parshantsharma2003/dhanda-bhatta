import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import OrderRequest from "@/models/OrderRequest";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sort = searchParams.get("sort") || "newest";

    const filter = { isArchived: { $ne: true } };

    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { normalizedPhone: { $regex: search, $options: "i" } },
        { orderReference: { $regex: search, $options: "i" } },
        { "deliveryLocation.villageOrCity": { $regex: search, $options: "i" } },
        { "deliveryLocation.district": { $regex: search, $options: "i" } },
        { selectedProduct: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    let sortObj = { createdAt: -1 };
    if (sort === "oldest") sortObj = { createdAt: 1 };
    if (sort === "quantity") sortObj = { quantity: -1 };

    let total = 0;
    let orders = [];

    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      total = await OrderRequest.countDocuments(filter);
      orders = await OrderRequest.find(filter)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    }

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
      orders,
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
      { success: false, message: err.message || "Failed to fetch orders" },
      { status }
    );
  }
}
