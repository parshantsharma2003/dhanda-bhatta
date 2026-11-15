"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Star,
  Loader2,
  AlertCircle,
  CheckCircle,
  Package,
} from "lucide-react";
import CloudinaryUploader from "@/components/admin/CloudinaryUploader";

export default function ProductForm({ initialProduct = null, isEdit = false }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    category: initialProduct?.category || "Structural Masonry",
    grade: initialProduct?.grade || "Class 1 - Red Burnt",
    shortDescription: initialProduct?.shortDescription || "",
    description: initialProduct?.description || "",
    status: initialProduct?.status || "published",
    featured: initialProduct?.featured ?? false,
    sortOrder: initialProduct?.sortOrder ?? 0,
    availability: initialProduct?.availability || "Available for Batch Orders",
    availabilityStatus: initialProduct?.availabilityStatus || "in_stock",
    minOrderQuantity: initialProduct?.minOrderQuantity || 3000,
    leadTime: initialProduct?.leadTime || "1-3 Business Days",
    dimensions: {
      length: initialProduct?.dimensions?.length || 230,
      width: initialProduct?.dimensions?.width || 110,
      height: initialProduct?.dimensions?.height || 75,
      unit: initialProduct?.dimensions?.unit || "mm",
    },
    weight: {
      value: initialProduct?.weight?.value || 3.2,
      unit: initialProduct?.weight?.unit || "kg",
    },
    compressiveStrength: {
      value: initialProduct?.compressiveStrength?.value || 10.5,
      unit: initialProduct?.compressiveStrength?.unit || "N/mm²",
    },
    waterAbsorption: {
      value: initialProduct?.waterAbsorption?.value || 15,
      unit: initialProduct?.waterAbsorption?.unit || "%",
    },
    specifications: initialProduct?.specifications?.length
      ? initialProduct.specifications
      : [
          { label: "Standard Size", value: "9 x 4.25 x 2.75 inches" },
          { label: "Kiln Type", value: "Fixed Chimney Bull's Trench Kiln" },
        ],
    applications: initialProduct?.applications?.length
      ? initialProduct.applications
      : ["Exterior Load-bearing Walls", "Foundations", "Boundary Walls"],
    images: initialProduct?.images?.length ? initialProduct.images : [],
    seo: {
      title: initialProduct?.seo?.title || "",
      description: initialProduct?.seo?.description || "",
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [newApplication, setNewApplication] = useState("");

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      // Auto-generate slug only if new product or slug was untampered
      slug: !isEdit && !prev.slugIsCustom
        ? name
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .slice(0, 80)
        : prev.slug,
    }));
  };

  const handleImageUploaded = (asset) => {
    const isFirst = formData.images.length === 0;
    const newImage = {
      url: asset.url,
      alt: formData.name ? `${formData.name} Brick` : "Dhanda Bhatta Product",
      caption: "",
      isPrimary: isFirst,
    };
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImage],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const nextImages = prev.images.filter((_, i) => i !== index);
      // If we removed the primary image, promote first available
      if (nextImages.length > 0 && !nextImages.some((img) => img.isPrimary)) {
        nextImages[0].isPrimary = true;
      }
      return { ...prev, images: nextImages };
    });
  };

  const handleSetPrimaryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  const handleAddSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const handleUpdateSpecification = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.specifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, specifications: updated };
    });
  };

  const handleRemoveSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleAddApplication = (e) => {
    e.preventDefault();
    if (!newApplication.trim()) return;
    setFormData((prev) => ({
      ...prev,
      applications: [...prev.applications, newApplication.trim()],
    }));
    setNewApplication("");
  };

  const handleRemoveApplication = (index) => {
    setFormData((prev) => ({
      ...prev,
      applications: prev.applications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setIsSaving(true);

    try {
      const url = isEdit
        ? `/api/admin/products/${initialProduct._id}`
        : "/api/admin/products";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save product");
      }

      setMessage({
        text: `Product "${formData.name}" successfully ${isEdit ? "updated" : "created"}!`,
        type: "success",
      });

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error("[ProductForm] Save error:", err);
      setMessage({ text: err.message || "Error saving product", type: "error" });
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 border border-border-subtle bg-white hover:bg-warm-bg text-secondary-text hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-0.5">
              {isEdit ? "Product Editor" : "New Catalogue Entry"}
            </span>
            <h1 className="font-heading font-black text-2xl text-charcoal tracking-tight">
              {isEdit ? `Edit: ${initialProduct?.name}` : "Create New Brick Product"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-xs font-heading font-bold uppercase tracking-wider text-charcoal transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? "Saving..." : isEdit ? "Update Product" : "Save Product"}</span>
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 border-l-4 flex items-center gap-3 text-xs ${
            message.type === "success"
              ? "bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]"
              : "bg-[#FFEBEE] border-terracotta text-charcoal"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-terracotta" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <h2 className="font-heading font-black text-base text-charcoal pb-2 border-b border-border-subtle">
          1. General Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Standard Red Clay Brick (Class 1)"
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: e.target.value.toLowerCase().replace(/[^\w-]/g, ""),
                  slugIsCustom: true,
                }))
              }
              placeholder="e.g. standard-red-clay-brick"
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle font-mono text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta cursor-pointer"
            >
              <option value="Structural Masonry">Structural Masonry</option>
              <option value="Engineering & Foundation">Engineering & Foundation</option>
              <option value="Fly Ash & Eco">Fly Ash & Eco</option>
              <option value="Perforated & Acoustic">Perforated & Acoustic</option>
              <option value="Paver & Landscape">Paver & Landscape</option>
              <option value="Specialty Bricks">Specialty Bricks</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Manufacturing Grade
            </label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              placeholder="e.g. Class 1 - Kiln Burnt (Awal)"
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
            Short Description * (Catalog summary, max 300 characters)
          </label>
          <textarea
            required
            rows={2}
            maxLength={300}
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="High-density red clay bricks fired in our traditional Bull's Trench Kiln in Kalwa, Haryana..."
            className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
          />
        </div>

        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
            Full Description * (Detailed technical and architectural description)
          </label>
          <textarea
            required
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Comprehensive description of composition, clay quality, curing process, and engineering suitability..."
            className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
          />
        </div>
      </div>

      {/* Section 2: Product Images (Cloudinary) */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div>
            <h2 className="font-heading font-black text-base text-charcoal">
              2. Product Media & Images
            </h2>
            <p className="text-xs text-secondary-text">
              High resolution photographs of the brick face, batch stacks, and kilns
            </p>
          </div>
          <CloudinaryUploader
            folder="dbc/products"
            resourceType="image"
            onUploadSuccess={handleImageUploaded}
            buttonLabel="Add Product Photo"
          />
        </div>

        {formData.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
            {formData.images.map((img, idx) => (
              <div
                key={idx}
                className={`border p-2 bg-warm-bg relative flex flex-col justify-between ${
                  img.isPrimary ? "border-terracotta shadow-xs ring-1 ring-terracotta" : "border-border-subtle"
                }`}
              >
                <div className="relative aspect-4/3 w-full bg-charcoal/10 overflow-hidden mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt || "Product image"} className="w-full h-full object-cover" />
                  {img.isPrimary && (
                    <span className="absolute top-1 left-1 bg-terracotta text-white text-[9px] font-mono uppercase font-bold px-1.5 py-0.5">
                      Primary
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <input
                    type="text"
                    placeholder="Image Alt text"
                    value={img.alt}
                    onChange={(e) => {
                      const updated = [...formData.images];
                      updated[idx].alt = e.target.value;
                      setFormData({ ...formData, images: updated });
                    }}
                    className="w-full px-1.5 py-1 bg-white border border-border-subtle text-[11px]"
                  />

                  <div className="flex items-center justify-between pt-1">
                    {!img.isPrimary ? (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="text-[10px] text-secondary-text hover:text-terracotta font-semibold cursor-pointer"
                      >
                        Set Primary
                      </button>
                    ) : (
                      <span className="text-[10px] text-terracotta font-bold">Featured Cover</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="text-secondary-text hover:text-terracotta p-1 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-border-subtle bg-warm-bg/50 text-center text-xs text-secondary-text">
            No images uploaded yet. Use the button above to upload from your computer or provide an image link.
          </div>
        )}
      </div>

      {/* Section 3: Technical Specifications & Measurements */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <h2 className="font-heading font-black text-base text-charcoal pb-2 border-b border-border-subtle">
          3. Technical Metrics & Physical Dimensions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Length ({formData.dimensions.unit})
            </label>
            <input
              type="number"
              value={formData.dimensions.length}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, length: Number(e.target.value) },
                })
              }
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal"
            />
          </div>
          <div>
            <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Width ({formData.dimensions.unit})
            </label>
            <input
              type="number"
              value={formData.dimensions.width}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, width: Number(e.target.value) },
                })
              }
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal"
            />
          </div>
          <div>
            <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Height ({formData.dimensions.unit})
            </label>
            <input
              type="number"
              value={formData.dimensions.height}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, height: Number(e.target.value) },
                })
              }
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal"
            />
          </div>
          <div>
            <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Weight ({formData.weight.unit})
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.weight.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  weight: { ...formData.weight, value: Number(e.target.value) },
                })
              }
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Compressive Strength ({formData.compressiveStrength.unit})
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.compressiveStrength.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  compressiveStrength: {
                    ...formData.compressiveStrength,
                    value: Number(e.target.value),
                  },
                })
              }
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal"
            />
          </div>
          <div>
            <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Water Absorption ({formData.waterAbsorption.unit})
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.waterAbsorption.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  waterAbsorption: {
                    ...formData.waterAbsorption,
                    value: Number(e.target.value),
                  },
                })
              }
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal"
            />
          </div>
        </div>

        {/* Dynamic Specifications Key-Value List */}
        <div className="pt-4 border-t border-border-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-charcoal">
              Additional Technical Specifications:
            </span>
            <button
              type="button"
              onClick={handleAddSpecification}
              className="inline-flex items-center gap-1 text-xs text-terracotta hover:underline font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          </div>

          <div className="space-y-2">
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Specification Name (e.g. Efflorescence)"
                  value={spec.label}
                  onChange={(e) => handleUpdateSpecification(idx, "label", e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-warm-bg border border-border-subtle text-xs text-charcoal"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Nil to Slight)"
                  value={spec.value}
                  onChange={(e) => handleUpdateSpecification(idx, "value", e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-warm-bg border border-border-subtle text-xs text-charcoal"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecification(idx)}
                  className="p-1.5 text-secondary-text hover:text-terracotta cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Operational Logistics & Visibility */}
      <div className="bg-white border border-border-subtle p-6 shadow-2xs space-y-4">
        <h2 className="font-heading font-black text-base text-charcoal pb-2 border-b border-border-subtle">
          4. Logistics, Supply & Publishing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Minimum Order Qty (pcs)
            </label>
            <input
              type="number"
              value={formData.minOrderQuantity}
              onChange={(e) => setFormData({ ...formData, minOrderQuantity: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Dispatch Lead Time
            </label>
            <input
              type="text"
              value={formData.leadTime}
              onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
              placeholder="e.g. 1-2 Days"
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-charcoal mb-1">
              Catalog Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal cursor-pointer"
            >
              <option value="published">Published (Visible to Customers)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-heading font-bold text-charcoal">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-terracotta border-border-subtle rounded-none cursor-pointer"
            />
            <span>Feature on Homepage Showcase</span>
          </label>
        </div>

        {/* SEO Meta Fields */}
        <div className="pt-4 border-t border-border-subtle space-y-3">
          <span className="text-xs font-heading font-bold uppercase tracking-wider text-charcoal block">
            SEO & Search Engine Metadata (Optional):
          </span>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Custom Meta Title (Default: Product Name | Dhanda Bhatta Company)"
                value={formData.seo.title}
                onChange={(e) =>
                  setFormData({ ...formData, seo: { ...formData.seo, title: e.target.value } })
                }
                className="w-full px-3 py-1.5 bg-warm-bg border border-border-subtle text-xs text-charcoal"
              />
            </div>
            <div>
              <textarea
                rows={2}
                placeholder="Meta Description snippet for Google Search..."
                value={formData.seo.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seo: { ...formData.seo, description: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 bg-warm-bg border border-border-subtle text-xs text-charcoal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
        <Link
          href="/admin/products"
          className="px-4 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-xs font-heading font-bold uppercase tracking-wider text-charcoal transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? "Saving Changes..." : isEdit ? "Save Product Changes" : "Create Product"}</span>
        </button>
      </div>
    </form>
  );
}
