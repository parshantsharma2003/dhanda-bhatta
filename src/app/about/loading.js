import PageContainer from "@/components/layout/PageContainer";

export default function AboutLoading() {
  return (
    <div className="w-full min-h-[70vh] py-10 sm:py-16 animate-pulse bg-warm-bg">
      <PageContainer>
        {/* Page Hero Skeleton */}
        <div className="max-w-xl space-y-4 mb-12">
          <div className="h-3 w-28 bg-terracotta/30 rounded-xs" />
          <div className="h-9 sm:h-11 w-4/5 bg-charcoal/20 rounded-xs" />
          <div className="h-4 w-full bg-border-strong rounded-xs" />
        </div>

        {/* Editorial Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-6 aspect-4/3 w-full bg-[#EAE4D9] border border-border-subtle rounded-xs" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-3 w-32 bg-border-strong rounded-xs" />
            <div className="h-8 w-3/4 bg-charcoal/20 rounded-xs" />
            <div className="h-4 w-full bg-border-subtle rounded-xs" />
            <div className="h-4 w-5/6 bg-border-subtle rounded-xs" />
            <div className="h-4 w-2/3 bg-border-subtle rounded-xs" />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
