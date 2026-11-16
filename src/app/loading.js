import PageContainer from "@/components/layout/PageContainer";

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] py-12 animate-pulse bg-warm-bg">
      <PageContainer>
        {/* Hero / Header Skeleton */}
        <div className="max-w-2xl space-y-4 mb-12">
          <div className="h-4 w-32 bg-border-strong rounded-xs" />
          <div className="h-10 sm:h-12 w-3/4 bg-border-strong rounded-xs" />
          <div className="h-5 w-full bg-border-subtle rounded-xs" />
          <div className="h-5 w-2/3 bg-border-subtle rounded-xs" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-border-subtle bg-white p-5 space-y-4 shadow-2xs"
            >
              <div className="aspect-4/3 w-full bg-[#EAE4D9] rounded-xs" />
              <div className="h-4 w-24 bg-border-subtle rounded-xs" />
              <div className="h-6 w-3/4 bg-border-strong rounded-xs" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-border-subtle rounded-xs" />
                <div className="h-3 w-4/5 bg-border-subtle rounded-xs" />
              </div>
              <div className="h-10 w-full bg-border-subtle/50 rounded-xs mt-4" />
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
