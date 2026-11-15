import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import ProductListClient from "./ProductListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products Catalogue | Kiln Admin | Dhanda Bhatta Company",
  description: "Manage brick product listings, specifications, images, and availability status.",
};

async function getInitialProducts() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const filter = { isArchived: { $ne: true } };
      const limit = 10;

      const [products, total] = await Promise.all([
        Product.find(filter)
          .sort({ sortOrder: 1, createdAt: -1 })
          .limit(limit)
          .lean(),
        Product.countDocuments(filter),
      ]);

      return {
        products: JSON.parse(JSON.stringify(products)),
        pagination: {
          total,
          page: 1,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      };
    }
  } catch (err) {
    console.error("[ProductsPage] Error loading initial products:", err);
  }

  return {
    products: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
}

export default async function ProductsPage() {
  const { products, pagination } = await getInitialProducts();
  return <ProductListClient initialProducts={products} initialPagination={pagination} />;
}
