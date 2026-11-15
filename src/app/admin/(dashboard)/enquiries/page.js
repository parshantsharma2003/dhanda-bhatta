import connectToDatabase from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import EnquiriesListClient from "./EnquiriesListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer Enquiries | Kiln Admin | Dhanda Bhatta Company",
  description: "Review incoming customer enquiries, manage statuses, and track follow-ups.",
};

async function getInitialEnquiries() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const filter = { isArchived: { $ne: true } };
      const limit = 15;

      const [enquiries, total] = await Promise.all([
        Enquiry.find(filter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean(),
        Enquiry.countDocuments(filter),
      ]);

      return {
        enquiries: JSON.parse(JSON.stringify(enquiries)),
        pagination: {
          total,
          page: 1,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }
  } catch (err) {
    console.error("[EnquiriesPage] Error loading enquiries:", err);
  }

  return {
    enquiries: [],
    pagination: { total: 0, page: 1, limit: 15, totalPages: 1 },
  };
}

export default async function EnquiriesPage() {
  const { enquiries, pagination } = await getInitialEnquiries();
  return <EnquiriesListClient initialEnquiries={enquiries} initialPagination={pagination} />;
}
