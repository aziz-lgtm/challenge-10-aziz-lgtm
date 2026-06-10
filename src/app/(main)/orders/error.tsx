'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function OrdersError({
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
    <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
      <p className="text-2xl font-semibold">Gagal Memuat Pesanan</p>
      <p className="text-muted-foreground">
        Tidak dapat mengambil riwayat pesanan. Coba lagi beberapa saat.
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </div>
  );
}
