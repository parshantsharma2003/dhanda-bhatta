/**
 * Dhanda Bhatta Company - Product Catalog Data
 *
 * Verified red clay brick varieties manufactured at Village Kalwa, Pillukhera, Jind, Haryana.
 * No unsupported laboratory claims or unverified prices are assumed.
 * Individual grade photographs are pending owner upload via Cloudinary.
 */

export const productNotice = {
  heading: "Bricks for Every Construction Need",
  description:
    "Explore our brick products and contact us for current availability, specifications and bulk-order enquiries.",
};

export const products = [
  {
    id: "prod-1",
    name: "First Class Red Clay Bricks",
    slug: "first-class-red-bricks",
    category: "Structural Masonry",
    grade: "Grade 1",
    shortDescription:
      "Well-burnt red clay bricks with uniform shape, sharp arrises, and clean surface suitable for residential and commercial masonry.",
    description:
      "Red clay bricks manufactured at our kiln in Village Kalwa, Pillukhera. Suitable for residential construction, boundary walls, and exterior masonry. Contact our team to enquire about current availability and bulk delivery.",
    images: [], // Pending actual physical grade photography from owner
    specifications: [
      { label: "Product Type", value: "Kiln-Fired Red Clay Brick" },
      { label: "Manufacturing Origin", value: "Village Kalwa, Pillukhera (Jind, Haryana)" },
      { label: "Surface Texture", value: "Traditional mould finish for masonry bonding" },
      { label: "Recommended Use", value: "Residential exterior walls & structural masonry" },
    ],
    availability: "Enquire for Availability",
    availabilityStatus: "available",
    published: true,
    featured: true,
    applications: [
      "Load-bearing residential exterior walls",
      "Commercial masonry and framed construction infill",
      "Boundary walls and compound pillars",
    ],
  },
  {
    id: "prod-2",
    name: "Standard Construction Bricks",
    slug: "standard-construction-bricks",
    category: "General Construction",
    grade: "Grade 2",
    shortDescription:
      "Reliable kiln-fired bricks with good structural strength, widely utilized for internal partition walls, compound boundaries, and infill masonry.",
    description:
      "Kiln-fired clay bricks produced at Village Kalwa, suitable for internal partition walls, compound boundaries, and general construction masonry across nearby areas.",
    images: [], // Pending actual physical grade photography from owner
    specifications: [
      { label: "Product Type", value: "Kiln-Fired Clay Brick" },
      { label: "Manufacturing Origin", value: "Village Kalwa, Pillukhera (Jind, Haryana)" },
      { label: "Surface Finish", value: "Standard kiln finish suitable for plaster adhesion" },
      { label: "Recommended Use", value: "Internal partition walls & general masonry" },
    ],
    availability: "Enquire for Availability",
    availabilityStatus: "available",
    published: true,
    featured: true,
    applications: [
      "Internal partition walls and framed infill",
      "Farmhouse compound boundaries and sheds",
      "Plastered residential walling",
    ],
  },
  {
    id: "prod-3",
    name: "Foundation & Soling Bricks",
    slug: "foundation-soling-bricks",
    category: "Foundations & Sub-base",
    grade: "Soling",
    shortDescription:
      "Heavy and dense kiln-fired bricks selected for sub-base flooring, foundation trenches, and damp-resistant ground soling.",
    description:
      "Kiln-fired dense bricks suitable for sub-base flooring, foundation trenches, and ground soling work across nearby construction sites.",
    images: [], // Pending actual physical grade photography from owner
    specifications: [
      { label: "Product Type", value: "Kiln-Fired Soling Brick" },
      { label: "Manufacturing Origin", value: "Village Kalwa, Pillukhera (Jind, Haryana)" },
      { label: "Application Type", value: "Sub-base soling & foundation masonry" },
      { label: "Recommended Use", value: "Sub-base soling beneath floors & foundation trenches" },
    ],
    availability: "Enquire for Availability",
    availabilityStatus: "available",
    published: true,
    featured: false,
    applications: [
      "Sub-base soling beneath concrete floors",
      "Foundation trenches and damp-proof levelling",
      "Paving and rural road bases",
    ],
  },
  {
    id: "prod-4",
    name: "Machine-Cut Facing Bricks",
    slug: "machine-cut-facing-bricks",
    category: "Architectural Facing",
    grade: "Facing",
    shortDescription:
      "Wire-sliced facing bricks with defined rectangular arrises and uniform face texture for exposed architectural masonry.",
    description:
      "Draft catalogue entry for machine wirecut bricks intended for contemporary facades and precision joints. Kept as draft pending owner verification of seasonal production runs.",
    images: [],
    specifications: [
      { label: "Edge Definition", value: "Wirecut planar edges" },
      { label: "Manufacturing Origin", value: "Village Kalwa, Pillukhera (Jind, Haryana)" },
      { label: "Status", value: "Unconfirmed draft - Pending owner review" },
    ],
    availability: "Enquire for Availability",
    availabilityStatus: "available",
    published: false, // DRAFT: kept as unconfirmed draft in admin panel pending owner confirmation
    featured: false,
    applications: [
      "Exposed brick facades and architectural cladding",
      "Precision-jointed decorative compound walls",
      "Interior accent brickwork",
    ],
  },
];

// Helper functions for data access
export function getAllProducts() {
  return products;
}

export function getPublishedProducts() {
  return products.filter((p) => p.published);
}

export function getProductBySlug(slug) {
  if (!slug) return null;
  return products.find((p) => p.slug === slug && p.published) || null;
}

export function getRelatedProducts(currentSlug, limit = 2) {
  return products
    .filter((p) => p.slug !== currentSlug && p.published)
    .slice(0, limit);
}

export function getCategories() {
  const published = getPublishedProducts();
  const categories = Array.from(new Set(published.map((p) => p.category)));
  return ["All Products", ...categories];
}

// Backward-compatibility aliases
export const sampleProducts = products.filter((p) => p.published);
export const productGrades = products;
