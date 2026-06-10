'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect } from 'react';

import { getProfile, updateProfile } from '@/lib/api/auth';
import { queryKeys } from '@/lib/query/keys';
import { useAuthStore } from '@/store/auth';
import { profileSchema, type ProfileFormValues } from '@/lib/validations/profile';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { setUser } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: getProfile,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '', address: '' },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name ?? '',
        phone: profile.phone ?? '',
        address: profile.address ?? '',
      });
    }
  }, [profile, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      updateProfile({
        name: values.name,
        phone: values.phone || undefined,
        address: values.address || undefined,
      }),
    onSuccess: (updated) => {
      setUser(updated);
      toast.success('Profil berhasil diperbarui');
    },
    onError: () => toast.error('Gagal memperbarui profil'),
  });

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-28" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil Saya</h1>
        <p className="text-sm text-muted-foreground mt-1">{profile?.email}</p>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit((v) => mutate(v))} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input placeholder="Nama lengkap" {...field} />
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea placeholder="Alamat pengiriman default..." rows={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
