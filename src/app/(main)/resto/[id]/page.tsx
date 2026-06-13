import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getRestaurantById } from '@/lib/api/resto';
import { queryKeys } from '@/lib/query/keys';
import getQueryClient from '@/lib/query/server';
import { RestaurantDetailView } from './detail-view';

// Server Component: runs on the server, fetches the restaurant before the
// HTML is sent, then hands a dehydrated cache to the client so the
// interactive view hydrates with data already present (no loading flash).
export default async function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurantId = Number(id);

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.restaurants.detail(restaurantId),
    queryFn: () => getRestaurantById(restaurantId, { limitMenu: 50, limitReview: 10 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RestaurantDetailView id={restaurantId} />
    </HydrationBoundary>
  );
}
