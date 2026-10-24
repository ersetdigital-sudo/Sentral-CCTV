import type { Metadata, Viewport } from 'next'
import './globals.css'
import { inter } from '@/lib/fonts'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sentral CCTV — Kasir & Inventory',
    template: '%s · Sentral CCTV',
  },
  description:
    'Sistem kasir, inventory, dan jasa instalasi CCTV untuk Sentral CCTV Sleman, Yogyakarta. Kelola produk, stok, transaksi penjualan, pembelian, dan pekerjaan instalasi dalam satu dashboard.',
  keywords: [
    'kasir CCTV',
    'inventory CCTV',
    'sistem kasir',
    'instalasi CCTV Sleman',
    'Sentral CCTV',
    'dashboard stok',
  ],
  authors: [{ name: 'Sentral CCTV' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'Sentral CCTV',
    title: 'Sentral CCTV — Kasir & Inventory',
    description:
      'Kelola kasir, stok produk CCTV, pembelian, dan jasa instalasi dalam satu dashboard modern.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sentral CCTV — Kasir & Inventory',
    description: 'Kasir, inventory, dan management instalasi CCTV dalam satu dashboard.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Sentral CCTV',
  description: 'Toko & jasa instalasi CCTV: kamera, DVR/NVR, hard disk, dan pemasangan di Sleman, Yogyakarta.',
  url: siteUrl,
  telephone: '+62-812-0000-1234',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Contoh Raya No. 88',
    addressLocality: 'Sleman',
    addressRegion: 'Yogyakarta',
    addressCountry: 'ID',
  },
  areaServed: 'Sleman, Yogyakarta',
  openingHours: 'Mo-Sa 08:00-18:00',
  priceRange: '$$',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
