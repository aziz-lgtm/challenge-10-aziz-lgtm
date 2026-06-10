import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
