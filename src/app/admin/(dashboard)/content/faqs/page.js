import connectToDatabase from "@/lib/db";
import SiteContent from "@/models/SiteContent";
import FaqsEditorClient from "./FaqsEditorClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FAQs Management | Kiln Admin | Dhanda Bhatta Company",
  description: "Organize, update, and publish customer frequently asked questions.",
};

async function getFaqsContent() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const content = await SiteContent.findOne({ key: "faqs" }).lean();
      if (content) return JSON.parse(JSON.stringify(content));
    }
  } catch (err) {
    console.error("[FaqsPage] Error loading FAQs:", err);
  }
  return { key: "faqs", status: "published", publishedData: {}, draftData: {} };
}

export default async function FaqsPage() {
  const content = await getFaqsContent();
  return <FaqsEditorClient initialContent={content} />;
}
