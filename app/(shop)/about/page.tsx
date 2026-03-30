import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Native Archival is a brand operated by Pulp Packaging, Inc., manufacturing archival preservation products in Palmyra, NY.',
}

const values = [
  {
    title: 'Made in the USA',
    desc: 'Every product is manufactured in Palmyra, NY. We believe in American craftsmanship and keeping production close to home.',
  },
  {
    title: 'Archival Quality',
    desc: 'Acid-free, lignin-free materials designed to protect your most valued items for generations without degradation.',
  },
  {
    title: 'Direct-to-Consumer',
    desc: 'We cut out the middleman. Exceptional quality at fair prices, shipped directly to photographers, collectors, and archivists.',
  },
  {
    title: 'Customization',
    desc: 'We work with institutions, studios, and collectors to create custom archival solutions for unique preservation needs.',
  },
]

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Hero */}
      <div style={{ backgroundColor: 'var(--color-charcoal)' }} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="w-8 h-px mb-8" style={{ backgroundColor: 'var(--color-kraft)' }} />
            <h1
              className="text-4xl md:text-5xl font-light tracking-widest uppercase mb-6"
              style={{ color: 'var(--color-ivory)' }}
            >
              About Native Archival
            </h1>
            <p
              className="text-sm leading-relaxed tracking-wide"
              style={{ color: 'var(--color-silver)' }}
            >
              Dark. Precise. Material. We make products that protect what you value most.
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-8 h-px mb-8" style={{ backgroundColor: 'var(--color-kraft)' }} />
              <h2
                className="text-2xl font-light tracking-widest uppercase mb-6"
                style={{ color: 'var(--color-charcoal)' }}
              >
                Our Story
              </h2>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
                  Native Archival is a brand operated by Pulp Packaging, Inc., a manufacturing company based in Palmyra, New York. We specialize in archival and preservation products designed to protect photographs, documents, artwork, and collectibles for generations.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
                  Founded on the belief that preservation should be accessible, we combine manufacturing expertise with archival science to create products that professionals and enthusiasts trust.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
                  Everything we make is produced in the United States. Our materials are acid-free, lignin-free, and tested to meet archival standards — because the things worth keeping deserve more than ordinary storage.
                </p>
              </div>
            </div>
            <div
              className="aspect-square flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-charcoal)' }}
            >
              <div className="text-center px-8">
                <div className="w-10 h-px mx-auto mb-6" style={{ backgroundColor: 'var(--color-kraft)' }} />
                <p
                  className="text-lg font-light tracking-widest uppercase leading-relaxed"
                  style={{ color: 'var(--color-ivory)' }}
                >
                  "We make products that protect what you value most — photographs, documents, artwork, and memories."
                </p>
                <div className="w-10 h-px mx-auto mt-6" style={{ backgroundColor: 'var(--color-kraft)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section
        style={{ backgroundColor: 'var(--color-charcoal)' }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-8 h-px mx-auto mb-8" style={{ backgroundColor: 'var(--color-kraft)' }} />
          <h2
            className="text-2xl font-light tracking-widest uppercase mb-8"
            style={{ color: 'var(--color-ivory)' }}
          >
            Our Mission
          </h2>
          <p
            className="text-base font-light tracking-wide max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-silver)' }}
          >
            To protect the physical record — photographs, prints, documents, and collectibles — with materials and craft worthy of what they preserve.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-ivory-dark)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="w-8 h-px mx-auto mb-6" style={{ backgroundColor: 'var(--color-kraft)' }} />
            <h2
              className="text-2xl font-light tracking-widest uppercase"
              style={{ color: 'var(--color-charcoal)' }}
            >
              What We Stand For
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="p-6" style={{ backgroundColor: 'var(--color-charcoal)' }}>
                <div className="w-6 h-px mb-5" style={{ backgroundColor: 'var(--color-kraft)' }} />
                <h3
                  className="text-xs font-medium uppercase tracking-widest mb-3"
                  style={{ color: 'var(--color-ivory)' }}
                >
                  {value.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-silver)' }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-6 h-px mb-4" style={{ backgroundColor: 'var(--color-kraft)' }} />
              <h3
                className="text-xs font-medium uppercase tracking-widest mb-3"
                style={{ color: 'var(--color-charcoal)' }}
              >
                Location
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-silver)' }}>
                P.O. Box 475<br />
                Palmyra, NY 14522<br />
                United States
              </p>
            </div>
            <div>
              <div className="w-6 h-px mb-4" style={{ backgroundColor: 'var(--color-kraft)' }} />
              <h3
                className="text-xs font-medium uppercase tracking-widest mb-3"
                style={{ color: 'var(--color-charcoal)' }}
              >
                Contact
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-silver)' }}>
                custservice@nativearchival.com
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-silver)' }}>
                315-502-4265
              </p>
            </div>
            <div>
              <div className="w-6 h-px mb-4" style={{ backgroundColor: 'var(--color-kraft)' }} />
              <h3
                className="text-xs font-medium uppercase tracking-widest mb-3"
                style={{ color: 'var(--color-charcoal)' }}
              >
                Company
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-silver)' }}>
                Operated by Pulp Packaging, Inc.
              </p>
              <Link
                href="/contact"
                className="text-xs mt-3 inline-block uppercase tracking-widest"
                style={{ color: 'var(--color-kraft)' }}
              >
                Get in Touch →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
