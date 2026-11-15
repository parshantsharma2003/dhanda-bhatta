import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add New Product | Kiln Admin | Dhanda Bhatta Company",
  description: "Create and publish a new brick product into the company catalogue.",
};

export default function NewProductPage() {
  return <ProductForm isEdit={false} />;
}
