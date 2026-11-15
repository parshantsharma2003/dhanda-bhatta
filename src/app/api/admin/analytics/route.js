import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/requireAdmin";
import connectToDatabase from "@/lib/db";
import Enquiry from "@/models/Enquiry";
import OrderRequest from "@/models/OrderRequest";
import Product from "@/models/Product";
import GalleryAsset from "@/models/GalleryAsset";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await requireAdmin({
      isApi: true,
      headers: request.headers,
    });

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    let dateFilter = {};
    const now = new Date();

    if (range === "today") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: startOfDay } };
    } else if (range === "7d") {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: sevenDaysAgo } };
    } else if (range === "30d") {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: thirtyDaysAgo } };
    } else if (range === "90d") {
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: ninetyDaysAgo } };
    }

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    let totalEnquiries = 0;
    let todayEnquiries = 0;
    let pendingEnquiries = 0;
    let totalOrders = 0;
    let todayOrders = 0;
    let pendingOrders = 0;
    let publishedProductsCount = 0;
    let publishedGalleryCount = 0;

    let enquiryStatusDistribution = [];
    let orderStatusDistribution = [];
    let enquiriesOverTime = [];
    let ordersOverTime = [];
    let topEnquiredProducts = [];
    let recentEnquiries = [];
    let recentOrders = [];

    if (process.env.MONGODB_URI) {
      await connectToDatabase();

      // Counts
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

      totalEnquiries = totEnq;
      todayEnquiries = todEnq;
      pendingEnquiries = penEnq;
      totalOrders = totOrd;
      todayOrders = todOrd;
      pendingOrders = penOrd;
      publishedProductsCount = pubProd;
      publishedGalleryCount = pubGal;

      // Status distributions
      const [enqStatusAgg, ordStatusAgg] = await Promise.all([
        Enquiry.aggregate([
          { $match: { isArchived: { $ne: true } } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        OrderRequest.aggregate([
          { $match: { isArchived: { $ne: true } } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
      ]);

      enquiryStatusDistribution = enqStatusAgg.map((item) => ({
        status: item._id || "unknown",
        count: item.count,
      }));

      orderStatusDistribution = ordStatusAgg.map((item) => ({
        status: item._id || "unknown",
        count: item.count,
      }));

      // Aggregations over time
      const timeMatch = { ...dateFilter, isArchived: { $ne: true } };

      const [enqTimeAgg, ordTimeAgg, topProdAgg] = await Promise.all([
        Enquiry.aggregate([
          { $match: timeMatch },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        OrderRequest.aggregate([
          { $match: timeMatch },
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
      ]);

      enquiriesOverTime = enqTimeAgg.map((item) => ({ date: item._id, count: item.count }));
      ordersOverTime = ordTimeAgg.map((item) => ({ date: item._id, count: item.count }));
      topEnquiredProducts = topProdAgg.map((item) => ({ product: item._id, count: item.count }));

      // Recent 5 enquiries and recent 5 orders
      const [recEnq, recOrd] = await Promise.all([
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

      recentEnquiries = recEnq;
      recentOrders = recOrd;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          metrics: {
            totalEnquiries,
            todayEnquiries,
            pendingEnquiries,
            totalOrders,
            todayOrders,
            pendingOrders,
            publishedProductsCount,
            publishedGalleryCount,
          },
          charts: {
            enquiriesOverTime,
            ordersOverTime,
            enquiryStatusDistribution,
            orderStatusDistribution,
            topEnquiredProducts,
          },
          recent: {
            enquiries: recentEnquiries,
            orders: recentOrders,
          },
          filter: {
            range,
          },
        },
      },
      { status: 200 }
    );
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { success: false, message: err.message || "Failed to load dashboard analytics" },
      { status }
    );
  }
}
