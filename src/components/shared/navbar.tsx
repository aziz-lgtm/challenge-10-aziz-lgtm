'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User, LogOut, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';
import { getCart } from '@/lib/api/cart';
import { queryKeys } from '@/lib/query/keys';

export function Navbar() {
  const { token, user, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const { data: cart } = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: getCart,
    enabled: !!token,
  });

  const cartCount = cart?.reduce((acc, group) => acc + group.items.length, 0) ?? 0;

  function handleLogout() {
    clearAuth();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <UtensilsCrossed className="size-5 text-primary" />
          <span>FoodApp</span>
        </Link>

        <nav className="flex items-center gap-2">
          {token ? (
            <>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="size-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full size-4 flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="size-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="size-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Daftar</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
