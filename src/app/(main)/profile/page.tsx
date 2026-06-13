'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

import { getProfile, updateProfile } from '@/lib/api/auth';
import { queryKeys } from '@/lib/query/keys';
import { profileSchema, type ProfileFormValues } from '@/lib/validations/profile';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { MapPicker } from '@/components/shared/map-picker';
import { BackButton } from '@/components/shared/back-button';

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('user-coords');
      return stored ? (JSON.parse(stored) as { latitude: number; longitude: number }) : null;
    } catch {
      return null;
    }
  });
  const [showMap, setShowMap] = useState(false);

  function saveCoords(newCoords: { latitude: number; longitude: number }) {
    setCoords(newCoords);
    localStorage.setItem('user-coords', JSON.stringify(newCoords));
  }

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
      if (profile.latitude && profile.longitude) {
        saveCoords({ latitude: profile.latitude, longitude: profile.longitude });
      }
    }
  }, [profile, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      updateProfile({
        name: values.name,
        phone: values.phone || undefined,
        address: values.address || undefined,
        ...(coords && { latitude: coords.latitude, longitude: coords.longitude }),
      }),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.auth.profile, {
        ...updatedUser,
        latitude: updatedUser.latitude ?? coords?.latitude ?? null,
        longitude: updatedUser.longitude ?? coords?.longitude ?? null,
      });
      toast.success('Profil berhasil diperbarui');
    },
    onError: () => toast.error('Gagal memperbarui profil'),
  });

  if (isLoading) {
    return (
      <div className="px-30 py-8 space-y-4 w-full">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-28" />
      </div>
    );
  }

  return (
    <>
      {showMap && (
        <MapPicker
          initialLat={coords?.latitude}
          initialLng={coords?.longitude}
          onConfirm={(lat, lng) => {
            saveCoords({ latitude: lat, longitude: lng });
            setShowMap(false);
          }}
          onClose={() => setShowMap(false)}
        />
      )}

      <div className="px-30 py-8 space-y-6 w-full">
        <BackButton />
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

            {/* Location */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Lokasi</p>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMap(true)}
                >
                  <MapPin className="size-4 mr-2" />
                  Choose on Map
                </Button>
                {coords ? (
                  <span className="text-xs text-muted-foreground">
                    {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">No location set</span>
                )}
              </div>
              {coords && (
                <p className="text-xs text-muted-foreground">
                  Click <strong>Save Changes</strong> below to apply your location.
                </p>
              )}
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
