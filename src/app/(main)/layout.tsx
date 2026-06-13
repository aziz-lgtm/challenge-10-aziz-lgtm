import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full pt-16 sm:pt-20">{children}</main>
      <Footer />
    </>
  );
}
