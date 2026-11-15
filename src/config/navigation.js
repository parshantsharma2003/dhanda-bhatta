/**
 * Dhanda Bhatta Company - Navigation Configuration
 * Defines header, mobile drawer, footer, and mobile action bar links.
 */

export const navigationConfig = {
  mainNav: [
    { label: "Home", href: "/" },
    { label: "About Kiln", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Gallery", href: "/gallery" },
    { label: "Delivery", href: "/delivery" },
    { label: "Contact", href: "/contact" },
  ],

  actionNav: [
    { label: "Enquire", href: "/enquiry", variant: "outline" },
    { label: "Order Bricks", href: "/order", variant: "primary" },
  ],

  footerSections: [
    {
      title: "Navigation",
      links: [
        { label: "Home Overview", href: "/" },
        { label: "Our Story & Kiln", href: "/about" },
        { label: "Brick Grades & Specs", href: "/products" },
        { label: "Kiln Yard Gallery", href: "/gallery" },
        { label: "Delivery Zones & Fleet", href: "/delivery" },
      ],
    },
    {
      title: "Commercial & Enquiries",
      links: [
        { label: "Contractor Bulk Enquiry", href: "/enquiry" },
        { label: "Direct Truckload Order", href: "/order" },
        { label: "Site Location & Map", href: "/contact" },
        { label: "Dispatch Policies", href: "/delivery#policies" },
      ],
    },
    {
      title: "Manufacturing Grades",
      links: [
        { label: "First Class Red Clay Bricks (Class A)", href: "/products#class-a" },
        { label: "Standard Construction Bricks (Class B)", href: "/products#class-b" },
        { label: "Machine Wirecut Smooth Bricks", href: "/products#wirecut" },
        { label: "Foundation & Soling Bricks", href: "/products#foundation" },
        { label: "Overburnt Clinker Bricks (Jhama)", href: "/products#jhama" },
      ],
    },
  ],

  mobileActionBar: [
    {
      label: "Call Kiln",
      icon: "Phone",
      href: "tel:+919996669463",
      primary: false,
    },
    {
      label: "WhatsApp",
      icon: "MessageSquare",
      href: "https://wa.me/918295669463?text=Hello%20Dhanda%20Bhatta%20Company%2C%20I%20would%20like%20to%20inquire%20about%20brick%20availability%20and%20rates.",
      primary: false,
      external: true,
    },
    {
      label: "Order / Quote",
      icon: "Truck",
      href: "/order",
      primary: true,
    },
  ],
};
