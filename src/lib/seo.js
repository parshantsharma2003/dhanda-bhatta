/**
 * Dhanda Bhatta Company - Centralized SEO Configuration & Structured Data Utilities
 *
 * Adheres strictly to Google Search Essentials and Google Business Profile guidelines:
 * - Configurable production canonical URL (never localhost).
 * - Genuine business information: Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana.
 * - Zero invented data: No fake reviews, ratings, coordinates, certifications, or fictitious prices.
 */

// Production base URL resolution with fallback to official domain
export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envUrl && typeof envUrl === "string" && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.replace(/\/+$/, "");
  }
  return "https://dhandabhattacompany.com";
}

export const SITE_URL = getSiteUrl();

export const BUSINESS_INFO = {
  name: "Dhanda Bhatta Company",
  legalName: "Dhanda Bhatta Company",
  brand: "Dhanda Bhatta Company",
  category: "Brick Manufacturer & Building Materials Supplier",
  description:
    "Dhanda Bhatta Company is an established red clay brick manufacturer based in Village Kalwa, near Dharoli Gausala, Pillukhera, Jind, Haryana. We supply quality kiln-fired construction bricks with batch delivery available across nearby areas.",
  address: {
    streetAddress: "Village Kalwa, near Dharoli Gausala",
    addressLocality: "Pillukhera",
    addressRegion: "Haryana",
    postalCode: "126113",
    addressCountry: "IN",
  },
  displayAddress: "Village Kalwa, near Dharoli Gausala, Tehsil Pillukhera, District Jind, Haryana - 126113",
  shortLocation: "Kalwa, Pillukhera, Jind, Haryana",
  areaServed: [
    "Kalwa",
    "Pillukhera",
    "Jind",
    "Safidon",
    "Assandh",
    "Panipat",
    "Gohana",
    "Rohtak",
    "Kaithal",
    "Haryana",
  ],
  phone: "+919996669463",
  phoneDisplay: "+91 99966-69463",
  whatsappNumber: "918295669463",
  whatsappDisplay: "+91 82956-69463",
  googleMapsUrl: "https://share.google/60pwtYCEIZ6sF7aGz",
  sameAs: [
    "https://www.instagram.com/dhanda.bhatta?srtk=dXBjZmhmdzAwM3U4",
    "https://www.facebook.com/share/1Js74GJbZ8/",
    "https://www.youtube.com/@dhandabhattacompany",
  ],
  defaultOgImage: "/images/facility/kiln-hero.webp",
  locale: "en_IN",
  alternateLocales: ["hi_IN"],
};

export const TARGET_KEYWORDS = [
  "brick manufacturer in Jind",
  "bricks supplier in Jind",
  "bhatta in Pillukhera",
  "brick manufacturer in Pillukhera",
  "red clay bricks in Jind",
  "building bricks supplier",
  "bulk bricks supplier in Haryana",
  "brick manufacturer near Gohana",
  "bricks near me",
  "Dhanda Bhatta Company",
  "Kalwa brick kiln",
];

/**
 * Builds a clean canonical URL for a path.
 */
export function getCanonicalUrl(pathname = "") {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${cleanPath === "/" ? "" : cleanPath}`;
}

/**
 * Generates uniform Next.js page metadata.
 */
export function generatePageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  ogImage = BUSINESS_INFO.defaultOgImage,
  ogType = "website",
  robots = null,
  noIndex = false,
}) {
  const canonical = getCanonicalUrl(path);
  const isHome = path === "" || path === "/";
  const pageTitle = title || "Quality Red Clay Bricks";
  const resolvedTitle = isHome
    ? { absolute: `${BUSINESS_INFO.name} | Brick Manufacturer in Jind, Haryana` }
    : pageTitle;
  const resolvedOgTitle = isHome
    ? `${BUSINESS_INFO.name} | Brick Manufacturer in Jind, Haryana`
    : `${pageTitle} | ${BUSINESS_INFO.name}`;
  const resolvedDescription = description || BUSINESS_INFO.description;

  const robotsDirective = noIndex
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      }
    : robots || {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      };

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: [...new Set([...keywords, ...TARGET_KEYWORDS])],
    alternates: {
      canonical,
      languages: {
        "en-IN": canonical,
        "x-default": canonical,
      },
    },
    robots: robotsDirective,
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: BUSINESS_INFO.name,
      locale: BUSINESS_INFO.locale,
      type: ogType,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${getSiteUrl()}${ogImage}`,
          width: 1200,
          height: 630,
          alt: `${BUSINESS_INFO.name} - Brick Kiln in Kalwa, Jind`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description: resolvedDescription,
      images: [ogImage.startsWith("http") ? ogImage : `${getSiteUrl()}${ogImage}`],
    },
  };
}

