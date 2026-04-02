import { Skeleton } from "@/components/ui/skeleton";

export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-2">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function IssueCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-14 rounded-md" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card p-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
      <Skeleton className="h-7 w-16 rounded-md" />
    </div>
  );
}

export function SectionSkeleton({ cards = 4, columns = 2 }: { cards?: number; columns?: number }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <Skeleton className="h-5 w-32" />
      <div className={`grid gap-3 sm:grid-cols-${columns}`}>
        {Array.from({ length: cards }).map((_, i) => (
          <IssueCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
