'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function MainError({
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
    <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
      <p className="text-2xl font-semibold">Terjadi Kesalahan</p>
      <p className="text-muted-foreground">
        {error.message || 'Sesuatu tidak berjalan dengan benar. Coba muat ulang halaman.'}
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </div>
  );
}
