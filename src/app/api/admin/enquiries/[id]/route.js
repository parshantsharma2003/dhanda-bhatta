import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

const EnquiryPatchSchema = z.object({
  status: z
    .enum(["new", "contacted", "quoted", "closed", "spam", "in_progress", "resolved", "archived"])
    .optional(),
  noteText: z.string().trim().max(1000).optional(),
  note: z.string().trim().max(1000).optional(),
});

export async function GET(request, context) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    await connectToDatabase();
    const enquiry = await Enquiry.findById(id).lean();

    if (!enquiry) {
      return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: enquiry });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch enquiry details" },
      { status }
    );
  }
}

export async function PATCH(request, context) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    const raw = await request.json().catch(() => ({}));
    const parseRes = EnquiryPatchSchema.safeParse(raw);

    if (!parseRes.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseRes.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, noteText, note } = parseRes.data;
    const finalNote = (noteText || note || "").trim();
    await connectToDatabase();

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 });
    }

    const previousStatus = enquiry.status;

    // Handle status change
    if (status && status !== previousStatus) {
      enquiry.status = status;
      enquiry.timeline.push({
        action: "STATUS_UPDATED",
        previousStatus,
        newStatus: status,
        adminId: user.id,
        adminName: user.name || "Administrator",
        timestamp: new Date(),
      });
    }

    // Handle adding internal note
    if (finalNote.length > 0) {
      enquiry.internalNotes.push({
        text: finalNote,
        adminId: user.id,
        adminName: user.name || "Administrator",
        createdAt: new Date(),
      });

      enquiry.timeline.push({
        action: "INTERNAL_NOTE_ADDED",
        adminId: user.id,
        adminName: user.name || "Administrator",
        note: finalNote.slice(0, 100),
        timestamp: new Date(),
      });
    }

    await enquiry.save();

    await logSecurityEvent({
      eventType: "ADMIN_LOGIN_SUCCESS",
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: {
        action: "ENQUIRY_UPDATED",
        enquiryId: id,
        ref: enquiry.enquiryReference,
        statusChange: status ? `${previousStatus} -> ${status}` : "none",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Enquiry updated successfully",
      data: { enquiry, ...enquiry.toObject() },
      enquiry,
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update enquiry" },
      { status }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    await connectToDatabase();
    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return NextResponse.json({ success: false, message: "Enquiry not found" }, { status: 404 });
    }

    // Soft delete / archive
    enquiry.isArchived = true;
    enquiry.status = "archived";
    await enquiry.save();

    return NextResponse.json({
      success: true,
      message: "Enquiry archived successfully",
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to archive enquiry" },
      { status }
    );
  }
}
