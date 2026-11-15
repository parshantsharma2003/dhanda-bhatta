import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

export async function GET(request, context) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });
    const { key } = await context.params;

    await connectToDatabase();
    const content = await SiteContent.findOne({ key }).lean();

    return NextResponse.json({
      success: true,
      data: content || {
        key,
        status: "published",
        publishedData: {},
        draftData: {},
      },
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch content" },
      { status }
    );
  }
}

export async function PUT(request, context) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });
    const { key } = await context.params;

    const body = await request.json().catch(() => ({}));
    const { data, publish = false } = body;

    await connectToDatabase();

    let content = await SiteContent.findOne({ key });
    if (!content) {
      content = new SiteContent({
        key,
        publishedData: {},
        draftData: {},
      });
    }

    if (publish) {
      content.publishedData = data;
      content.draftData = data;
      content.status = "published";
      content.publishedAt = new Date();
    } else {
      content.draftData = data;
      content.status = "draft";
    }

    content.updatedBy = user.email || user.name || "Administrator";
    await content.save();

    await logSecurityEvent({
      eventType: "ADMIN_LOGIN_SUCCESS",
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: {
        action: publish ? "CONTENT_PUBLISHED" : "CONTENT_DRAFT_SAVED",
        key,
      },
    });

    return NextResponse.json({
      success: true,
      message: publish ? "Content published successfully" : "Draft saved successfully",
      data: content,
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to save content" },
      { status }
    );
  }
}
