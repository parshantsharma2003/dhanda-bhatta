import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import SeoSettingsClient from "./SeoSettingsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SEO & Search Engine Settings | Kiln Admin | Dhanda Bhatta Company",
  description: "Configure global meta titles, description, Open Graph share cards, and crawler indexing.",
};

async function getSiteSettings() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const settings = await SiteSettings.findOne({ key: "general" }).lean();
      if (settings) return JSON.parse(JSON.stringify(settings));
    }
  } catch (err) {
    console.error("[SeoSettingsPage] Error loading settings:", err);
  }
  return { key: "general", seo: {} };
}

export default async function SeoSettingsPage() {
  const settings = await getSiteSettings();
  return <SeoSettingsClient initialSettings={settings} />;
}
