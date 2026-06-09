'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClipboardList } from 'lucide-react';

import { getMyOrders } from '@/lib/api/order';
import { queryKeys } from '@/lib/query/keys';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, OrderStatus } from '@/types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Menunggu',
  processing: 'Diproses',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const STATUS_VARIANTS: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  processing: 'default',
  completed: 'outline',
  cancelled: 'destructive',
};

function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
          <Badge variant={STATUS_VARIANTS[order.status]}>
            {STATUS_LABELS[order.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {order.restaurants?.map((group) => (
          <div key={group.restaurant.id}>
            <p className="text-sm font-medium">{group.restaurant.name}</p>
            <div className="text-xs text-muted-foreground pl-2 space-y-0.5 mt-0.5">
              {group.items.map((item) => (
                <p key={item.menuId}>{item.menu.name} x{item.quantity}</p>
              ))}
            </div>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-semibold">Rp{order.totalPrice?.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pengiriman ke</span>
          <span className="text-right max-w-[60%] line-clamp-1">{order.deliveryAddress}</span>
        </div>
      </CardContent>
    </Card>
  );
}

const ORDER_STATUSES: Array<{ label: string; value: string }> = [
  { label: 'Semua', value: '' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Diproses', value: 'processing' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
];

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = (searchParams.get('status') ?? '') as OrderStatus | '';

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.orders.list({ status: status || undefined }),
    queryFn: () => getMyOrders({ status: status || undefined, limit: 20 }),
  });

  function setStatus(value: string) {
    const params = new URLSearchParams();
    if (value) params.set('status', value);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {ORDER_STATUSES.map((s) => (
          <Button
            key={s.value}
            variant={status === s.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatus(s.value)}
          >
            {s.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <div className="text-center py-16 space-y-3 text-muted-foreground">
          <ClipboardList className="size-16 mx-auto opacity-30" />
          <p className="text-lg">Belum ada pesanan</p>
          <Button variant="outline" onClick={() => router.push('/')}>Mulai Pesan</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.data.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}
