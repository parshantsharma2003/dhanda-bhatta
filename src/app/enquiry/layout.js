import { generatePageMetadata, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Brick Pricing & Customer Enquiry",
  description:
    "Send an enquiry to Dhanda Bhatta Company in Village Kalwa, Pillukhera, Jind. Request brick pricing, batch availability, and delivery information.",
  path: "/enquiry",
  keywords: [
    "brick pricing Jind",
    "bhatta enquiry Pillukhera",
    "brick rate enquiry Haryana",
    "red clay bricks price Jind",
  ],
});

export default function EnquiryLayout({ children }) {
  const breadcrumbLd = generateBreadcrumbSchema([{ name: "Enquiry", url: "/enquiry" }]);

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
