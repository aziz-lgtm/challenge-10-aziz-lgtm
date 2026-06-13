import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Nunito } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Restaurant App',
  description: 'Order food from your favorite restaurants',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col w-full">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
