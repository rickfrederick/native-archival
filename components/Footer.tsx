import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-charcoal)', color: 'var(--color-ivory)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-base font-light tracking-widest uppercase mb-4">Native Archival</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-silver)' }}>
              Professional archival and preservation products. Made in the USA. Dark. Precise. Material.
            </p>
            <div className="mt-6">
              <div
                className="inline-block w-8 h-px"
                style={{ backgroundColor: 'var(--color-kraft)' }}
              />
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-5" style={{ color: 'var(--color-kraft)' }}>
              Products
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Albums', href: '/shop?category=Albums' },
                { label: 'Photo Storage', href: '/shop?category=Photo+Storage' },
                { label: 'Print Preservers', href: '/shop?category=Print+Preservers' },
                { label: 'Portfolios', href: '/shop?category=Portfolios' },
                { label: 'Card Collectors', href: '/shop?category=Card+Collectors' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs tracking-wider transition-colors"
                    style={{ color: 'var(--color-silver)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-5" style={{ color: 'var(--color-kraft)' }}>
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
                { label: 'Blog', href: '/blog' },
                { label: 'Shop', href: '/shop' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs tracking-wider transition-colors"
                    style={{ color: 'var(--color-silver)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-widest mb-5" style={{ color: 'var(--color-kraft)' }}>
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/nativearchival"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-wider transition-colors"
                  style={{ color: 'var(--color-silver)' }}
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/nativearchival"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-wider transition-colors"
                  style={{ color: 'var(--color-silver)' }}
                >
                  Facebook
                </a>
              </li>
            </ul>
            <div className="mt-8">
              <p className="text-xs mb-1" style={{ color: 'var(--color-silver)' }}>custservice@nativearchival.com</p>
              <p className="text-xs" style={{ color: 'var(--color-silver)' }}>315-502-4265</p>
              <p className="text-xs mt-2" style={{ color: 'var(--color-silver)' }}>P.O. Box 475</p>
              <p className="text-xs" style={{ color: 'var(--color-silver)' }}>Palmyra, NY 14522</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTopColor: 'rgba(255,255,255,0.08)' }} className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs text-center" style={{ color: 'var(--color-silver)' }}>
            © 2024 Native Archival. Made in the USA. Operated by Pulp Packaging, Inc.
          </p>
        </div>
      </div>
    </footer>
  )
}
