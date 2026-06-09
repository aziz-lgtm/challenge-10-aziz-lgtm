'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

import { getRestaurants, getBestSellerRestaurants, searchRestaurants } from '@/lib/api/resto';
import { queryKeys } from '@/lib/query/keys';
import { RestaurantCard } from '@/components/shared/restaurant-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RestaurantFilterParams } from '@/types';

const CATEGORIES = ['Semua', 'Fast Food', 'Indonesian', 'Japanese', 'Western', 'Dessert', 'Drinks'];

function RestaurantCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border">
      <Skeleton className="h-40 w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const searchQuery = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const rating = searchParams.get('rating') ?? '';
  const sort = searchParams.get('sort') ?? '';

  const filterParams: RestaurantFilterParams = {
    ...(category && category !== 'Semua' ? { category } : {}),
    ...(rating ? { rating: Number(rating) } : {}),
    limit: 12,
  };

  const { data: restaurants, isLoading: isLoadingResto } = useQuery({
    queryKey: queryKeys.restaurants.list(filterParams),
    queryFn: () => getRestaurants(filterParams),
    enabled: !searchQuery,
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: queryKeys.restaurants.search(searchQuery),
    queryFn: () => searchRestaurants(searchQuery),
    enabled: !!searchQuery,
  });

  const { data: bestSellers, isLoading: isLoadingBestSeller } = useQuery({
    queryKey: queryKeys.restaurants.bestSeller({ limit: 4 }),
    queryFn: () => getBestSellerRestaurants({ limit: 4 }),
    enabled: !searchQuery && !category && !rating,
  });

  function applyParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'Semua') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('q');
    router.push(`?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set('q', searchInput.trim());
    router.push(`?${params.toString()}`);
  }

  const displayList = searchQuery ? (searchResults?.data ?? []) : (restaurants?.data ?? []);
  const isLoading = searchQuery ? isSearching : isLoadingResto;
  const showBestSeller = !searchQuery && !category && !rating;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Search */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Temukan Makanan Favoritmu</h1>
        <p className="text-muted-foreground">Ribuan pilihan restoran siap menghantar ke pintumu</p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Cari restoran..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button type="submit">Cari</Button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <SlidersHorizontal className="size-4 text-muted-foreground" />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={(!category && cat === 'Semua') || category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => applyParam('category', cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <Select value={rating} onValueChange={(v) => applyParam('rating', v ?? '')}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Min. Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Rating</SelectItem>
            <SelectItem value="3">3+ Bintang</SelectItem>
            <SelectItem value="4">4+ Bintang</SelectItem>
            <SelectItem value="4.5">4.5+ Bintang</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Best Seller Section */}
      {showBestSeller && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Best Seller</h2>
          {isLoadingBestSeller ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
            </div>
          ) : (bestSellers?.data?.length ?? 0) === 0 ? null : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bestSellers?.data?.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          )}
        </section>
      )}

      {/* All Restaurants / Search Results */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          {searchQuery ? `Hasil pencarian "${searchQuery}"` : category && category !== 'Semua' ? category : 'Semua Restoran'}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
          </div>
        ) : displayList.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Tidak ada restoran ditemukan</p>
            <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayList.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}
