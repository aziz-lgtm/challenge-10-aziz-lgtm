import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-40 w-full rounded-xl" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}
