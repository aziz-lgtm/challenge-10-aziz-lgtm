'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RestaurantDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
      <p className="text-2xl font-semibold">Restoran Tidak Dapat Dimuat</p>
      <p className="text-muted-foreground">
        Gagal memuat data restoran. Periksa koneksi internet kamu dan coba lagi.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Coba Lagi</Button>
        <Link href="/">
          <Button variant="outline">Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
}
