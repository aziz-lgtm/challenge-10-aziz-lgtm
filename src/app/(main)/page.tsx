'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  getRestaurants,
  getBestSellerRestaurants,
  searchRestaurants,
  getRecommendedRestaurants,
  getNearbyRestaurants,
} from '@/lib/api/resto';
import { queryKeys } from '@/lib/query/keys';
import { useAuthStore } from '@/store/auth';
import { RestaurantCard } from '@/components/shared/restaurant-card';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { RestaurantFilterParams } from '@/types';

const CATEGORY_ICONS = [
  { key: 'all', label: 'All Restaurant', image: '/categories/All_restaurant.png' },
  { key: 'nearby', label: 'Nearby', image: '/categories/Nearby.png' },
  { key: 'discount', label: 'Discount', image: '/categories/Discount.png' },
  { key: 'best-seller', label: 'Best Seller', image: '/categories/Best_seller.png' },
  { key: 'delivery', label: 'Delivery', image: '/categories/Delivery.png' },
  { key: 'lunch', label: 'Lunch', image: '/categories/Lunch.png' },
] as const;

type CategoryKey = (typeof CATEGORY_ICONS)[number]['key'];

const SECTION_LABELS: Record<CategoryKey, string> = {
  all: 'Recommended',
  nearby: 'Nearby',
  discount: 'Discount',
  'best-seller': 'Best Seller',
  delivery: 'Delivery',
  lunch: 'Lunch',
};

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

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token: storeToken } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const token = mounted ? storeToken : null;

  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const [page, setPage] = useState(1);

  const searchQuery = searchParams.get('q') ?? '';
  const view = (searchParams.get('view') ?? 'all') as CategoryKey;

  const categoryFilter: Record<string, string> = {
    lunch: 'Lunch',
    discount: 'Discount',
    delivery: 'Delivery',
  };

  const filterParams: RestaurantFilterParams = {
    ...(categoryFilter[view] ? { category: categoryFilter[view] } : {}),
    limit: page * 9,
  };

  const { data: allRestaurants, isLoading: isLoadingAll } = useQuery({
    queryKey: queryKeys.restaurants.list({ ...filterParams, page }),
    queryFn: () => getRestaurants(filterParams),
    enabled: !searchQuery && (view === 'all' || view === 'lunch' || view === 'discount' || view === 'delivery'),
  });

  const { data: bestSellers, isLoading: isLoadingBestSeller } = useQuery({
    queryKey: queryKeys.restaurants.bestSeller({ limit: page * 9 }),
    queryFn: () => getBestSellerRestaurants({ limit: page * 9 }),
    enabled: !searchQuery && view === 'best-seller',
  });

  const { data: recommended, isLoading: isLoadingRecommended } = useQuery({
    queryKey: queryKeys.restaurants.recommended,
    queryFn: getRecommendedRestaurants,
    enabled: !!token && !searchQuery && view === 'all',
  });

  const { data: nearby, isLoading: isLoadingNearby } = useQuery({
    queryKey: queryKeys.restaurants.nearby({ limit: page * 9 }),
    queryFn: () => getNearbyRestaurants({ limit: page * 9 }),
    enabled: !!token && !searchQuery && view === 'nearby',
  });

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: queryKeys.restaurants.search(searchQuery),
    queryFn: () => searchRestaurants(searchQuery),
    enabled: !!searchQuery,
  });

  function setView(key: CategoryKey) {
    const params = new URLSearchParams();
    if (key !== 'all') params.set('view', key);
    setPage(1);
    router.push(`?${params.toString()}`);
  }

  function handleSearch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set('q', searchInput.trim());
    setPage(1);
    router.push(`?${params.toString()}`);
  }

  const displayList = searchQuery
    ? (searchResults?.restaurants ?? [])
    : view === 'best-seller'
    ? (bestSellers?.restaurants ?? [])
    : view === 'nearby'
    ? (nearby ?? [])
    : view === 'all' && !!token && (recommended?.length ?? 0) > 0
    ? (recommended ?? [])
    : (allRestaurants?.restaurants ?? []);

  const isLoading = searchQuery
    ? isSearching
    : view === 'best-seller'
    ? isLoadingBestSeller
    : view === 'nearby'
    ? isLoadingNearby
    : view === 'all' && !!token
    ? isLoadingRecommended
    : isLoadingAll;


  const sectionTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : SECTION_LABELS[view];

  return (
    <div>
      {/* Hero — negative margin pulls it up behind the sticky navbar */}
      <section className="relative w-full -mt-16 sm:-mt-20 min-h-125 sm:min-h-162.5 lg:min-h-206.75 flex items-center justify-center overflow-hidden">
        <Image
          src="/hero/hero_burger.png"
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay matching design spec */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0) -59.98%, rgba(0,0,0,0.8) 110.09%)',
          }}
        />

        {/* Centered content */}
        <div className="z-10 flex flex-col items-center p-0 gap-6 absolute w-[349px] h-[228px] left-1/2 -translate-x-1/2 top-[210px] lg:w-[712px] lg:h-[200px] lg:top-[326px]">
          {/* Title + subtitle */}
          <div className="flex flex-col items-center gap-2 w-full text-center">
            <h1
              className="w-full font-[family-name:var(--font-nunito)] font-extrabold text-white"
              style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: '1.25' }}
            >
              Explore Culinary Experiences
            </h1>
            <p
              className="w-full font-[family-name:var(--font-nunito)] font-bold text-white"
              style={{ fontSize: 'clamp(16px, 2.5vw, 24px)', lineHeight: '1.5' }}
            >
              Search and refine your choice to discover the perfect restaurant.
            </p>
          </div>

          {/* Search bar — single pill input with icon */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-[604px]"
          >
            <div className="flex flex-row items-center gap-[6px] bg-white rounded-full px-6 py-2 h-12 sm:h-14 shadow-sm">
              <Search className="size-5 text-gray-500 shrink-0" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none font-[family-name:var(--font-nunito)] font-normal text-base text-gray-600 placeholder:text-gray-500 tracking-tight"
                placeholder="Search restaurants, food and drink"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </form>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 pt-6 pb-12 sm:py-8 space-y-4 sm:space-y-8 lg:px-30">
        {/* Category Icons */}
        {!searchQuery && (
          <div className="grid grid-cols-3 gap-4 py-6 w-full lg:flex lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between lg:gap-0">
            {CATEGORY_ICONS.map((cat) => {
              const isActive = view === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setView(cat.key)}
                  className="flex flex-col justify-center items-center p-0 gap-1 group w-full lg:gap-1.5 lg:w-auto"
                >
                  <div
                    className={`rounded-xl flex items-center justify-center transition-all max-sm:w-full max-sm:flex-1 sm:w-[clamp(64px,8vw,100px)] sm:h-[clamp(64px,8vw,100px)] ${
                      isActive
                        ? 'ring-2 ring-primary shadow-md bg-orange-50'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      width={52}
                      height={52}
                      className="object-contain sm:w-[clamp(32px,4vw,52px)] sm:h-[clamp(32px,4vw,52px)]"
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? 'text-primary' : 'text-gray-600'
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Category Results */}
        <div className="flex flex-col items-center p-0 gap-4 sm:gap-6 w-full lg:gap-10">
          {/* Section Header */}
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-bold">{sectionTitle}</h2>
            {!searchQuery && (
              <Link
                href="/resto"
                className="text-sm text-primary font-medium hover:underline"
              >
                See All
              </Link>
            )}
          </div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {Array.from({ length: 9 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : displayList.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground w-full">
              <p className="text-lg font-medium">No restaurants found</p>
              <p className="text-sm mt-1">Try changing your search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {displayList.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}

          {/* Show More */}
          {!isLoading && displayList.length > 0 && !searchQuery && (
            <div className="flex justify-center w-full pt-2">
              <Button
                variant="outline"
                className="px-10 rounded-full"
                onClick={() => setPage((p) => p + 1)}
              >
                Show More
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageContent />
    </Suspense>
  );
}
