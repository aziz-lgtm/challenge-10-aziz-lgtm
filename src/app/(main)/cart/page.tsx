'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

import { getCart, updateCartItem, deleteCartItem, clearCart } from '@/lib/api/cart';
import { queryKeys } from '@/lib/query/keys';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { BackButton } from '@/components/shared/back-button';
import type { CartItem } from '@/types';

function CartItemRow({ item, onUpdate, onDelete, isPending }: {
  item: CartItem;
  onUpdate: (id: string, qty: number) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="relative size-16 rounded-lg overflow-hidden bg-muted shrink-0">
        {item.menu.image ? (
          <Image src={item.menu.image} alt={item.menu.foodName} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="h-full flex items-center justify-center text-2xl">🍜</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm line-clamp-1">{item.menu.foodName}</p>
        <p className="text-sm text-muted-foreground">Rp{item.menu.price?.toLocaleString('id-ID')}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="icon-xs"
          disabled={isPending || item.quantity <= 1}
          onClick={() => onUpdate(String(item.id), item.quantity - 1)}
        >
          <Minus />
        </Button>
        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon-xs"
          disabled={isPending}
          onClick={() => onUpdate(String(item.id), item.quantity + 1)}
        >
          <Plus />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          disabled={isPending}
          onClick={() => onDelete(String(item.id))}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: getCart,
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => updateCartItem(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.all }),
    onError: () => toast.error('Gagal mengubah jumlah'),
  });

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      toast.success('Item dihapus');
    },
    onError: () => toast.error('Gagal menghapus item'),
  });

  const { mutate: clear, isPending: isClearing } = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      toast.success('Keranjang dikosongkan');
    },
    onError: () => toast.error('Gagal mengosongkan keranjang'),
  });

  const isPending = isUpdating || isRemoving || isClearing;

  const totalItems = cart?.reduce((acc, g) => acc + g.items.reduce((a, i) => a + i.quantity, 0), 0) ?? 0;
  const totalPrice = cart?.reduce(
    (acc, g) => acc + g.items.reduce((a, i) => a + i.menu.price * i.quantity, 0),
    0
  ) ?? 0;

  if (isLoading) {
    return (
      <div className="px-30 py-8 space-y-4 w-full">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  const isEmpty = !cart || cart.length === 0 || totalItems === 0;

  return (
    <div className="px-30 py-8 w-full">
      <BackButton />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Keranjang</h1>
        {!isEmpty && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            disabled={isPending}
            onClick={() => clear()}
          >
            <Trash2 className="size-4 mr-1" />
            Kosongkan
          </Button>
        )}
      </div>

      {isEmpty ? (
        <div className="text-center py-16 space-y-4">
          <ShoppingBag className="size-16 mx-auto text-muted-foreground/50" />
          <p className="text-muted-foreground text-lg">Keranjangmu kosong</p>
          <Link href="/">
            <Button>Mulai Pesan</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cart?.map((group) => (
            <div key={group.restaurant.id}>
              <Link href={`/resto/${group.restaurant.id}`} className="font-semibold text-sm hover:underline">
                {group.restaurant.name}
              </Link>
              <div className="divide-y">
                {group.items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdate={(id, qty) => update({ id, quantity: qty })}
                    onDelete={(id) => remove(id)}
                    isPending={isPending}
                  />
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          ))}

          {/* Summary */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Item</span>
              <span className="font-medium">{totalItems} item</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Total Harga</span>
              <span className="font-bold text-lg">Rp{totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <Link href="/checkout" className="block">
            <Button className="w-full" size="lg">
              Lanjut ke Checkout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
