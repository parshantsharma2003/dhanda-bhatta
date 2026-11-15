import connectToDatabase from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import OrderRequest from "@/models/OrderRequest";
import Product from "@/models/Product";
import GalleryAsset from "@/models/GalleryAsset";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard Overview | Kiln Admin | Dhanda Bhatta Company",
  description: "Real-time operations, analytics, enquiries and bulk orders for Dhanda Bhatta Company.",
};

async function getInitialAnalytics() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  let initialData = {
    metrics: {
      totalEnquiries: 0,
      todayEnquiries: 0,
      pendingEnquiries: 0,
      totalOrders: 0,
      todayOrders: 0,
      pendingOrders: 0,
      publishedProductsCount: 0,
      publishedGalleryCount: 0,
    },
    charts: {
      enquiriesOverTime: [],
      ordersOverTime: [],
      enquiryStatusDistribution: [],
      orderStatusDistribution: [],
      topEnquiredProducts: [],
    },
    recent: {
      enquiries: [],
      orders: [],
    },
    filter: {
      range: "30d",
    },
  };

  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();

      const [
        totEnq,
        todEnq,
        penEnq,
        totOrd,
        todOrd,
        penOrd,
        pubProd,
        pubGal,
      ] = await Promise.all([
        Enquiry.countDocuments({ isArchived: { $ne: true } }),
        Enquiry.countDocuments({ createdAt: { $gte: startOfToday }, isArchived: { $ne: true } }),
        Enquiry.countDocuments({ status: "new", isArchived: { $ne: true } }),
        OrderRequest.countDocuments({ isArchived: { $ne: true } }),
        OrderRequest.countDocuments({ createdAt: { $gte: startOfToday }, isArchived: { $ne: true } }),
        OrderRequest.countDocuments({ status: { $in: ["new", "pending_review"] }, isArchived: { $ne: true } }),
        Product.countDocuments({ status: "published", isArchived: { $ne: true } }),
        GalleryAsset.countDocuments({ status: "published" }),
      ]);

      initialData.metrics = {
        totalEnquiries: totEnq,
        todayEnquiries: todEnq,
        pendingEnquiries: penEnq,
        totalOrders: totOrd,
        todayOrders: todOrd,
        pendingOrders: penOrd,
        publishedProductsCount: pubProd,
        publishedGalleryCount: pubGal,
      };

      const [enqStatusAgg, ordStatusAgg, enqTimeAgg, ordTimeAgg, topProdAgg, recEnq, recOrd] =
        await Promise.all([
          Enquiry.aggregate([
            { $match: { isArchived: { $ne: true } } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ]),
          OrderRequest.aggregate([
            { $match: { isArchived: { $ne: true } } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ]),
          Enquiry.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo }, isArchived: { $ne: true } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]),
          OrderRequest.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo }, isArchived: { $ne: true } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ]),
          Enquiry.aggregate([
            { $match: { interestedProduct: { $ne: null, $nin: ["", "Other"] }, isArchived: { $ne: true } } },
            { $group: { _id: "$interestedProduct", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
          ]),
          Enquiry.find({ isArchived: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("enquiryReference fullName phone enquiryType interestedProduct status createdAt")
            .lean(),
          OrderRequest.find({ isArchived: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("orderReference customerName phone selectedProduct quantity status deliveryLocation createdAt")
            .lean(),
        ]);

      initialData.charts = {
        enquiriesOverTime: enqTimeAgg.map((i) => ({ date: i._id, count: i.count })),
        ordersOverTime: ordTimeAgg.map((i) => ({ date: i._id, count: i.count })),
        enquiryStatusDistribution: enqStatusAgg.map((i) => ({ status: i._id, count: i.count })),
        orderStatusDistribution: ordStatusAgg.map((i) => ({ status: i._id, count: i.count })),
        topEnquiredProducts: topProdAgg.map((i) => ({ product: i._id, count: i.count })),
      };

      initialData.recent = {
        enquiries: JSON.parse(JSON.stringify(recEnq)),
        orders: JSON.parse(JSON.stringify(recOrd)),
      };
    }
  } catch (err) {
    console.error("[getInitialAnalytics] Error:", err);
  }

  return initialData;
}

export default async function DashboardPage() {
  const initialData = await getInitialAnalytics();
  return <DashboardClient initialData={initialData} />;
}
