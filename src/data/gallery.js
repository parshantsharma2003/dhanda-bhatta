/**
 * Dhanda Bhatta Company - Gallery Media Configuration
 * Supports image and video thumbnail placeholders for authentic bhatta media.
 */

export const galleryNotice = {
  isPlaceholder: true,
  note: "Visual placeholders formatted for actual kiln photos and video footage from Village Kalwa.",
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
    title: "Continuous Kiln Firing",
    caption: "Kiln firing trench operations with controlled thermal draft at Village Kalwa.",
    placeholderLabel: "Kiln Firing Trench",
    mediaSrc: "/images/facility/kiln-firing.webp",
    aspect: "16/9",
    specsRequired: "Landscape photograph showing continuous trench kiln firing and thermal chimney.",
    badge: "Kiln Operations",
  },
  {
    id: "gal-2",
    type: "image",
    category: "manufacturing",
    categoryLabel: "Manufacturing",
    title: "Air Drying Hacks",
    caption: "Green bricks carefully arranged in shaded open-air hacks for uniform drying.",
    placeholderLabel: "Sun-Drying Hacks",
    mediaSrc: "/images/facility/drying-hacks.webp",
    aspect: "4/3",
    specsRequired: "Perspective shot of green bricks drying in long geometric rows.",
    badge: "Clay Curing",
  },
  {
    id: "gal-3",
    type: "video",
    category: "bhatta",
    categoryLabel: "Bhatta & Kiln",
    title: "Bhatta Stockyard Overview",
    caption: "Video walkthrough of cured brick stacks ready for transport in Village Kalwa.",
    placeholderLabel: "Stockyard Video Tour",
    mediaSrc: "/images/facility/stockyard-video-thumb.webp",
    duration: "0:45",
    aspect: "4/3",
    specsRequired: "Video walk-through of sorted brick stacks in the main stockyard.",
    badge: "Video Tour",
  },
  {
    id: "gal-4",
    type: "image",
    category: "delivery",
    categoryLabel: "Delivery & Dispatch",
    title: "Trolley Loading & Dispatch",
    caption: "Careful manual loading for local site dispatch in nearby areas.",
    placeholderLabel: "Dispatch Loading",
    mediaSrc: "/images/delivery/trolley-dispatch.webp",
    aspect: "16/9",
    specsRequired: "Tractor-trolley or vehicle loading at the kiln dispatch gate.",
    badge: "Site Dispatch",
  },
  {
    id: "gal-5",
    type: "image",
    category: "bricks",
    categoryLabel: "Bricks & Stock",
    title: "First Class Red Brick Stockpile",
    caption: "Sorted first-class red clay bricks stacked in cooling chambers.",
    placeholderLabel: "First Class Stack",
    mediaSrc: "/images/products/class-1-stack.webp",
    aspect: "4/3",
    specsRequired: "Clean architectural angle showing stacked rows of Class I red bricks.",
    badge: "Brick Stocks",
  },
  {
    id: "gal-6",
    type: "image",
    category: "manufacturing",
    categoryLabel: "Manufacturing",
    title: "Raw Alluvial Clay Preparation",
    caption: "Alluvial clay sourced from the Kalwa agricultural basin, weathered and conditioned.",
    placeholderLabel: "Clay Pugging Bed",
    mediaSrc: "/images/facility/clay-preparation.webp",
    aspect: "16/9",
    specsRequired: "Ground-level shot of clay preparation beds and pugging conditioning.",
    badge: "Raw Material",
  },
];

export const homepageGalleryItems = galleryItems.slice(0, 4);

export function getGalleryItemsByCategory(categoryId = "all") {
  if (categoryId === "all") return galleryItems;
  return galleryItems.filter((item) => item.category === categoryId);
}
