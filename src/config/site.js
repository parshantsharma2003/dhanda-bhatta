/**
 * Dhanda Bhatta Company - Site & Business Configuration
 * Central source of truth for business information, contact points, media paths, and navigation.
 *
 * Known facts:
 * - Business name: Dhanda Bhatta Company
 * - Location: Village Kalwa, Pillukhera, Jind, Haryana, India
 * - Business type: Brick manufacturing and supply
 * - Delivery: Available in nearby areas
 *
 * All other contact information, media, and catalogue entries are kept strictly configurable.
 */

import { getSiteUrl } from "@/lib/seo";

export const siteConfig = {
  name: "Dhanda Bhatta Company",
  legalName: "Dhanda Bhatta Company",
  tagline: "Quality Clay Bricks for Construction & Infrastructure",
  description:
    "Dhanda Bhatta Company is an established brick manufacturing and supply business located in Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana. Providing quality clay bricks with nearby area delivery.",
  url: getSiteUrl(),

  // Verified Business Information
  location: {
    village: "Village Kalwa",
    landmark: "Near Dharoli Gausala",
    tehsil: "Pillukhera",
    district: "Jind",
    state: "Haryana",
    country: "India",
    pinCode: "126113",
    displayAddress: "Village Kalwa, near Dharoli Gausala, Tehsil Pillukhera, District Jind, Haryana - 126113",
    shortLocation: "Kalwa, Pillukhera, Jind",
    directionsUrl: "https://share.google/60pwtYCEIZ6sF7aGz",
    // Embed map URL: Leave empty or null until owner provides an approved Google Maps Embed API iframe URL
    embedMapUrl: null,
  },

  // Verified Contact Channels
  contact: {
    primaryPhone: "+919996669463",
    primaryPhoneDisplay: "+91 99966-69463",
    secondaryPhone: "+918295669463",
    secondaryPhoneDisplay: "+91 82956-69463",
    whatsappNumber: "918295669463",
    whatsappDisplay: "+91 82956-69463",
    email: "contact@dhandabhattacompany.com",
    isPlaceholder: false, // Confirmed verified business contact channels
  },

  // Operating Hours
  hours: {
    display: "Monday – Sunday: 7:00 AM – 7:00 PM",
    availabilityNote: "Operating daily during regular brick loading & dispatch hours",
  },

  // Delivery Information (Verified: delivery available in nearby areas)
  delivery: {
    scope: "Available in nearby areas across Jind and surrounding regions",
    enquiryAction: "/enquiry",
    minimumBatchNotice: "Batch delivery arranged for residential, agricultural, and commercial construction projects.",
  },

  // Configurable Media Placeholders (Allows swapping with actual field photographs)
  media: {
    hero: {
      src: "/images/facility/kiln-hero.webp",
      alt: "Dhanda Bhatta Company Brick Kiln at Village Kalwa",
      isPlaceholder: true,
    },
    about: {
      src: "/images/facility/bhatta-kiln-overview.webp",
      alt: "Bhatta operations at Village Kalwa, Pillukhera",
      isPlaceholder: true,
    },
    facility: {
      src: "/images/facility/kiln-firing.webp",
      alt: "Continuous Kiln Firing Chamber",
      isPlaceholder: true,
    },
    drying: {
      src: "/images/facility/drying-hacks.webp",
      alt: "Green Clay Bricks Air-Drying in Hacks",
      isPlaceholder: true,
    },
  },

  // Verified Social Media Profiles
  socialLinks: [
    {
      name: "Instagram",
      label: "Instagram",
      href: "https://www.instagram.com/dhanda.bhatta?srtk=dXBjZmhmdzAwM3U4",
      url: "https://www.instagram.com/dhanda.bhatta?srtk=dXBjZmhmdzAwM3U4",
      icon: "instagram",
    },
    {
      name: "Facebook",
      label: "Facebook",
      href: "https://www.facebook.com/share/1Js74GJbZ8/",
      url: "https://www.facebook.com/share/1Js74GJbZ8/",
      icon: "facebook",
    },
    {
      name: "YouTube",
      label: "YouTube",
      href: "https://www.youtube.com/@dhandabhattacompany",
      url: "https://www.youtube.com/@dhandabhattacompany",
      icon: "youtube",
    },
  ],

  // Direct External Navigation Links
  links: {
    googleMaps: "https://share.google/60pwtYCEIZ6sF7aGz",
  },
};
