'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Search } from 'lucide-react';

import { getRestaurants, searchRestaurants } from '@/lib/api/resto';
import { queryKeys } from '@/lib/query/keys';
import { RestaurantCard } from '@/components/shared/restaurant-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border">
      <Skeleton className="h-36 w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

function RestaurantListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const [page, setPage] = useState(1);

  const searchQuery = searchParams.get('q') ?? '';

  const { data: allRestaurants, isLoading: isLoadingAll } = useQuery({
    queryKey: queryKeys.restaurants.list({ limit: page * 9 }),
    queryFn: () => getRestaurants({ limit: page * 9 }),
    enabled: !searchQuery,
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: queryKeys.restaurants.search(searchQuery),
    queryFn: () => searchRestaurants(searchQuery),
    enabled: !!searchQuery,
  });

  const isLoading = searchQuery ? isSearching : isLoadingAll;
  const displayList = searchQuery
    ? (searchResults?.restaurants ?? [])
    : (allRestaurants?.restaurants ?? []);

  function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set('q', searchInput.trim());
    setPage(1);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="px-4 py-8 space-y-6 lg:px-30">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">All Restaurants</h1>

        <form onSubmit={handleSearch} className="w-full max-w-lg">
          <div className="flex items-center gap-2 bg-white border rounded-full px-4 py-2 h-11 shadow-sm">
            <Search className="size-4 text-gray-500 shrink-0" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
              placeholder="Search restaurants, food and drink"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </form>

        {searchQuery && (
          <p className="text-sm text-muted-foreground">
            Results for &ldquo;{searchQuery}&rdquo;
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">No restaurants found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayList.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>

          {!searchQuery && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                className="px-10 rounded-full"
                onClick={() => setPage((p) => p + 1)}
              >
                Show More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function RestaurantListPage() {
  return (
    <Suspense fallback={null}>
      <RestaurantListContent />
    </Suspense>
  );
}
