import Link from 'next/link';

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
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-primary text-2xl">✳</span>
              <span className="text-xl font-bold">Foody</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Taste homemade flavors &amp; chef&apos;s signature dishes. Freshly prepared every day. Order online or visit our nearest branch.
            </p>
            <div>
              <p className="text-sm font-semibold mb-3">Follow on Social Media</p>
              <div className="flex gap-4 text-gray-400">
                <a href="#" className="hover:text-white transition-colors"><FacebookIcon /></a>
                <a href="#" className="hover:text-white transition-colors"><InstagramIcon /></a>
                <a href="#" className="hover:text-white transition-colors"><LinkedinIcon /></a>
                <a href="#" className="hover:text-white transition-colors"><TikTokIcon /></a>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-base mb-4">Explore</h3>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-base mb-4">Help</h3>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
