'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className="fixed left-5 bottom-5 z-40 flex items-center justify-center size-9 rounded-full bg-primary shadow-md hover:bg-primary/90 active:scale-95 transition-all"
    >
      <ChevronLeft className="size-5 text-white" />
    </button>
  );
}
