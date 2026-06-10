import { Skeleton } from '@/components/ui/skeleton';

export default function CartLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-8 w-40" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="size-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-8 w-28 shrink-0" />
        </div>
      ))}
      <Skeleton className="h-px w-full" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}
