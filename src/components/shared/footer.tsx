import Link from 'next/link';
import Image from 'next/image';

const exploreLinks = [
  { label: 'All Food', href: '/' },
  { label: 'Nearby', href: '/?view=nearby' },
  { label: 'Discount', href: '/' },
  { label: 'Best Seller', href: '/?view=best-seller' },
  { label: 'Delivery', href: '/' },
  { label: 'Lunch', href: '/?view=lunch' },
];

const helpLinks = [
  { label: 'How to Order', href: '#' },
  { label: 'Payment Methods', href: '#' },
  { label: 'Track My Order', href: '/orders' },
  { label: 'FAQ', href: '#' },
  { label: 'Contact Us', href: '#' },
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0A0D12] border-t border-[#D5D7DA] text-white">
      <div className="flex flex-col md:flex-row justify-between items-start px-4 md:px-30 pt-6 pb-12 md:py-20 gap-4 md:gap-17.25 max-w-360 mx-auto">
          {/* Brand */}
          <div className="flex flex-col items-start gap-4 md:gap-10 w-full md:w-95 flex-none grow-0">
            <div className="flex flex-col items-start gap-5.5 md:gap-10 w-full flex-none grow-0">
              <div className="flex flex-row items-center p-0 gap-3.75 w-37.25 h-10.5 flex-none grow-0">
                <div className="relative flex-none size-10.5">
                  <Image src="/login/claude.png" alt="Foody logo" fill className="object-contain" />
                </div>
                <span className="font-nunito font-extrabold text-[32px] leading-10.5 text-white w-23 h-10.5 flex-none order-1 grow-0">Foody</span>
              </div>
              <p className="font-nunito font-normal text-sm md:text-base leading-7 md:leading-7.5 tracking-[-0.02em] text-gray-25 w-full md:w-95 h-14 md:h-22.5 flex-none order-1 self-stretch grow-0">
                Enjoy homemade flavors &amp; chef&apos;s signature dishes, freshly prepared every day. Order online or visit our nearest branch.
              </p>
            </div>
            <div className="flex flex-col justify-center items-start p-0 gap-5 w-49 h-22 flex-none order-1 grow-0">
              <p className="flex flex-row items-center p-0 gap-2 w-49 h-7 text-sm font-semibold flex-none order-0 self-stretch grow-0">Follow on Social Media</p>
              <div className="flex flex-row items-center p-0 gap-3 w-49 h-10 text-gray-400 flex-none order-1 self-stretch grow-0">
                <a href="#" className="hover:text-white transition-colors p-2 rounded-full border border-gray-700 hover:border-white"><FacebookIcon /></a>
                <a href="#" className="hover:text-white transition-colors p-2 rounded-full border border-gray-700 hover:border-white"><InstagramIcon /></a>
                <a href="#" className="hover:text-white transition-colors p-2 rounded-full border border-gray-700 hover:border-white"><LinkedinIcon /></a>
                <a href="#" className="hover:text-white transition-colors p-2 rounded-full border border-gray-700 hover:border-white"><TikTokIcon /></a>
              </div>
            </div>
          </div>

          {/* Frame 100 — Explore + Help side by side on mobile, unwrapped on md+ */}
          <div className="flex flex-row items-start p-0 gap-4 w-full h-73 flex-none order-1 self-stretch grow-0 md:contents">

            {/* Explore */}
            <div className="flex flex-col items-start p-0 gap-4 md:gap-5 min-w-0 md:w-50 h-73 md:h-82.5 flex-none order-0 grow md:grow-0">
              <h3 className="font-semibold text-base">Explore</h3>
              {exploreLinks.map((link) => (
                <div key={link.label} className="flex flex-row items-center p-0 gap-2 w-full h-7 flex-none order-0 self-stretch grow-0">
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Help */}
            <div className="flex flex-col items-start p-0 gap-4 md:gap-5 min-w-0 md:w-50 h-62 md:h-82.5 flex-none order-1 grow md:grow-0">
              <h3 className="font-semibold text-base">Help</h3>
              {helpLinks.map((link) => (
                <div key={link.label} className="flex flex-row items-center p-0 gap-2 w-full h-7 flex-none order-0 self-stretch grow-0">
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

          </div>
      </div>
    </footer>
  );
}
