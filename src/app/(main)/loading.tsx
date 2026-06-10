import { Skeleton } from '@/components/ui/skeleton';

export default function MainLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4 text-center">
        <Skeleton className="h-9 w-64 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
        <Skeleton className="h-10 w-full max-w-lg mx-auto" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border">
            <Skeleton className="h-40 w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
