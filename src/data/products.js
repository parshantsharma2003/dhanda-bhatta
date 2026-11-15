/**
 * Dhanda Bhatta Company - Product Catalog Data
 *
 * NOTE: The following items represent typical red clay brick varieties produced by
 * regional kilns in Haryana and serve as clearly marked sample catalogue items until
 * the business owner supplies the confirmed product inventory and specifications.
 * No prices or unsupported laboratory claims are assumed.
 */

export const productNotice = {
  isSampleCatalogue: true,
  disclaimer:
    "Sample catalogue entries shown for preview. Confirmed grades and technical specifications will be updated upon client verification.",
};

export const products = [
  {
    id: "prod-1",
    name: "First Class Red Clay Bricks",
    slug: "first-class-red-bricks",
    category: "Structural Masonry",
    shortDescription:
      "Well-burnt red clay bricks with uniform shape, sharp arrises, and clean surface suitable for residential and commercial masonry.",
    description:
      "Selected red clay brick grade crafted from regional alluvial clay in Village Kalwa. Air-cured in shaded hacks and kiln-fired to deliver solid compressive performance for load-bearing masonry, multi-storey framing, and exterior wall construction.",
    images: [
      {
        src: "/images/products/class-1-brick.webp",
        alt: "First Class Red Clay Brick Sample",
        caption: "First Class Red Clay Brick - Uniform face and sharp edges",
        isPlaceholder: true,
      },
      {
        src: "/images/products/class-1-stack.webp",
        alt: "Stacked First Class Red Bricks",
        caption: "Organized cooling pile ready for site transport",
        isPlaceholder: true,
      },
    ],
    // Only verified descriptive parameters; no invented ratings
    specifications: [
      { label: "Raw Material", value: "Locally tested alluvial silt & clay" },
      { label: "Manufacturing Origin", value: "Village Kalwa, Pillukhera (Jind, Haryana)" },
      { label: "Surface Texture", value: "Traditional mould finish suitable for mortar bond" },
      { label: "Forming Method", value: "Traditional hand & mechanical clay moulding" },
      { label: "Recommended Use", value: "Load-bearing residential walls & exterior masonry" },
    ],
    availability: "Available for Batch Orders",
    published: true,
    featured: true,
    isSample: true,
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
    shortDescription:
      "Reliable kiln-fired bricks with good structural strength, widely utilized for internal partition walls, compound boundaries, and infill masonry.",
    description:
      "Dependable clay bricks fired with traditional continuous methods at the Kalwa bhatta. Suitable for all plastered exterior and interior construction applications across nearby areas.",
    images: [
      {
        src: "/images/products/class-2-brick.webp",
        alt: "Standard Construction Brick Sample",
        caption: "Standard Construction Brick - Ideal for plastered walls",
        isPlaceholder: true,
      },
    ],
    specifications: [
      { label: "Raw Material", value: "Selected local clay" },
      { label: "Manufacturing Origin", value: "Village Kalwa, Pillukhera (Jind, Haryana)" },
      { label: "Surface Finish", value: "Standard kiln finish suitable for plaster adhesion" },
      { label: "Recommended Use", value: "Internal partition walls & framed infill" },
    ],
    availability: "Available for Batch Orders",
    published: true,
    featured: true,
    isSample: true,
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
    shortDescription:
      "Heavy and dense kiln-fired bricks selected for sub-base flooring, foundation trenches, and damp-resistant ground soling.",
    description:
      "Dense, hard-fired bricks chosen specifically for ground-level footings, paving sub-bases, and subterranean trenches requiring high moisture resistance and compressive density.",
    images: [
      {
        src: "/images/products/soling-brick.webp",
        alt: "Foundation and Soling Brick Sample",
        caption: "Foundation & Soling Brick - Dense core for ground loading",
        isPlaceholder: true,
      },
    ],
    specifications: [
      { label: "Application Type", value: "Sub-base soling & foundation masonry" },
      { label: "Manufacturing Origin", value: "Village Kalwa, Pillukhera (Jind, Haryana)" },
      { label: "Hardness Characteristic", value: "Dense clay core for ground load distribution" },
    ],
    availability: "Available for Batch Orders",
    published: true,
    featured: false,
    isSample: true,
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
    shortDescription:
      "Wire-sliced facing bricks with defined rectangular arrises and uniform face texture for exposed architectural masonry.",
    description:
      "Draft catalogue entry for machine wirecut bricks intended for contemporary villas, exposed brickwork facades, and precision joints. Availability depends on current seasonal kiln production runs.",
    images: [
      {
        src: "/images/products/wirecut-brick.webp",
        alt: "Machine-Cut Facing Brick Sample",
        caption: "Machine-Cut Facing Brick - Precision cut edges",
        isPlaceholder: true,
      },
    ],
    specifications: [
      { label: "Edge Definition", value: "Wirecut planar edges" },
      { label: "Manufacturing Origin", value: "Village Kalwa, Pillukhera (Jind, Haryana)" },
      { label: "Recommended Use", value: "Exposed brick masonry & architectural facades" },
    ],
    availability: "Enquire for Batch Availability",
    published: true,
    featured: false,
    isSample: true,
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
  const categories = Array.from(new Set(products.map((p) => p.category)));
  return ["All Products", ...categories];
}

// Backward-compatibility aliases for Phase 1 & 2 components
export const sampleProducts = products;
export const productGrades = products;
