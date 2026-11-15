import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import OrderRequest from "@/models/OrderRequest";
import { logSecurityEvent } from "@/lib/security/auditLogger";

export const dynamic = "force-dynamic";

const OrderPatchSchema = z.object({
  status: z
    .enum([
      "new",
      "pending_review",
      "contacted",
      "quoted",
      "quote_provided",
      "confirmed",
      "preparing",
      "dispatched",
      "delivered",
      "cancelled",
      "archived",
    ])
    .optional(),
  quotation: z
    .object({
      estimatedTotal: z.coerce.number().optional().nullable(),
      unitRate: z.coerce.number().optional().nullable(),
      vehicleHaulageRate: z.coerce.number().optional().nullable(),
      notes: z.string().trim().max(1000).optional().nullable(),
    })
    .optional(),
  expectedDeliveryDate: z.string().trim().optional(),
  noteText: z.string().trim().max(1000).optional(),
  note: z.string().trim().max(1000).optional(),
});

export async function GET(request, context) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    await connectToDatabase();
    const order = await OrderRequest.findById(id).lean();

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch order details" },
      { status }
    );
  }
}

export async function PATCH(request, context) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    const raw = await request.json().catch(() => ({}));
    const parseRes = OrderPatchSchema.safeParse(raw);

    if (!parseRes.success) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: parseRes.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, quotation, expectedDeliveryDate, noteText, note } = parseRes.data;
    const finalNote = (noteText || note || "").trim();
    await connectToDatabase();

    const order = await OrderRequest.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const previousStatus = order.status;

    // Handle status change
    if (status && status !== previousStatus) {
      order.status = status;
      order.timeline.push({
        action: "STATUS_UPDATED",
        previousStatus,
        newStatus: status,
        adminId: user.id,
        adminName: user.name || "Administrator",
        timestamp: new Date(),
      });
    }

    // Handle quotation update
    if (quotation) {
      order.quotation = {
        ...order.quotation,
        ...quotation,
        quotedAt: new Date(),
        quotedBy: user.email || user.name || "Administrator",
      };

      order.timeline.push({
        action: "QUOTATION_UPDATED",
        adminId: user.id,
        adminName: user.name || "Administrator",
        note: quotation.estimatedTotal ? `Quoted Total: ₹${quotation.estimatedTotal}` : "Quotation updated",
        timestamp: new Date(),
      });
    }

    // Handle expected delivery date
    if (expectedDeliveryDate !== undefined) {
      order.expectedDeliveryDate = expectedDeliveryDate;
    }

    // Handle internal note
    if (finalNote.length > 0) {
      order.internalNotes.push({
        text: finalNote,
        adminId: user.id,
        adminName: user.name || "Administrator",
        createdAt: new Date(),
      });

      order.timeline.push({
        action: "INTERNAL_NOTE_ADDED",
        adminId: user.id,
        adminName: user.name || "Administrator",
        note: finalNote.slice(0, 100),
        timestamp: new Date(),
      });
    }

    await order.save();

    await logSecurityEvent({
      eventType: "ADMIN_LOGIN_SUCCESS",
      adminId: user.id,
      adminEmail: user.email,
      outcome: "SUCCESS",
      headers: request.headers,
      details: {
        action: "ORDER_UPDATED",
        orderId: id,
        ref: order.orderReference,
        statusChange: status ? `${previousStatus} -> ${status}` : "none",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order request updated successfully",
      data: { order, ...order.toObject() },
      order,
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update order" },
      { status }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { user } = await requireAdmin({ isApi: true, headers: request.headers });
    const { id } = await context.params;

    await connectToDatabase();
    const order = await OrderRequest.findById(id);

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Soft delete / archive to protect historical integrity
    order.isArchived = true;
    order.status = "archived";
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order request archived successfully",
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to archive order" },
      { status }
    );
  }
}
