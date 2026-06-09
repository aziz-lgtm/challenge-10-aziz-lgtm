import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/resto/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
        <div className="relative h-40 bg-muted">
          {restaurant.image ? (
            <Image
              src={restaurant.image}
              alt={restaurant.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-4xl">🍽️</div>
          )}
          <Badge className="absolute top-2 left-2" variant="secondary">
            {restaurant.category}
          </Badge>
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm line-clamp-1">{restaurant.name}</h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" />
            <span className="line-clamp-1">{restaurant.location}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-xs">
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{restaurant.rating?.toFixed(1) ?? '—'}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Rp{restaurant.priceMin?.toLocaleString('id-ID')}
              {restaurant.priceMax ? ` - ${restaurant.priceMax.toLocaleString('id-ID')}` : '+'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
