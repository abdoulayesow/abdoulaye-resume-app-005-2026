import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import type React from 'react'

const mono = IBM_Plex_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
})

export function generateMetadata(): Metadata {
  return {
    title: 'Career Network — Abdoulaye Sow',
    description:
      "Interactive neural-network exploration of Abdoulaye Sow's 14-year career: roles, AI/ML skills, outcomes, and artifacts. Built as a live demo of AI/ML PM craft.",
  }
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${mono.variable} theme-dark min-h-screen w-full overflow-x-hidden print:hidden`}
    >
      {children}
      <noscript>
        <p className="p-8 text-text-dark">
          This visualization requires JavaScript. View the printable resume at{' '}
          <a className="underline" href="/product-manager-ai-ml">
            /product-manager-ai-ml
          </a>
          .
        </p>
      </noscript>
      <div className="hidden print:block">
        <p>
          For the printable resume, see{' '}
          <a href="/product-manager-ai-ml">/product-manager-ai-ml</a>.
        </p>
      </div>
    </div>
  )
}
