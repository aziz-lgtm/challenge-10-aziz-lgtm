'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Star, MapPin, Share2, Minus, Plus, User, ShoppingBag } from 'lucide-react';
import type { Review } from '@/types';

import { getRestaurantById } from '@/lib/api/resto';
import { addToCart } from '@/lib/api/cart';
import { queryKeys } from '@/lib/query/keys';
import { useAuthStore } from '@/store/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { BackButton } from '@/components/shared/back-button';
import type { Menu } from '@/types';

type TabKey = 'all' | 'food' | 'drink';

const toHttps = (url?: string) => url?.replace(/^http:\/\//, 'https://') ?? '';

function PreviewImage({ src, alt, sizes }: { src: string; alt: string; sizes: string }) {
  const [error, setError] = useState(false);
  return error || !src ? (
    <div className="h-full flex items-center justify-center text-3xl bg-muted">🍽️</div>
  ) : (
    <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} onError={() => setError(true)} />
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
      </div>
    </div>
  );
}

function MenuCard({
  menu,
  qty,
  onAdd,
  onPlus,
  onMinus,
  showControls,
}: {
  menu: Menu;
  qty: number;
  onAdd: () => void;
  onPlus: () => void;
  onMinus: () => void;
  showControls: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="rounded-xl overflow-hidden bg-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>
      <div className="relative aspect-square w-full bg-muted">
        {menu.image && !imgError ? (
          <Image src={toHttps(menu.image)} alt={menu.foodName} fill className="object-cover" sizes="200px" onError={() => setImgError(true)} />
        ) : (
          <div className="h-full flex items-center justify-center text-3xl">🍜</div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-xs font-medium text-gray-800 line-clamp-1">{menu.foodName}</p>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs font-bold text-gray-900">Rp{menu.price?.toLocaleString('id-ID')}</p>
          {showControls && (
            qty === 0 ? (
              <button
                onClick={onAdd}
                className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-primary/90 transition-colors"
              >
                Add
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={onMinus}
                  className="size-5 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Minus className="size-3" />
                </button>
                <span className="text-xs font-semibold w-4 text-center">{qty}</span>
                <button
                  onClick={onPlus}
                  className="size-5 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  <Plus className="size-3" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const dt = new Date(review.createdAt);
  const date = dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      {/* Avatar + name + date */}
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
          {review.user?.avatar ? (
            <Image src={review.user.avatar} alt={review.user?.name ?? ''} width={48} height={48} className="object-cover w-full h-full" />
          ) : (
            <User className="size-6 text-gray-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">{review.user?.name ?? 'Anonim'}</p>
          <p className="text-xs text-gray-400 mt-0.5">{date}, {time}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`size-4 ${i < review.star ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
        ))}
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  );
}

function ReviewSection({ reviews, totalReviews, star }: { reviews: Review[]; totalReviews?: number; star?: number }) {
  const INITIAL = 6;
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, INITIAL);

  if (reviews.length === 0) return null;

  return (
    <section>
      {/* Header: title on its own line, rating below */}
      <h2 className="font-bold text-lg text-gray-900">Review</h2>
      <div className="flex items-center gap-1 mt-1 mb-4">
        <Star className="size-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-semibold text-gray-700">{star?.toFixed(1) ?? '—'}</span>
        {totalReviews != null && (
          <span className="text-sm text-muted-foreground">({totalReviews} Ulasan)</span>
        )}
      </div>

      <div className="space-y-3">
        {visible.map((r) => <ReviewCard key={r.id} review={r} />)}
      </div>

      {reviews.length > INITIAL && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-4 w-full py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
        >
          {showAll ? 'Sembunyikan' : 'Show More'}
        </button>
      )}
    </section>
  );
}

export function RestaurantDetailView({ id }: { id: number }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [cartMap, setCartMap] = useState<Record<number, number>>({});

  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutate: addItem } = useMutation({
    mutationFn: ({ menuId, quantity }: { menuId: number; quantity: number }) =>
      addToCart({ restaurantId: id, menuId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
    onError: () => toast.error('Gagal menambahkan ke keranjang'),
  });

  const { data: restaurant, isLoading, isError } = useQuery({
    queryKey: queryKeys.restaurants.detail(id),
    queryFn: () => getRestaurantById(id, { limitMenu: 50, limitReview: 10 }),
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !restaurant) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p className="text-lg">Restoran tidak ditemukan</p>
      </div>
    );
  }

  const allMenus = restaurant.menus ?? [];
  const menuPriceMap = Object.fromEntries(allMenus.map((m) => [m.id, m.price ?? 0]));

  const totalItems = Object.values(cartMap).reduce((s, q) => s + q, 0);
  const totalPrice = Object.entries(cartMap).reduce(
    (s, [menuId, q]) => s + (menuPriceMap[Number(menuId)] ?? 0) * q,
    0
  );

  function makeHandlers(menu: Menu) {
    return {
      onAdd() {
        setCartMap((prev) => ({ ...prev, [menu.id]: 1 }));
        addItem({ menuId: menu.id, quantity: 1 });
        toast.success(`${menu.foodName} ditambahkan`);
      },
      onPlus() {
        const next = (cartMap[menu.id] ?? 0) + 1;
        setCartMap((prev) => ({ ...prev, [menu.id]: next }));
        addItem({ menuId: menu.id, quantity: next });
      },
      onMinus() {
        const next = Math.max(0, (cartMap[menu.id] ?? 0) - 1);
        setCartMap((prev) => {
          const updated = { ...prev, [menu.id]: next };
          if (next === 0) delete updated[menu.id];
          return updated;
        });
        if (next > 0) addItem({ menuId: menu.id, quantity: next });
      },
    };
  }

  const previewImages = allMenus
    .filter((m) => m.image)
    .slice(0, 4)
    .map((m) => toHttps(m.image));

  while (previewImages.length < 4) previewImages.push('');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all', label: 'All Menu' },
    { key: 'food', label: 'Food' },
    { key: 'drink', label: 'Drink' },
  ];

  const filteredMenus = allMenus.filter((m) => {
    if (activeTab === 'all') return true;
    return m.type?.toLowerCase() === activeTab;
  });

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: restaurant!.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link disalin!');
    }
  }

  return (
    <div className={`max-w-2xl mx-auto px-4 py-6 space-y-4 ${totalItems > 0 ? 'pb-24' : ''}`}>

      <BackButton />

      {/* 4-image preview grid */}
      <div className="flex gap-2 h-56 sm:h-72 rounded-2xl overflow-hidden">
        <div className="relative flex-1 bg-muted">
          <PreviewImage src={previewImages[0]} alt="preview 1" sizes="50vw" />
        </div>
        <div className="hidden sm:flex flex-col gap-2 w-[42%]">
          <div className="relative flex-1 bg-muted">
            <PreviewImage src={previewImages[1]} alt="preview 2" sizes="25vw" />
          </div>
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 bg-muted">
              <PreviewImage src={previewImages[2]} alt="preview 3" sizes="12vw" />
            </div>
            <div className="relative flex-1 bg-muted">
              <PreviewImage src={previewImages[3]} alt="preview 4" sizes="12vw" />
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="relative size-12 rounded-full overflow-hidden bg-muted shrink-0 border border-gray-100">
            {restaurant.logo ? (
              <Image src={restaurant.logo} alt={restaurant.name} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="h-full flex items-center justify-center text-xl">🍽️</div>
            )}
          </div>
          <div>
            <h1 className="font-bold text-base text-gray-900">{restaurant.name}</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">{restaurant.star?.toFixed(1) ?? '—'}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-gray-500">
              <MapPin className="size-3" />
              <span className="text-xs">{restaurant.place}{restaurant.distance != null ? ` · ${restaurant.distance.toFixed(1)} km` : ''}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors shrink-0 mt-1"
        >
          <Share2 className="size-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Menu section */}
      <section>
        <h2 className="font-bold text-base text-gray-900 mb-3">Menu</h2>

        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Desktop: inline bar below tabs */}
        {totalItems > 0 && (
          <div className="hidden sm:flex items-center justify-between rounded-2xl px-4 py-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="size-5 text-gray-800" />
                <span className="absolute -top-1.5 -right-1.5 size-4 bg-primary rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 leading-none">{totalItems} Items</p>
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  Rp{totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/cart')}
              className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Checkout
            </button>
          </div>
        )}

        {filteredMenus.length === 0 ? (
          <p className="text-muted-foreground text-sm">Belum ada menu tersedia.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredMenus.map((menu) => {
              const { onAdd, onPlus, onMinus } = makeHandlers(menu);
              return (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  qty={cartMap[menu.id] ?? 0}
                  onAdd={onAdd}
                  onPlus={onPlus}
                  onMinus={onMinus}
                  showControls={!!token}
                />
              );
            })}
          </div>
        )}
      </section>

      <ReviewSection
        reviews={restaurant.reviews ?? []}
        totalReviews={restaurant.totalReviews}
        star={restaurant.star}
      />

      {/* Mobile only: sticky checkout bar fixed at bottom */}
      {totalItems > 0 && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="size-5 text-gray-800" />
                <span className="absolute -top-1.5 -right-1.5 size-4 bg-primary rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 leading-none">{totalItems} Items</p>
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  Rp{totalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/cart')}
              className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
