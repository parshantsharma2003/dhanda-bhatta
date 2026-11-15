import connectToDatabase from "@/lib/db";
import GalleryAsset from "@/models/GalleryAsset";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Media Gallery Management | Kiln Admin | Dhanda Bhatta Company",
  description: "Upload and manage high-resolution kiln photos, aerial videos, and batch stacks.",
};

async function getInitialAssets() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const assets = await GalleryAsset.find({ status: { $ne: "archived" } })
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean();
      return JSON.parse(JSON.stringify(assets));
    }
  } catch (err) {
    console.error("[GalleryPage] Error loading assets:", err);
  }
  return [];
}

export default async function GalleryPage() {
  const assets = await getInitialAssets();
  return <GalleryClient initialAssets={assets} />;
}
