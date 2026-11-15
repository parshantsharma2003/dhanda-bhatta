"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Archive,
  ExternalLink,
  Star,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmationModal from "@/components/admin/ConfirmationModal";

export default function ProductListClient({ initialProducts = [], initialPagination = {} }) {
  const [products, setProducts] = useState(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Modal confirmation state
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [productToArchive, setProductToArchive] = useState(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const fetchProducts = async (page = 1) => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category) params.set("category", category);
      if (status) params.set("status", status);
      params.set("page", page.toString());
      params.set("limit", "10");

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load products");
      }
      setProducts(json.data.products);
      setPagination(json.data.pagination);
    } catch (err) {
      console.error("[ProductListClient] Fetch error:", err);
      setMessage({ text: err.message || "Error updating catalogue", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const handleArchiveClick = (product) => {
    setProductToArchive(product);
    setArchiveModalOpen(true);
  };

  const confirmArchive = async () => {
    if (!productToArchive) return;
    setIsArchiving(true);
    try {
      const res = await fetch(`/api/admin/products/${productToArchive._id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to archive product");
      }
      setMessage({ text: `Product "${productToArchive.name}" archived successfully.`, type: "success" });
      setArchiveModalOpen(false);
      setProductToArchive(null);
      // Refresh list
      fetchProducts(pagination.page || 1);
    } catch (err) {
      console.error("[ProductListClient] Archive error:", err);
      setMessage({ text: err.message || "Error archiving product", type: "error" });
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-sandstone uppercase block mb-1">
            Catalogue Management
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-charcoal tracking-tight">
            Kiln Product Catalogue
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-terracotta hover:bg-[#833329] text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
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

      {/* Filter & Search Bar */}
      <div className="bg-white border border-border-subtle p-4 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-secondary-text absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brick name, slug, grade or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta"
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="py-2 px-3 bg-warm-bg border border-border-subtle text-xs text-charcoal focus:bg-white focus:outline-none focus:border-terracotta cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Filter Trigger Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-charcoal hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5 text-sandstone" />
            <span>Filter</span>
          </button>

          {/* Reset Filters */}
          {(search || category || status) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("");
                setStatus("");
                setTimeout(() => fetchProducts(1), 0);
              }}
              className="px-3 py-2 border border-border-subtle bg-warm-bg hover:bg-white text-xs text-secondary-text hover:text-charcoal cursor-pointer"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-border-subtle shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-warm-bg border-b border-border-subtle text-[10px] font-mono uppercase tracking-wider text-secondary-text">
              <tr>
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category / Grade</th>
                <th className="py-3 px-4 font-semibold">Min Quantity</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Featured</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {products.length > 0 ? (
                products.map((p) => {
                  const primaryImg = p.images?.find((img) => img.isPrimary) || p.images?.[0];
                  return (
                    <tr key={p._id} className="hover:bg-warm-bg/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-warm-bg border border-border-subtle relative shrink-0 overflow-hidden">
                            {primaryImg?.url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={primaryImg.url}
                                alt={primaryImg.alt || p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sandstone">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-heading font-black text-sm text-charcoal">{p.name}</div>
                            <div className="text-[11px] font-mono text-secondary-text">slug: {p.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-charcoal">{p.category || "Masonry"}</div>
                        {p.grade && <div className="text-[11px] text-secondary-text">Grade: {p.grade}</div>}
                      </td>

                      <td className="py-3 px-4 text-secondary-text">
                        {p.minOrderQuantity ? `${p.minOrderQuantity.toLocaleString("en-IN")} pcs` : "Standard batch"}
                      </td>

                      <td className="py-3 px-4">
                        <StatusBadge status={p.status} />
                      </td>

                      <td className="py-3 px-4 text-center">
                        {p.featured ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-terracotta font-semibold">
                            <Star className="w-3 h-3 fill-terracotta text-terracotta" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="text-secondary-text/60">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-secondary-text hover:text-charcoal border border-border-subtle bg-warm-bg hover:bg-white transition-colors"
                            title="View on public website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/products/${p._id}/edit`}
                            className="p-1.5 text-charcoal hover:text-terracotta border border-border-subtle bg-warm-bg hover:bg-white transition-colors"
                            title="Edit product details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleArchiveClick(p)}
                            className="p-1.5 text-secondary-text hover:text-terracotta border border-border-subtle bg-warm-bg hover:bg-white transition-colors cursor-pointer"
                            title="Archive product"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-secondary-text">
                    No products found matching the criteria. Click &quot;Add New Product&quot; to expand your catalogue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border-subtle bg-warm-bg flex items-center justify-between text-xs">
            <span className="text-secondary-text">
              Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} products)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fetchProducts(pagination.page - 1)}
                disabled={pagination.page <= 1 || isLoading}
                className="px-3 py-1 bg-white border border-border-subtle text-charcoal disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => fetchProducts(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || isLoading}
                className="px-3 py-1 bg-white border border-border-subtle text-charcoal disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Archiving */}
      <ConfirmationModal
        isOpen={archiveModalOpen}
        title="Archive Kiln Product?"
        message={`Are you sure you want to archive "${productToArchive?.name}"? Archiving hides the product from the public catalogue while preserving historical order request references.`}
        confirmLabel="Archive Product"
        isDestructive={true}
        isLoading={isArchiving}
        onConfirm={confirmArchive}
        onClose={() => {
          setArchiveModalOpen(false);
          setProductToArchive(null);
        }}
      />
    </div>
  );
}