/**
 * Generates Schema.org LocalBusiness structured data.
 * Adheres strictly to Google guidelines: contains ONLY verified facts.
 */
export function generateLocalBusinessSchema(settings = null) {
  const siteUrl = getSiteUrl();
  const address = settings?.business?.address || BUSINESS_INFO.displayAddress;
  const phone = settings?.business?.phone;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.legalName,
    url: siteUrl,
    description: BUSINESS_INFO.description,
    telephone: phone || BUSINESS_INFO.phone,
    image: [
      `${siteUrl}/images/facility/kiln-hero.webp`,
      `${siteUrl}/images/facility/bhatta-kiln-overview.webp`,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_INFO.address.streetAddress,
      addressLocality: BUSINESS_INFO.address.addressLocality,
      addressRegion: BUSINESS_INFO.address.addressRegion,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.addressCountry,
    },
    areaServed: BUSINESS_INFO.areaServed.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    hasMap: settings?.business?.googleMapsUrl || BUSINESS_INFO.googleMapsUrl,
    sameAs: BUSINESS_INFO.sameAs,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Bank Transfer, UPI",
  };

  // Include email if confirmed
  if (settings?.business?.email && !settings.business.email.includes("example.com")) {
    schema.email = settings.business.email;
  }

  return schema;
}

/**
 * Generates Schema.org Organization structured data.
 */
export function generateOrganizationSchema() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.legalName,
    url: siteUrl,
    logo: `${siteUrl}/images/facility/kiln-hero.webp`,
    sameAs: BUSINESS_INFO.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS_INFO.phone,
      contactType: "Customer Support & Dispatch",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data.
 */
export function generateBreadcrumbSchema(items = []) {
  const siteUrl = getSiteUrl();

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
  ];

  items.forEach((item, index) => {
    itemListElement.push({
      "@type": "ListItem",
      position: index + 2,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

/**
 * Generates Schema.org Product structured data for published bricks.
 * Zero fabricated claims: Does NOT invent fictitious ratings, reviews, or prices.
 */
export function generateProductSchema(product) {
  if (!product) return null;
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/products/${product.slug}`;

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.src ||
    product.images?.[0]?.src ||
    product.images?.[0]?.url ||
    BUSINESS_INFO.defaultOgImage;

  const fullImageUrl = primaryImage.startsWith("http")
    ? primaryImage
    : `${siteUrl}${primaryImage.startsWith("/") ? "" : "/"}${primaryImage}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: [fullImageUrl],
    url: productUrl,
    sku: `DBC-${product.slug.toUpperCase()}`,
    category: product.category || "Building Materials > Bricks",
    brand: {
      "@type": "Brand",
      name: BUSINESS_INFO.name,
    },
    manufacturer: {
      "@type": "Organization",
      name: BUSINESS_INFO.name,
    },
    material: "Kiln-Fired Alluvial Clay",
    countryOfOrigin: {
      "@type": "Country",
      name: "India",
    },
  };

  // If specific weight or dimensions are verified, attach additionalProperty
  if (product.dimensions?.length) {
    schema.additionalProperty = [
      {
        "@type": "PropertyValue",
        name: "Dimensions",
        value: `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} ${product.dimensions.unit || "mm"}`,
      },
    ];
  }

  return schema;
}
