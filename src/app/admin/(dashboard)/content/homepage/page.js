import connectToDatabase from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import HomepageEditorClient from "./HomepageEditorClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Homepage Editor | Kiln Admin | Dhanda Bhatta Company",
  description: "Manage homepage hero copy, call to actions, statistics, and preview text.",
};

async function getHomepageContent() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const content = await SiteContent.findOne({ key: "homepage" }).lean();
      if (content) return JSON.parse(JSON.stringify(content));
    }
  } catch (err) {
    console.error("[HomepageEditorPage] Error loading content:", err);
  }
  return { key: "homepage", status: "published", publishedData: {}, draftData: {} };
}

export default async function HomepageEditorPage() {
  const content = await getHomepageContent();
  return <HomepageEditorClient initialContent={content} />;
}
