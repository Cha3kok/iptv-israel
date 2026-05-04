import type { Metadata, Viewport } from 'next'
import { Heebo, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const heebo    = Heebo({ subsets: ['hebrew'], variable: '--font-heebo' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

const SITE_URL  = 'https://iptv.co.il'
const SITE_NAME = 'IPTV ישראל'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'IPTV ישראל – 21,000 ערוצים | 4K UHD | ₪62 לחודש',
    template: '%s | IPTV ישראל',
  },

  description:
    'שירות IPTV פרימיום לישראל – 21,000+ ערוצים חיים, 65,000 סרטים וסדרות VOD, איכות 4K UHD, ניסיון חינם 3 שעות. HOT ויס מחצית המחיר. תמיכה 24/7 בעברית.',

  keywords: [
    'IPTV ישראל', 'מנוי IPTV', 'iptv israel', 'ערוצי טלוויזיה ישראלים',
    'IPTV 4K', 'iptv מומלץ', 'iptv ישראל חינם', 'ערוצי ספורט bein',
    'tivimate ישראל', 'IPTV Smarters', 'שירות IPTV', 'מנוי iptv מומלץ',
    'iptv ישראל 2026', 'iptv subscription israel', 'best iptv israel',
    'iptv provider israel', 'iptv 21000 ערוצים', 'HOT iptv חלופה',
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  alternates: {
    canonical: SITE_URL,
    languages: { 'he-IL': SITE_URL },
  },

  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'IPTV ישראל – 21,000 ערוצים | 4K UHD | ₪62 לחודש',
    description:
      'שירות IPTV פרימיום לישראל – 21,000+ ערוצים חיים, 65,000 VOD, 4K UHD. ניסיון חינם 3 שעות. תמיכה 24/7 בעברית.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'IPTV ישראל – 21,000 ערוצים באיכות 4K UHD',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@iptvIsrael',
    creator: '@iptvIsrael',
    title: 'IPTV ישראל – 21,000 ערוצים | 4K UHD | ₪62 לחודש',
    description:
      'שירות IPTV פרימיום לישראל – 21,000+ ערוצים, 65,000 VOD, 4K UHD. ניסיון חינם 3 שעות.',
    images: ['/opengraph-image'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },

  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: 'שירות IPTV פרימיום לישראל עם 21,000 ערוצים',
      inLanguage: 'he-IL',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
        width: 36,
        height: 36,
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+212707711512',
          contactType: 'customer service',
          availableLanguage: ['Hebrew', 'Arabic', 'English'],
          contactOption: 'TollFree',
          areaServed: 'IL',
        },
      ],
      sameAs: [
        'https://wa.me/212707711512',
      ],
    },
    {
      '@type': 'Product',
      '@id': `${SITE_URL}/#product`,
      name: 'IPTV ישראל – מנוי פרימיום',
      description: '21,000+ ערוצים חיים, 65,000 סרטים וסדרות, איכות 4K UHD',
      brand: { '@type': 'Brand', name: SITE_NAME },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'ILS',
        lowPrice: '62',
        highPrice: '432',
        offerCount: 5,
        offers: [
          { '@type': 'Offer', name: '1 חודש', price: '62', priceCurrency: 'ILS' },
          { '@type': 'Offer', name: '3 חודשים', price: '124', priceCurrency: 'ILS' },
          { '@type': 'Offer', name: '6 חודשים', price: '152', priceCurrency: 'ILS' },
          { '@type': 'Offer', name: '12 חודשים', price: '240', priceCurrency: 'ILS' },
          { '@type': 'Offer', name: '24 חודשים', price: '432', priceCurrency: 'ILS' },
        ],
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-right">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
