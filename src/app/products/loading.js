import PageContainer from "@/components/layout/PageContainer";

export default function ProductsLoading() {
  return (
    <div className="w-full min-h-[70vh] py-10 sm:py-16 animate-pulse bg-warm-bg">
      <PageContainer>
        {/* Page Hero Skeleton */}
        <div className="max-w-xl space-y-4 mb-10">
          <div className="h-3 w-28 bg-terracotta/30 rounded-xs" />
          <div className="h-9 sm:h-11 w-4/5 bg-charcoal/20 rounded-xs" />
          <div className="h-4 w-full bg-border-strong rounded-xs" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex gap-2 mb-8 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-28 bg-white border border-border-subtle rounded-xs" />
          ))}
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border border-border-subtle bg-white p-5 space-y-4 shadow-2xs"
            >
              <div className="aspect-4/3 w-full bg-[#EAE4D9] rounded-xs" />
              <div className="h-3 w-24 bg-border-subtle rounded-xs" />
              <div className="h-5 w-3/4 bg-border-strong rounded-xs" />
              <div className="h-3.5 w-full bg-border-subtle rounded-xs" />
              <div className="flex gap-3 pt-3 border-t border-border-subtle">
                <div className="h-10 flex-1 bg-border-subtle/40 rounded-xs" />
                <div className="h-10 flex-1 bg-terracotta/20 rounded-xs" />
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
