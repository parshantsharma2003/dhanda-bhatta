import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import OrderRequest from "@/models/OrderRequest";
import OrderDetailClient from "./OrderDetailClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bulk Order Detail & Quotation | Kiln Admin | Dhanda Bhatta Company",
  description: "Review order request requirements, calculate dispatch quotation, and manage logistics pipeline.",
};

async function getOrder(id) {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const order = await OrderRequest.findById(id).lean();
      if (!order) return null;
      return JSON.parse(JSON.stringify(order));
    }
  } catch (err) {
    console.error("[OrderDetailPage] Error fetching order:", err);
  }
  return null;
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailClient initialOrder={order} />;
}
