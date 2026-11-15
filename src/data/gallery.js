/**
 * Dhanda Bhatta Company - Gallery Media Configuration
 * Authentic photography from our brick manufacturing facility in Village Kalwa, Pillukhera.
 */

export const galleryNotice = {
  isPlaceholder: false,
  note: "Authentic field photography from our brick manufacturing facility in Village Kalwa, Pillukhera (Jind, Haryana).",
};

export const galleryCategories = [
  { id: "all", label: "All Media" },
  { id: "bhatta", label: "Bhatta & Kiln" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "bricks", label: "Bricks & Stock" },
  { id: "delivery", label: "Delivery & Dispatch" },
];

export const galleryItems = [
  {
    id: "gal-1",
    type: "image",
    category: "bhatta",
    categoryLabel: "Bhatta & Kiln",
    title: "Kiln Chimney & Bhatta Facility",
    caption: "The central kiln chimney and brick loading grounds at Village Kalwa, Pillukhera.",
    mediaSrc: "/images/facility/kiln-hero.jpg",
    aspect: "16/9",
    badge: "Facility Overview",
  },
  {
    id: "gal-2",
    type: "image",
    category: "bhatta",
    categoryLabel: "Bhatta & Kiln",
    title: "Bhatta Stockyard Panoramic",
    caption: "High-angle view of kiln yard, continuous trenches, and expansive cured brick stock.",
    mediaSrc: "/images/facility/bhatta-panoramic-yard.png",
    aspect: "4/3",
    badge: "Kiln Yard",
  },
  {
    id: "gal-3",
    type: "image",
    category: "bhatta",
    categoryLabel: "Bhatta & Kiln",
    title: "High-Heat Kiln Firing Chamber",
    caption: "Direct view into an active kiln firing pot showing incandescent coal combustion.",
    mediaSrc: "/images/facility/kiln-fire-chamber.png",
    aspect: "4/3",
    badge: "Kiln Firing",
  },
  {
    id: "gal-4",
    type: "image",
    category: "bhatta",
    categoryLabel: "Bhatta & Kiln",
    title: "Kiln Top Surface & Feed Holes",
    caption: "Top surface of the Bull's trench kiln with cast-iron feed lids for thermal control.",
    mediaSrc: "/images/facility/kiln-top-feed-holes.jpg",
    aspect: "4/3",
    badge: "Thermal Control",
  },
  {
    id: "gal-5",
    type: "image",
    category: "manufacturing",
    categoryLabel: "Manufacturing",
    title: "Green Bricks Sun Drying",
    caption: "Hand-moulded green bricks neatly arranged in open-air drying hacks under natural Haryana sunlight.",
    mediaSrc: "/images/facility/sun-drying-hacks.jpg",
    aspect: "4/3",
    badge: "Clay Curing",
  },
  {
    id: "gal-6",
    type: "image",
    category: "manufacturing",
    categoryLabel: "Manufacturing",
    title: "Field Moulding Rows",
    caption: "Freshly shaped clay bricks aligned in parallel drying rows across the yard grounds.",
    mediaSrc: "/images/facility/green-bricks-field.jpg",
    aspect: "16/9",
    badge: "Field Shaping",
  },
  {
    id: "gal-7",
    type: "image",
    category: "bricks",
    categoryLabel: "Bricks & Stock",
    title: "First Class Brick with 'हनुमान' Mark",
    caption: "Even terracotta texture, sharp corners, and authentic embossed 'हनुमान' brand mark.",
    mediaSrc: "/images/products/class-1-hanuman-brick.jpg",
    aspect: "4/3",
    badge: "Brand Frog Mark",
  },
  {
    id: "gal-8",
    type: "image",
    category: "bricks",
    categoryLabel: "Bricks & Stock",
    title: "Standard Brick with 'HBC' Stamp",
    caption: "Kiln-fired construction bricks featuring the official 'HBC' frog mark.",
    mediaSrc: "/images/products/standard-hbc-brick.jpg",
    aspect: "4/3",
    badge: "Grade 2 Stock",
  },
  {
    id: "gal-9",
    type: "image",
    category: "bricks",
    categoryLabel: "Bricks & Stock",
    title: "Stepped Red Clay Brick Stacks",
    caption: "Well-burnt red clay bricks stacked in stepped pyramids ready for customer dispatch.",
    mediaSrc: "/images/products/class-1-red-brick-stack.jpg",
    aspect: "4/3",
    badge: "Red Brick Stack",
  },
  {
    id: "gal-10",
    type: "image",
    category: "bricks",
    categoryLabel: "Bricks & Stock",
    title: "Cooling Clamp Brick Arrangement",
    caption: "Ventilated cooling stacks in the main stockyard arranged for uniform temperature equilibration.",
    mediaSrc: "/images/products/soling-vent-stack.png",
    aspect: "16/9",
    badge: "Cooling Yard",
  },
  {
    id: "gal-11",
    type: "image",
    category: "bricks",
    categoryLabel: "Bricks & Stock",
    title: "Stockyard Avenues & Sorting Lanes",
    caption: "Spacious avenues between brick stacks facilitating direct truck and trolley entry.",
    mediaSrc: "/images/facility/brick-stock-lanes.png",
    aspect: "4/3",
    badge: "Stockyard",
  },
  {
    id: "gal-12",
    type: "image",
    category: "delivery",
    categoryLabel: "Delivery & Dispatch",
    title: "Direct Transport Loading at Kiln Gate",
    caption: "Red transport lorry loaded with brick stacks for direct site haulage across Jind.",
    mediaSrc: "/images/delivery/truck-loading-delivery.png",
    aspect: "16/9",
    badge: "Site Haulage",
  },
];

export const homepageGalleryItems = galleryItems.slice(0, 4);

export function getGalleryItemsByCategory(categoryId = "all") {
  if (categoryId === "all") return galleryItems;
  return galleryItems.filter((item) => item.category === categoryId);
}
