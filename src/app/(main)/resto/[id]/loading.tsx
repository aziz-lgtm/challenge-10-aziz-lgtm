import { Skeleton } from '@/components/ui/skeleton';

export default function RestaurantDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-56 md:h-72 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
