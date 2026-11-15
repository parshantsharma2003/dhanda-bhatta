import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import DeliverySettingsClient from "./DeliverySettingsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Delivery Logistics | Kiln Admin | Dhanda Bhatta Company",
  description: "Configure delivery zones, distance limits, minimum batch quantities, and vehicle fleets.",
};

async function getSiteSettings() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const settings = await SiteSettings.findOne({ key: "general" }).lean();
      if (settings) return JSON.parse(JSON.stringify(settings));
    }
  } catch (err) {
    console.error("[DeliverySettingsPage] Error loading settings:", err);
  }
  return { key: "general", delivery: {} };
}

export default async function DeliverySettingsPage() {
  const settings = await getSiteSettings();
  return <DeliverySettingsClient initialSettings={settings} />;
}
