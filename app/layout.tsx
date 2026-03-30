import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Native Archival — Archival Preservation Products',
    template: '%s | Native Archival',
  },
  description: 'Professional archival and preservation products made in the USA. Albums, photo storage, print preservers, portfolios, and card collector supplies.',
  keywords: ['archival storage', 'acid-free', 'photo preservation', 'print preservers', 'made in USA'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
