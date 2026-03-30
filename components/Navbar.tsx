'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-store'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const count = useCart((s) => s.count())

  return (
    <nav style={{ backgroundColor: 'var(--color-charcoal)', color: 'var(--color-ivory)' }} className="relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-light tracking-widest uppercase"
            style={{ color: 'var(--color-ivory)' }}
          >
            NATIVE ARCHIVAL
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Shop', 'Blog', 'About', 'Contact'].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase()}`}
                className="text-xs uppercase tracking-widest font-medium transition-colors"
                style={{ color: 'var(--color-silver)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-ivory)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-silver)')}
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Cart + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative" style={{ color: 'var(--color-ivory)' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              {count > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-xs flex items-center justify-center font-medium"
                  style={{ backgroundColor: 'var(--color-kraft)', color: 'var(--color-ivory)' }}
                >
                  {count}
                </span>
              )}
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              style={{ color: 'var(--color-ivory)' }}
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{ backgroundColor: 'var(--color-charcoal-light)' }} className="md:hidden border-t border-white/10">
          <div className="px-4 py-4 flex flex-col gap-4">
            {['Shop', 'Blog', 'About', 'Contact'].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase()}`}
                className="text-xs uppercase tracking-widest font-medium"
                style={{ color: 'var(--color-silver)' }}
                onClick={() => setMobileOpen(false)}
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
