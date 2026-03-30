import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const instrumentSerif = localFont({
  src: [
    {
      path: '../public/fonts/instrument-serif-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-display',
})

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
    <html lang="en" className={instrumentSerif.variable}>
      <body>{children}</body>
    </html>
  )
}
