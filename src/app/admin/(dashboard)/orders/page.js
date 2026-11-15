import connectToDatabase from "@/lib/db";
import OrderRequest from "@/models/OrderRequest";
import OrdersListClient from "./OrdersListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bulk Order Requests | Kiln Admin | Dhanda Bhatta Company",
  description: "Track customer order requests, prepare dispatch quotations, and coordinate vehicle logistics.",
};

async function getInitialOrders() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const filter = { isArchived: { $ne: true } };
      const limit = 15;

      const [orders, total] = await Promise.all([
        OrderRequest.find(filter)
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean(),
        OrderRequest.countDocuments(filter),
      ]);

      return {
        orders: JSON.parse(JSON.stringify(orders)),
        pagination: {
          total,
          page: 1,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }
  } catch (err) {
    console.error("[OrdersPage] Error loading orders:", err);
  }

  return {
    orders: [],
    pagination: { total: 0, page: 1, limit: 15, totalPages: 1 },
  };
}

export default async function OrdersPage() {
  const { orders, pagination } = await getInitialOrders();
  return <OrdersListClient initialOrders={orders} initialPagination={pagination} />;
}
