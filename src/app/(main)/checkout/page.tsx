'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { MapPin, CreditCard, FileText } from 'lucide-react';

import { getCart } from '@/lib/api/cart';
import { checkout } from '@/lib/api/order';
import { queryKeys } from '@/lib/query/keys';
import { checkoutSchema, type CheckoutFormValues } from '@/lib/validations/checkout';
import { useAuthStore } from '@/store/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: cart, isLoading } = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: getCart,
  });

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: user?.address ?? '',
      phone: user?.phone ?? '',
      paymentMethod: 'cash',
      notes: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CheckoutFormValues) => {
      const restaurants = (cart ?? []).map((group) => ({
        restaurantId: group.restaurant.id,
        items: group.items.map((item) => ({ menuId: item.menuId, quantity: item.quantity })),
      }));
      return checkout({
        restaurants,
        deliveryAddress: values.deliveryAddress,
        phone: values.phone || undefined,
        paymentMethod: values.paymentMethod,
        notes: values.notes || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success('Pesanan berhasil dibuat!');
      router.push('/orders');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Checkout gagal, coba lagi.';
      toast.error(message);
    },
  });

  const totalPrice = cart?.reduce(
    (acc, g) => acc + g.items.reduce((a, i) => a + i.menu.price * i.quantity, 0),
    0
  ) ?? 0;
  const totalItems = cart?.reduce((acc, g) => acc + g.items.reduce((a, i) => a + i.quantity, 0), 0) ?? 0;

  if (isLoading) return null;

  if (!cart || cart.length === 0 || totalItems === 0) {
    router.replace('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ringkasan Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cart.map((group) => (
            <div key={group.restaurant.id}>
              <p className="text-sm font-medium">{group.restaurant.name}</p>
              {group.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-muted-foreground pl-2">
                  <span>{item.menu.name} x{item.quantity}</span>
                  <span>Rp{(item.menu.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutate(v))} className="space-y-4">
          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" /> Alamat Pengiriman
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Masukkan alamat lengkap pengiriman..." rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon (opsional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="08xxxxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <CreditCard className="size-3.5" /> Metode Pembayaran
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={(v) => field.onChange(v ?? 'cash')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Tunai (COD)</SelectItem>
                      <SelectItem value="transfer">Transfer Bank</SelectItem>
                      <SelectItem value="e-wallet">E-Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5">
                  <FileText className="size-3.5" /> Catatan (opsional)
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Catatan untuk restoran atau kurir..." rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? 'Memproses...' : `Pesan Sekarang • Rp${totalPrice.toLocaleString('id-ID')}`}
          </Button>
        </form>
      </Form>
    </div>
  );
}
