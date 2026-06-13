'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, MapPin, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';
import { getCart } from '@/lib/api/cart';
import { getProfile } from '@/lib/api/auth';
import { queryKeys } from '@/lib/query/keys';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { token, clearAuth } = useAuthStore();

  const { data: user } = useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: getProfile,
    enabled: !!token,
  });
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;
    const getScrollY = () =>
      window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const onScroll = () => setIsScrolled(getScrollY() > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  // On home: transparent + white icons at top; white bg + original colors when scrolled
  // On other pages: always default sticky styling
  const transparent = isHome && !isScrolled;

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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 border-b',
        transparent
          ? 'bg-transparent border-transparent shadow-none'
          : 'bg-white border-border shadow-sm'
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between transition-all duration-300',
          isHome
            ? 'h-16 sm:h-20 px-4 sm:px-12 lg:px-30'
            : 'max-w-6xl mx-auto px-4 h-14'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex flex-row items-center p-0 gap-3.75 w-37.25 h-10.5 flex-none order-0 grow-0">
          <div className="w-8 h-8 sm:w-10.5 sm:h-10.5 shrink-0">
            <Image
              src="/login/claude.png"
              alt="Foody logo"
              width={42}
              height={42}
              className={cn(
                'w-full h-full object-contain transition-all duration-300',
                transparent && 'brightness-0 invert'
              )}
            />
          </div>
          <span
            className={cn(
              'font-[family-name:var(--font-nunito)] font-extrabold leading-tight transition-colors duration-300',
              isHome
                ? cn('text-2xl sm:text-[2rem]', transparent ? 'text-white' : 'text-gray-900')
                : 'text-xl text-gray-900'
            )}
          >
            Foody
          </span>
        </Link>

        {/* Right actions */}
        <div className={cn('flex flex-row justify-end items-center p-0 gap-4 h-12 flex-none order-1 grow-0')}>
          {token ? (
            <>
              {/* Cart bag + dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="relative transition-transform duration-200 hover:scale-110 active:scale-95"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
                    <Image
                      src="/hero/bag.png"
                      alt="Cart"
                      width={32}
                      height={32}
                      className={cn(
                        'w-full h-full object-contain transition-all duration-300',
                        transparent ? 'brightness-0 invert' : 'brightness-0'
                      )}
                    />
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[0.625rem] rounded-full size-4 flex items-center justify-center font-medium leading-none">
                      {cartCount}
                    </span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center gap-3 px-5 py-4">
                      <div className="size-12 rounded-full overflow-hidden bg-primary flex items-center justify-center shrink-0">
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name ?? 'avatar'}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-white font-bold text-sm select-none">
                            {user?.name?.[0]?.toUpperCase() ?? <User className="size-4 text-white" />}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-gray-900 text-base">{user?.name}</span>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Menu items */}
                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <MapPin className="size-5 shrink-0" />
                        <span className="font-medium text-sm">Delivery Address</span>
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <ClipboardList className="size-5 shrink-0" />
                        <span className="font-medium text-sm">My Orders</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-gray-800 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="size-5 shrink-0" />
                        <span className="font-medium text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User avatar → profile page */}
              <Link
                href="/profile"
                className="flex items-center gap-3 sm:gap-4 hover:opacity-80 transition-opacity"
              >
                <div className="size-10 sm:size-12 rounded-full overflow-hidden bg-primary flex items-center justify-center shrink-0">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name ?? 'avatar'}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm select-none">
                      {user?.name?.[0]?.toUpperCase() ?? <User className="size-4 text-white" />}
                    </span>
                  )}
                </div>
                {user?.name && (
                  <span
                    className={cn(
                      'font-nunito font-semibold hidden sm:block transition-colors duration-300',
                      isHome
                        ? cn('text-base sm:text-lg leading-8 tracking-tight', transparent ? 'text-white' : 'text-gray-900')
                        : 'text-sm text-gray-900'
                    )}
                  >
                    {user.name}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className={cn(
                    'box-border flex flex-row justify-center items-center p-2 gap-2',
                    'w-40.75 h-12 border-2 rounded-full',
                    'flex-none order-0 grow-0 transition-colors duration-300',
                    transparent
                      ? 'border-gray-300 text-white bg-transparent hover:bg-white/10 hover:text-white'
                      : 'border-gray-950 text-gray-950 bg-transparent hover:bg-gray-100'
                  )}
                >
                  <span className="w-12.5 h-7.5 font-nunito font-bold text-base leading-7.5 tracking-[-0.02em] flex-none order-0 grow-0">
                    Sign In
                  </span>
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className={cn(
                    'box-border flex flex-row justify-center items-center p-2 gap-2',
                    'w-40.75 h-12 rounded-full',
                    'flex-none order-1 grow-0 transition-colors duration-300',
                    transparent
                      ? 'bg-white text-gray-950 hover:bg-gray-100'
                      : 'bg-gray-950 text-white hover:bg-gray-800'
                  )}
                >
                  <span className={cn(
                    'w-14.5 h-7.5 font-nunito font-bold text-base leading-7.5 tracking-[-0.02em] flex-none order-0 grow-0',
                    transparent ? 'text-gray-950' : 'text-white'
                  )}>
                    Sign Up
                  </span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
