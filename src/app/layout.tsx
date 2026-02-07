import type { Metadata } from 'next'
import { DM_Serif_Display, Source_Sans_3 } from 'next/font/google'
import './globals.css'

import type React from 'react'

const serif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
})

const sans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
})

export function generateMetadata(): Metadata {
  return {
    title: 'Abdoulaye Sow - Resume',
    description:
      'SAFe SPC6 Certified Trainer and enterprise Agile Transformation Leader',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${serif.variable} ${sans.variable} font-sans bg-stone-100 print:bg-white`}
      >
        {children}
      </body>
    </html>
  )
}
