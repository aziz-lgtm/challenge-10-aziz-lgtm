'use client';

import { use } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Star, MapPin, Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

import { getRestaurantById } from '@/lib/api/resto';
import { addToCart } from '@/lib/api/cart';
import { queryKeys } from '@/lib/query/keys';
import { useAuthStore } from '@/store/auth';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import type { Menu } from '@/types';

function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-lg" />)}
      </div>
    </div>
  );
}

function MenuCard({ menu, restaurantId }: { menu: Menu; restaurantId: number }) {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);

  const { mutate: addItem, isPending } = useMutation({
    mutationFn: () => addToCart({ restaurantId, menuId: menu.id, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      toast.success(`${menu.foodName} ditambahkan ke keranjang`);
      setQuantity(1);
    },
    onError: () => toast.error('Gagal menambahkan ke keranjang'),
  });

  return (
    <Card>
      <CardContent className="p-3 flex gap-3">
        <div className="relative size-20 rounded-lg overflow-hidden bg-muted shrink-0">
          {menu.image ? (
            <Image src={menu.image} alt={menu.foodName} fill className="object-cover" sizes="80px" />
          ) : (
            <div className="h-full flex items-center justify-center text-2xl">🍜</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm line-clamp-1">{menu.foodName}</p>
          <p className="text-sm font-semibold mt-1">Rp{menu.price?.toLocaleString('id-ID')}</p>
        </div>
        {token && (
          <div className="flex flex-col items-end justify-between shrink-0">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-xs"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus />
              </Button>
              <span className="w-5 text-center text-sm font-medium">{quantity}</span>
              <Button variant="outline" size="icon-xs" onClick={() => setQuantity((q) => q + 1)}>
                <Plus />
              </Button>
            </div>
            <Button size="xs" onClick={() => addItem()} disabled={isPending}>
              <ShoppingCart />
              Tambah
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: restaurant, isLoading, isError } = useQuery({
    queryKey: queryKeys.restaurants.detail(Number(id)),
    queryFn: () => getRestaurantById(Number(id), { limitMenu: 50, limitReview: 10 }),
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-muted-foreground">
        <p className="text-lg">Restoran tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Image */}
      <div className="relative h-56 md:h-72 rounded-xl overflow-hidden bg-muted">
        {(restaurant.logo || restaurant.images?.[0]) ? (
          <Image src={restaurant.logo || restaurant.images[0]} alt={restaurant.name} fill className="object-cover" sizes="896px" />
        ) : (
          <div className="h-full flex items-center justify-center text-6xl">🍽️</div>
        )}
      </div>

      {/* Info */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="secondary">{restaurant.category}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3" /> {restaurant.place}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{restaurant.star?.toFixed(1) ?? '—'}</span>
          </div>
        </div>
        <p className="text-sm mt-2">
          <span className="font-medium">Harga: </span>
          Rp{restaurant.priceRange?.min?.toLocaleString('id-ID')}
          {restaurant.priceRange?.max ? ` - Rp${restaurant.priceRange.max.toLocaleString('id-ID')}` : '+'}
        </p>
      </div>

      <Separator />

      {/* Menu */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Menu</h2>
        {restaurant.menus?.length === 0 ? (
          <p className="text-muted-foreground text-sm">Belum ada menu tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {restaurant.menus?.map((menu) => (
              <MenuCard key={menu.id} menu={menu} restaurantId={restaurant.id} />
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Reviews */}
      {(restaurant.reviews?.length ?? 0) > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Ulasan</h2>
          <div className="space-y-3">
            {restaurant.reviews.map((review) => (
              <div key={review.id} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{review.user?.name ?? 'Pengguna'}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3 ${i < review.star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
