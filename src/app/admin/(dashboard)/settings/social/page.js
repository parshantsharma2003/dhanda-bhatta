import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import SocialSettingsClient from "./SocialSettingsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Social Links | Kiln Admin | Dhanda Bhatta Company",
  description: "Manage official social channels including Facebook, Instagram, and YouTube.",
};

async function getSiteSettings() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const settings = await SiteSettings.findOne({ key: "general" }).lean();
      if (settings) return JSON.parse(JSON.stringify(settings));
    }
  } catch (err) {
    console.error("[SocialSettingsPage] Error loading settings:", err);
  }
  return { key: "general", social: {} };
}

export default async function SocialSettingsPage() {
  const settings = await getSiteSettings();
  return <SocialSettingsClient initialSettings={settings} />;
}
