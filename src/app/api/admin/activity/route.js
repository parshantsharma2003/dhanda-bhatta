import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import SecurityAuditLog from "@/models/SecurityAuditLog";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });

    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get("eventType");
    const outcome = searchParams.get("outcome");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter = {};
    if (eventType && eventType !== "all") filter.eventType = eventType;
    if (outcome && outcome !== "all") filter.outcome = outcome;

    let total = 0;
    let logs = [];

    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      total = await SecurityAuditLog.countDocuments(filter);
      logs = await SecurityAuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
    }

    return NextResponse.json({
      success: true,
      data: logs,
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
      { success: false, message: err.message || "Failed to fetch activity logs" },
      { status }
    );
  }
}
