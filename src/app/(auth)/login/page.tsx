'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UtensilsCrossed } from 'lucide-react';

import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success('Berhasil masuk!');
      const redirect = searchParams.get('redirect') ?? '/';
      router.push(redirect);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Login gagal, coba lagi.';
      toast.error(message);
    },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <UtensilsCrossed className="size-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Masuk</CardTitle>
        <CardDescription>Masuk ke akun FoodApp kamu</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => mutate(values))} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
        </Form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Belum punya akun?{' '}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
