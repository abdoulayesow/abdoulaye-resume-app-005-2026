import type { Metadata } from 'next'
import { DM_Serif_Display, Source_Sans_3 } from 'next/font/google'
import './globals.css'

import type React from 'react'

import favicon from '../../public/favicon.png'

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
    description: 'Professional Resume - Abdoulaye Sow',
    icons: {
      icon: favicon.src,
    },
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
