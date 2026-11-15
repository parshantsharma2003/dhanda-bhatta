"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
  Video,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  X,
  Save,
} from "lucide-react";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmationModal from "@/components/admin/ConfirmationModal";

const CATEGORIES = [
  { id: "kiln_operations", label: "Kiln Operations & Firing" },
  { id: "manufacturing_process", label: "Moulding & Drying" },
  { id: "raw_materials", label: "Clay & Silt Extraction" },
  { id: "quality_testing", label: "Quality & Strength Testing" },
  { id: "delivery_fleet", label: "Trolleys & Fleet Logistics" },
];

export default function GalleryClient({ initialAssets = [] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadResourceType, setUploadResourceType] = useState("image");
  const [newAssetData, setNewAssetData] = useState({
    title: "",
    caption: "",
    category: "kiln_operations",
    mediaType: "image",
    secureUrl: "",
    altText: "",
    featured: false,
    status: "published",
  });
  const [isSavingAsset, setIsSavingAsset] = useState(false);

  // Edit modal state
  const [editingAsset, setEditingAsset] = useState(null);
  const [isUpdatingAsset, setIsUpdatingAsset] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setAssets(json.data.assets);
    } catch (err) {
      console.error("[GalleryClient] Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaUploaded = (fileData) => {
    setNewAssetData((prev) => ({
      ...prev,
      secureUrl: fileData.url,
      mediaType: fileData.resourceType || uploadResourceType,
      altText: prev.altText || prev.title || "Dhanda Bhatta Company media",
    }));
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    if (!newAssetData.secureUrl) {
      setMessage({ text: "Please upload a media file or provide a URL first.", type: "error" });
      return;
    }

    setIsSavingAsset(true);
    setMessage({ text: "", type: "" });

    try {
      const catMatch = CATEGORIES.find((c) => c.id === newAssetData.category);
      const payload = {
        ...newAssetData,
        categoryLabel: catMatch ? catMatch.label : newAssetData.category,
        thumbnailUrl: newAssetData.secureUrl,
      };

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to create gallery asset");
      }

      setMessage({ text: `Media "${newAssetData.title}" published to gallery.`, type: "success" });
      setUploadModalOpen(false);
      setNewAssetData({
        title: "",
        caption: "",
        category: "kiln_operations",
        mediaType: "image",
        secureUrl: "",
        altText: "",
        featured: false,
        status: "published",
      });
      fetchAssets();
    } catch (err) {
      console.error("[GalleryClient] Create error:", err);
      setMessage({ text: err.message || "Error creating gallery asset", type: "error" });
    } finally {
      setIsSavingAsset(false);
    }
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    if (!editingAsset) return;

    setIsUpdatingAsset(true);
    try {
      const res = await fetch(`/api/admin/gallery/${editingAsset._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAsset),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update asset");
      }

      setMessage({ text: "Gallery item updated successfully.", type: "success" });
      setEditingAsset(null);
      fetchAssets();
    } catch (err) {
      console.error("[GalleryClient] Update error:", err);
      setMessage({ text: err.message || "Error updating item", type: "error" });
    } finally {
      setIsUpdatingAsset(false);
    }
  };

  const confirmDelete = async () => {
    if (!assetToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/gallery/${assetToDelete._id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete asset");
      }
      setMessage({ text: "Media deleted from gallery.", type: "success" });
      setDeleteModalOpen(false);
      setAssetToDelete(null);
      fetchAssets();
    } catch (err) {
      console.error("[GalleryClient] Delete error:", err);
      setMessage({ text: err.message || "Error deleting asset", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered in memory for swift UI responsiveness
  const filteredAssets = assets.filter((asset) => {
    if (selectedCategory !== "all" && asset.category !== selectedCategory) return false;
    if (selectedType !== "all" && asset.mediaType !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
            Media Management
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Bhatta Media Gallery
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/gallery"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-xs font-heading font-bold text-charcoal transition-colors"
          >
            <span>Live Gallery</span>
            <ExternalLink className="w-3.5 h-3.5 text-secondary-text" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setNewAssetData({
                title: "",
                caption: "",
                category: "kiln_operations",
                mediaType: "image",
                secureUrl: "",
                altText: "",
                featured: false,
                status: "published",
              });
              setUploadModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Media</span>
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-3 border-l-4 flex items-center gap-2 text-xs ${
            message.type === "success"
              ? "bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]"
              : "bg-[#FFEBEE] border-terracotta text-charcoal"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-terracotta" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white border border-border-subtle p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 text-xs font-heading font-semibold transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-terracotta text-white font-bold"
                : "bg-warm-bg text-secondary-text hover:text-charcoal border border-border-subtle"
            }`}
          >
            All Categories ({assets.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = assets.filter((a) => a.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs font-heading font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-terracotta text-white font-bold"
                    : "bg-warm-bg text-secondary-text hover:text-charcoal border border-border-subtle"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Media Type Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-secondary-text">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2 py-1 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:outline-none"
          >
            <option value="all">All Media</option>
            <option value="image">Images Only</option>
            <option value="video">Videos Only</option>
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <div
              key={asset._id}
              className="bg-white border border-border-subtle shadow-2xs flex flex-col justify-between overflow-hidden group hover:border-terracotta transition-colors"
            >
              <div className="relative aspect-4/3 w-full bg-charcoal/10 overflow-hidden">
                {asset.mediaType === "video" ? (
                  <div className="relative w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.thumbnailUrl || asset.secureUrl}
                      alt={asset.altText || asset.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center shadow-md">
                        <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.secureUrl}
                    alt={asset.altText || asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-mono uppercase tracking-wider">
                    {asset.mediaType}
                  </span>
                  {asset.featured && (
                    <span className="px-1.5 py-0.5 bg-terracotta text-white text-[9px] font-mono uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-white" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2">
                  <StatusBadge status={asset.status} />
                </div>
              </div>

              {/* Asset Info Body */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-black text-xs text-charcoal line-clamp-1 mb-0.5">
                    {asset.title}
                  </h3>
                  {asset.caption && (
                    <p className="text-[11px] text-secondary-text line-clamp-2 leading-relaxed">
                      {asset.caption}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px]">
                  <span className="text-secondary-text truncate max-w-[140px]">
                    {asset.categoryLabel || asset.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingAsset(asset)}
                      className="p-1 text-secondary-text hover:text-charcoal cursor-pointer"
                      title="Edit metadata"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAssetToDelete(asset);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1 text-secondary-text hover:text-terracotta cursor-pointer"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-xs text-secondary-text bg-white border border-border-subtle p-8">
            No media found in the selected category. Click &quot;Upload New Media&quot; above to add photographs or video clips from the bhatta.
          </div>
        )}
      </div>

      {/* Upload New Asset Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-border-subtle shadow-xl w-full max-w-lg p-6 space-y-4 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-heading font-black text-lg text-charcoal">
                Publish Media to Bhatta Gallery
              </h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="text-secondary-text hover:text-charcoal p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4 text-xs">
              {/* Media Type Selector */}
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Media Type
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={uploadResourceType === "image"}
                      onChange={() => {
                        setUploadResourceType("image");
                        setNewAssetData({ ...newAssetData, mediaType: "image" });
                      }}
                      className="text-terracotta cursor-pointer"
                    />
                    <span>Photograph (JPG/PNG/WebP)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      checked={uploadResourceType === "video"}
                      onChange={() => {
                        setUploadResourceType("video");
                        setNewAssetData({ ...newAssetData, mediaType: "video" });
                      }}
                      className="text-terracotta cursor-pointer"
                    />
                    <span>Video Clip (MP4/MOV)</span>
                  </label>
                </div>
              </div>

              {/* Cloudinary Direct Uploader */}
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Upload Media File *
                </label>
                <CloudinaryUploader
                  folder="dbc/gallery"
                  resourceType={uploadResourceType}
                  onUploadSuccess={handleMediaUploaded}
                  buttonLabel={uploadResourceType === "video" ? "Upload Kiln Video" : "Upload Photo"}
                />
                {newAssetData.secureUrl && (
                  <div className="mt-2 p-2 bg-warm-bg border border-border-subtle flex items-center justify-between text-[11px]">
                    <span className="truncate max-w-xs text-charcoal font-mono">
                      {newAssetData.secureUrl}
                    </span>
                    <span className="text-[#2E7D32] font-bold">Attached ✓</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bull's Trench Kiln Coal Stoking"
                  value={newAssetData.title}
                  onChange={(e) => setNewAssetData({ ...newAssetData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Category *
                </label>
                <select
                  value={newAssetData.category}
                  onChange={(e) => setNewAssetData({ ...newAssetData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:outline-none focus:border-terracotta"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Caption */}
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief description of the activity shown in this media..."
                  value={newAssetData.caption}
                  onChange={(e) => setNewAssetData({ ...newAssetData, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
                />
              </div>

              {/* Accessibility Alt Text */}
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Alt Text (for accessibility) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Descriptive text for visually impaired visitors"
                  value={newAssetData.altText}
                  onChange={(e) => setNewAssetData({ ...newAssetData, altText: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAssetData.featured}
                    onChange={(e) => setNewAssetData({ ...newAssetData, featured: e.target.checked })}
                    className="w-4 h-4 text-terracotta"
                  />
                  <span className="font-semibold text-charcoal">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAssetData.status === "published"}
                    onChange={(e) =>
                      setNewAssetData({
                        ...newAssetData,
                        status: e.target.checked ? "published" : "draft",
                      })
                    }
                    className="w-4 h-4 text-terracotta"
                  />
                  <span className="font-semibold text-charcoal">Publish Immediately</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-border-subtle flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal text-xs font-heading font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAsset || !newAssetData.secureUrl}
                  className="px-5 py-2 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSavingAsset && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Publish to Gallery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-border-subtle shadow-xl w-full max-w-md p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-heading font-black text-base text-charcoal">
                Edit Gallery Item Details
              </h3>
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="text-secondary-text hover:text-charcoal p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAsset} className="space-y-4 text-xs">
              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingAsset.title}
                  onChange={(e) => setEditingAsset({ ...editingAsset, title: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Category
                </label>
                <select
                  value={editingAsset.category}
                  onChange={(e) => {
                    const catMatch = CATEGORIES.find((c) => c.id === e.target.value);
                    setEditingAsset({
                      ...editingAsset,
                      category: e.target.value,
                      categoryLabel: catMatch ? catMatch.label : e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
                  Caption
                </label>
                <textarea
                  rows={2}
                  value={editingAsset.caption || ""}
                  onChange={(e) => setEditingAsset({ ...editingAsset, caption: e.target.value })}
                  className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAsset.featured}
                    onChange={(e) => setEditingAsset({ ...editingAsset, featured: e.target.checked })}
                    className="w-4 h-4 text-terracotta"
                  />
                  <span className="font-semibold text-charcoal">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAsset.status === "published"}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        status: e.target.checked ? "published" : "draft",
                      })
                    }
                    className="w-4 h-4 text-terracotta"
                  />
                  <span className="font-semibold text-charcoal">Published</span>
                </label>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-charcoal text-xs font-heading font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingAsset}
                  className="px-5 py-2 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdatingAsset && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        title="Delete Media Asset?"
        message={`Are you sure you want to delete "${assetToDelete?.title}" from the bhatta gallery? This action will remove the asset from the public website.`}
        confirmLabel="Delete Media"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setAssetToDelete(null);
        }}
      />
    </div>
  );
}
