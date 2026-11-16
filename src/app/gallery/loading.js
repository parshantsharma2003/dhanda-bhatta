import PageContainer from "@/components/layout/PageContainer";

export default function GalleryLoading() {
  return (
    <div className="w-full min-h-[70vh] py-10 sm:py-16 animate-pulse bg-warm-bg">
      <PageContainer>
        {/* Page Hero Skeleton */}
        <div className="max-w-xl space-y-4 mb-10">
          <div className="h-3 w-28 bg-terracotta/30 rounded-xs" />
          <div className="h-9 sm:h-11 w-4/5 bg-charcoal/20 rounded-xs" />
          <div className="h-4 w-full bg-border-strong rounded-xs" />
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="flex gap-2 mb-8 overflow-hidden pb-2 border-b border-border-subtle">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 bg-white border border-border-subtle rounded-xs" />
          ))}
        </div>

        {/* Gallery Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border border-border-subtle bg-white p-3 space-y-3 shadow-2xs"
            >
              <div className="aspect-16/10 w-full bg-[#EAE4D9] rounded-xs" />
              <div className="h-4 w-3/4 bg-border-strong rounded-xs" />
              <div className="h-3 w-1/2 bg-border-subtle rounded-xs" />
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
