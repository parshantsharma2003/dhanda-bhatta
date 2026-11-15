import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import EnquiryDetailClient from "./EnquiryDetailClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Enquiry Detail | Kiln Admin | Dhanda Bhatta Company",
  description: "View enquiry details, communicate with customer, update status, and log notes.",
};

async function getEnquiry(id) {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const enquiry = await Enquiry.findById(id).lean();
      if (!enquiry) return null;
      return JSON.parse(JSON.stringify(enquiry));
    }
  } catch (err) {
    console.error("[EnquiryDetailPage] Error fetching enquiry:", err);
  }
  return null;
}

export default async function EnquiryDetailPage({ params }) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);

  if (!enquiry) {
    notFound();
  }

  return <EnquiryDetailClient initialEnquiry={enquiry} />;
}
