import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import BusinessSettingsClient from "./BusinessSettingsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Business Details | Kiln Admin | Dhanda Bhatta Company",
  description: "Configure official company name, address, customer telephone numbers, and location URLs.",
};

async function getSiteSettings() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const settings = await SiteSettings.findOne({ key: "general" }).lean();
      if (settings) return JSON.parse(JSON.stringify(settings));
    }
  } catch (err) {
    console.error("[BusinessSettingsPage] Error loading settings:", err);
  }
  return { key: "general", business: {}, social: {}, delivery: {}, seo: {} };
}

export default async function BusinessSettingsPage() {
  const settings = await getSiteSettings();
  return <BusinessSettingsClient initialSettings={settings} />;
}
