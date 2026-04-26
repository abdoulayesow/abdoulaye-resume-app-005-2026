'use client'

import { motion } from 'motion/react'

import { PRESETS, type PresetId } from '@/lib/graph/presets'

interface Props {
  active: PresetId
  onChange: (id: PresetId) => void
}

export default function PresetChips({ active, onChange }: Props) {
  return (
    <motion.div
      className="pointer-events-none fixed bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.55, ease: 'easeOut' }}
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-edge-idle/60 bg-bg-dark-elev/70 p-1 backdrop-blur-md">
        {PRESETS.map((preset) => {
          const isActive = preset.id === active
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.id)}
              className="relative rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted transition-colors hover:text-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-pressed={isActive}
              aria-label={`${preset.label}: ${preset.hint}`}
            >
              {isActive && (
                <motion.span
                  layoutId="preset-pill"
                  className="absolute inset-0 rounded-full bg-accent/15 ring-1 ring-accent/60"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative ${isActive ? 'text-text-dark' : ''}`}>
                {preset.label}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
