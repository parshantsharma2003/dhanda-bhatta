/**
 * Dhanda Bhatta Company - Delivery Zones & Logistics Data
 * Covers Village Kalwa kiln origin, key dispatch destinations in Jind district & Haryana.
 */

export const deliveryHub = {
  origin: "Village Kalwa, Tehsil Pillukhera, District Jind, Haryana",
  hubPincode: "126113",
  leadTime: "Same-day or next-day delivery depending on batch volume and transport scheduling",
  dailyDispatchCapacity: "Up to 50,000+ bricks during peak construction season",
};

export const primaryDeliveryZones = [
  {
    zone: "Zone 1: Immediate Kiln Perimeter (0 - 15 km)",
    tag: "Express Local Dispatch",
    transitTime: "Within 2 - 4 hours of loading",
    towns: [
      "Village Kalwa (Local)",
      "Pillukhera Town & Mandi",
      "Budha Khera",
      "Jamni",
      "Dhatrath",
      "Gangoli",
      "Muana",
    ],
    transportModes: ["Tractor-Trolley (3,000 - 4,500 bricks)", "Light Commercial Vehicles"],
    minOrder: "3,000 Bricks (1 standard trolley)",
    notes: "Direct access to rural roads and residential construction plots with minimal transit friction.",
  },
  {
    zone: "Zone 2: Core Jind & Safidon Belt (15 - 35 km)",
    tag: "Daily Supply Corridors",
    transitTime: "Same-day delivery (4 - 8 hours)",
    towns: [
      "Jind City (Urban & Bypass)",
      "Safidon Sub-Division",
      "Uchana",
      "Alewa",
      "Julana",
      "Naguran",
    ],
    transportModes: ["Heavy Tractor-Trolley", "Single-Axle 6-Wheeler Truck", "Multi-Axle Tipper"],
    minOrder: "4,000 - 7,000 Bricks",
    notes: "Regular scheduled truckloads to housing colonies, commercial plazas, and bypass road works.",
  },
  {
    zone: "Zone 3: Neighboring Districts (35 - 75 km)",
    tag: "High-Volume Transit",
    transitTime: "Scheduled next-day or designated dispatch slots",
    towns: [
      "Gohana (Sonipat district)",
      "Assandh (Karnal district)",
      "Panipat Industrial Outskirts",
      "Rohtak Northern Belt",
      "Kaithal Border Towns",
      "Hansi / Narnaund",
    ],
    transportModes: ["10-Wheeler Heavy Tippers", "Commercial Fleet Carriers (7,000 - 10,000+ units)"],
    minOrder: "7,000 Bricks (Full truckload recommended for freight efficiency)",
    notes: "Optimized for large infrastructure contractors, institutional projects, and building material stockists.",
  },
];

export const fleetVehicles = [
  {
    name: "Tractor-Trolley (Local Workhorse)",
    capacity: "3,000 to 4,500 Bricks",
    bestFor: "Residential sites, narrow rural lanes, unpaved plot approaches, and direct plot entry.",
    unloading: "Manual orderly stacking or controlled hydraulic tipping.",
    accessibility: "High maneuverability in village alleys and residential colonies.",
  },
  {
    name: "Heavy Commercial Truck / 10-Wheeler Tipper",
    capacity: "7,000 to 10,000+ Bricks",
    bestFor: "Commercial developments, highway infrastructure, factories, and bulk building material stockists.",
    unloading: "Rapid hydraulic tipper discharge onto designated level staging yard.",
    accessibility: "Requires minimum 18-foot wide approach road and overhead clearance from power cables.",
  },
];

export const unloadingGuidelines = [
  {
    title: "Site Approach Road Inspection",
    description:
      "Ensure the approach to your plot is free of loose mud, open trenches, or low-hanging power cables that could impede a loaded 10-ton to 25-ton vehicle.",
  },
  {
    title: "Designated Stacking Ground",
    description:
      "Select flat, dry, well-compacted ground near the masonry site to avoid repetitive double-handling and potential breakages.",
  },
  {
    title: "Manual Stacking vs. Mechanical Tipping",
    description:
      "Manual unloading preserves pristine brick corners (recommended for Class-I exposed brickwork). Hydraulic tipping is faster for large foundations and soling works.",
  },
  {
    title: "Site Verification at Delivery",
    description:
      "Our driver provides a physical delivery challan stating brick grade, count, and dispatch timestamp for direct on-site verification before discharge.",
  },
];
