'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

export default function ResumeButton() {
  return (
    <motion.div
      className="pointer-events-none fixed right-6 top-6 z-30 flex items-center gap-2"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
    >
      <Link
        href="/product-manager-ai-ml"
        className="pointer-events-auto group relative inline-flex items-center gap-3 rounded-full border border-accent/40 bg-bg-dark-elev/70 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-text-dark backdrop-blur-md transition-all hover:border-accent hover:bg-bg-dark-elev/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-accent/0 blur-md transition-all group-hover:bg-accent/20" />
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]"
        />
        Printable Resume
        <span
          aria-hidden="true"
          className="text-accent transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    </motion.div>
  )
}
