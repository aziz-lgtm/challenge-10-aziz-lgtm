'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UtensilsCrossed } from 'lucide-react';

import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth';
import { register } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ confirmPassword: _, ...payload }: RegisterFormValues) => register(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success('Akun berhasil dibuat!');
      router.push('/');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Registrasi gagal, coba lagi.';
      toast.error(message);
    },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <UtensilsCrossed className="size-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Daftar</CardTitle>
        <CardDescription>Buat akun FoodApp baru</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutate(values))} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama kamu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="kamu@email.com" {...field} />
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
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="08xxxxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Memproses...' : 'Daftar'}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Masuk di sini
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
