import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Product | Kiln Admin | Dhanda Bhatta Company",
  description: "Modify brick specifications, pricing, media, and inventory status.",
};

async function getProduct(id) {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const product = await Product.findById(id).lean();
      if (!product) return null;
      return JSON.parse(JSON.stringify(product));
    }
  } catch (err) {
    console.error("[EditProductPage] Error fetching product:", err);
  }
  return null;
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductForm initialProduct={product} isEdit={true} />;
}
