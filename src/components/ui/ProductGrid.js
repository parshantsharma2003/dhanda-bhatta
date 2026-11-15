"use client";

import { useState, useMemo } from "react";
import { Search, Layers, X, Filter } from "lucide-react";
import ProductCard from "./ProductCard";
import Button from "./Button";
import { cn } from "@/lib/utils";

/**
 * ProductGrid with live search, category filtering, and an attractive empty state.
 */
export default function ProductGrid({
  products = [],
  categories = ["All Products"],
  initialCategory = "All Products",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === "All Products" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== "All Products";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Products");
  };

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-6 border-b border-border-subtle">
        {/* Category Filter Pills */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none"
          role="tablist"
          aria-label="Product categories"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "touch-target px-3.5 py-2 text-xs font-heading uppercase tracking-wider font-semibold transition-colors shrink-0 whitespace-nowrap cursor-pointer",
                selectedCategory === cat
                  ? "bg-terracotta text-white"
                  : "bg-white text-charcoal border border-border-subtle hover:bg-warm-bg"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <Search className="w-4 h-4 text-secondary-text absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brick grades..."
            aria-label="Search brick grades"
            className="w-full min-h-[44px] pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border border-border-subtle text-charcoal focus:outline-2 focus:outline-terracotta placeholder:text-secondary-text/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="touch-target p-2 absolute right-1 top-1/2 -translate-y-1/2 text-secondary-text hover:text-charcoal"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Filter Reset */}
      <div className="flex items-center justify-between text-xs text-secondary-text">
        <span>
          Showing <strong className="text-charcoal">{filteredProducts.length}</strong>{" "}
          {filteredProducts.length === 1 ? "brick grade" : "brick grades"}
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-terracotta font-semibold hover:underline inline-flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Attractive Empty State */
        <div className="text-center py-16 px-4 bg-white border border-border-subtle max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-warm-bg border border-border-subtle flex items-center justify-center text-secondary-text mx-auto">
            <Layers className="w-6 h-6 text-sandstone" />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading font-bold text-lg text-charcoal">
              No matching brick grades found
            </h3>
            <p className="text-xs sm:text-sm text-secondary-text max-w-sm mx-auto">
              We couldn&apos;t find any products matching your search criteria. Please try another term or reset your filters.
            </p>
          </div>

          <div className="pt-2">
            <Button onClick={clearFilters} variant="outline" size="sm">
              Show All Products
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
