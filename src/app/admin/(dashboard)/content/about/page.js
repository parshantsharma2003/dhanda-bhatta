import connectToDatabase from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import AboutEditorClient from "./AboutEditorClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About Us Editor | Kiln Admin | Dhanda Bhatta Company",
  description: "Manage about page heritage history, manufacturing philosophy, and core company values.",
};

async function getAboutContent() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const content = await SiteContent.findOne({ key: "about" }).lean();
      if (content) return JSON.parse(JSON.stringify(content));
    }
  } catch (err) {
    console.error("[AboutEditorPage] Error loading content:", err);
  }
  return { key: "about", status: "published", publishedData: {}, draftData: {} };
}

export default async function AboutEditorPage() {
  const content = await getAboutContent();
  return <AboutEditorClient initialContent={content} />;
}
