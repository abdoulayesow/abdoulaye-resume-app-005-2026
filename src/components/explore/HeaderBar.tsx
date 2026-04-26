'use client'

import { motion } from 'motion/react'

import type { MergedCurriculum } from '@/lib/graph/mergeSources'

interface Props {
  core: MergedCurriculum['core']
}

export default function HeaderBar({ core }: Props) {
  return (
    <motion.div
      className="pointer-events-none fixed left-6 top-6 z-30 max-w-md"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.18, duration: 0.55, ease: 'easeOut' }}
    >
      <div className="pointer-events-auto flex flex-col gap-2 rounded-md border border-edge-idle/40 bg-bg-dark-elev/55 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent)]"
          />
          Career Network · v.2026.04
        </div>
        <div className="font-serif text-2xl leading-none text-text-dark">
          {core.name}
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-dark-muted">
          {core.tagline}
        </div>
      </div>
    </motion.div>
  )
}
