import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import Enquiry from "@/models/Enquiry";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdmin({ isApi: true, headers: request.headers });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter = { isArchived: { $ne: true } };
    if (status && status !== "all") filter.status = status;

    await connectToDatabase();
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      "Reference",
      "Customer Name",
      "Phone",
      "Email",
      "Category",
      "Product",
      "Preferred Contact",
      "Status",
      "Submitted At",
      "Message",
    ];

    const escapeCsv = (str) => {
      if (!str) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = enquiries.map((e) => [
      escapeCsv(e.enquiryReference),
      escapeCsv(e.fullName),
      escapeCsv(e.phone),
      escapeCsv(e.email || ""),
      escapeCsv(e.enquiryType),
      escapeCsv(e.interestedProduct || ""),
      escapeCsv(e.preferredContactMethod || "Phone"),
      escapeCsv(e.status),
      escapeCsv(e.createdAt ? new Date(e.createdAt).toISOString() : ""),
      escapeCsv(e.message || ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="dhanda_enquiries_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to export enquiries" },
      { status }
    );
  }
}
