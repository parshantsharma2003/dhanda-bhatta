import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import OrderRequest from "@/models/OrderRequest";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter = { isArchived: { $ne: true } };
    if (status && status !== "all") filter.status = status;

    await connectToDatabase();
    const orders = await OrderRequest.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      "Reference",
      "Customer Name",
      "Phone",
      "Product",
      "Quantity",
      "Village / City",
      "District",
      "State",
      "PIN Code",
      "Target Delivery Date",
      "Status",
      "Quoted Total",
      "Requested At",
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = orders.map((o) => [
      escapeCsv(o.orderReference),
      escapeCsv(o.customerName),
      escapeCsv(o.phone),
      escapeCsv(o.selectedProduct),
      escapeCsv(o.quantity),
      escapeCsv(o.deliveryLocation?.villageOrCity || ""),
      escapeCsv(o.deliveryLocation?.district || ""),
      escapeCsv(o.deliveryLocation?.state || "Haryana"),
      escapeCsv(o.deliveryLocation?.pincode || ""),
      escapeCsv(o.expectedDeliveryDate || ""),
      escapeCsv(o.status),
      escapeCsv(o.quotation?.estimatedTotal ? `₹${o.quotation.estimatedTotal}` : "Pending"),
      escapeCsv(o.createdAt ? new Date(o.createdAt).toISOString() : ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="dhanda_orders_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to export orders" },
      { status }
    );
  }
}
