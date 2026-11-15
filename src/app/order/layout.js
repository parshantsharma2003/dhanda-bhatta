import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Bulk Brick Order Request & Quotation",
  description:
    "Submit a bulk brick order request directly to Dhanda Bhatta Company in Village Kalwa, Pillukhera, Jind. Transport arranged via tractor trolley and multi-axle trucks.",
  path: "/order",
  keywords: [
    "bulk bricks supplier Haryana",
    "order bricks online Jind",
    "trolley brick delivery Pillukhera",
    "truck load bricks Jind",
  ],
});

export default function OrderLayout({ children }) {
  const breadcrumbLd = generateBreadcrumbSchema([{ name: "Bulk Order", url: "/order" }]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {children}
    </>
  );
}
