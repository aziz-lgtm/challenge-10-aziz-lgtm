import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/resto/${restaurant.id}`}>
      <div
        className="flex flex-row items-center p-4 gap-3 bg-white rounded-2xl flex-none order-0 grow-0 w-full h-auto transition-shadow hover:shadow-lg lg:h-38"
        style={{ boxShadow: '0px 0px 20px rgba(203, 202, 202, 0.25)' }}
      >
        {/* Image */}
        <div className="relative size-20 lg:size-30 rounded-xl overflow-hidden bg-muted shrink-0">
          {restaurant.logo ? (
            <Image
              src={restaurant.logo}
              alt={restaurant.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80px, 120px"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-3xl">🍽️</div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col items-start p-0 gap-0.5 shrink-0 grow order-1 w-full h-auto lg:w-51.5 lg:h-24">
          <h3 className="font-semibold text-sm line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center gap-1 text-xs">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{restaurant.star?.toFixed(1) ?? '—'}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="line-clamp-1">
              {restaurant.place} · {restaurant.distance != null ? `${restaurant.distance.toFixed(1)} km` : '— km'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
