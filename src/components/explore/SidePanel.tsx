'use client'

import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useEffect } from 'react'

import type { ArtifactKind, GraphNode, SourceOrigin } from '@/lib/graph/types'

const ORIGIN_LABEL: Record<SourceOrigin, string> = {
  canonical: 'Canonical resume',
  'tailored-hpe': 'HPE GL Flex tailored',
  'tailored-deloitte': 'Deloitte tailored',
  'tailored-collabera': 'Collabera tailored',
  'cover-letter-hpe': 'HPE cover letter',
  'cover-letter-deloitte': 'Deloitte cover letter',
  'cover-letter-collabera': 'Collabera cover letter',
  'docx-v2-delivery': 'V2 Delivery Leader source',
  'docx-resume-c': 'Resume C source',
  'docx-resume-a': 'Resume A source',
}

const KIND_LABEL: Record<GraphNode['kind'], string> = {
  core: 'Profile',
  role: 'Role',
  skill: 'Skill cluster',
  outcome: 'Outcome',
  artifact: 'Artifact',
  pattern: 'Cross-role pattern',
}

const ARTIFACT_KIND_LABEL: Record<ArtifactKind, string> = {
  publication: 'Publication',
  certification: 'Certification',
  'github-repo': 'GitHub repository',
  'thought-leadership': 'Thought leadership',
}

interface Props {
  node: GraphNode | null
  onClose: () => void
}

export default function SidePanel({ node, onClose }: Props) {
  useEffect(() => {
    if (!node) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [node, onClose])

  return (
    <AnimatePresence>
      {node && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-bg-dark/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-label={`Detail: ${node.label}`}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-[440px] overflow-y-auto border-l border-edge-idle/40 bg-bg-dark-elev/95 backdrop-blur-xl"
            initial={{ x: 460, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 460, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <PanelInner node={node} onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function PanelInner({
  node,
  onClose,
}: {
  node: GraphNode
  onClose: () => void
}) {
  return (
    <div className="flex flex-col gap-6 p-7">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <KindBadge kind={node.kind} />
          <h2 className="font-serif text-2xl leading-tight text-text-dark">
            {titleFor(node)}
          </h2>
          <SubtitleFor node={node} />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
          className="shrink-0 rounded-full border border-edge-idle/40 p-2 text-text-dark-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 2L12 12M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>

      <DetailBody node={node} />

      <OriginsFooter origins={node.origins} primary={node.primaryOrigin} />
    </div>
  )
}

function titleFor(node: GraphNode): string {
  if (node.kind === 'role') return node.client ?? node.company
  return node.label
}

function SubtitleFor({ node }: { node: GraphNode }) {
  if (node.kind === 'outcome') {
    return node.metric ? (
      <p className="font-mono text-base text-accent">{node.metric}</p>
    ) : null
  }
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-dark-muted">
      {subtitleText(node)}
    </p>
  )
}

function subtitleText(node: Exclude<GraphNode, { kind: 'outcome' }>): string {
  switch (node.kind) {
    case 'core':
      return node.tagline
    case 'role':
      return `${node.dates} · ${node.duration}${node.location ? ` · ${node.location}` : ''}`
    case 'artifact':
      return ARTIFACT_KIND_LABEL[node.artifactKind]
    case 'skill':
      return `${node.members.length} signals · cluster`
    case 'pattern':
      return `Cross-role pattern · spans ${node.spannedRoleIds.length} roles`
  }
}

function DetailBody({ node }: { node: GraphNode }) {
  switch (node.kind) {
    case 'core':
      return (
        <div className="space-y-4 text-sm leading-relaxed text-text-dark">
          <p>
            14 years building, coaching, and shipping at the intersection of
            AI/ML and enterprise delivery. Currently leading Edge Platform
            Automation at McDonald&rsquo;s; previously delivered AI-powered
            product work across Société Générale, Crédit Agricole, and ENEDIS;
            co-founded an AI startup; published ML research; SAFe SPC6 trainer.
          </p>
          <p className="text-text-dark-muted">
            Click any node to explore. Use the preset chips below to filter by
            audience: Technical, Leadership, or Outcomes.
          </p>
        </div>
      )
    case 'role':
      return (
        <div className="space-y-4">
          {node.isGapMaterial && <GapBadge />}
          <ul className="space-y-2.5 text-sm leading-relaxed text-text-dark">
            {node.bullets.map((b, i) => (
              <li
                key={`${node.id}-bullet-${i}`}
                className="relative pl-4 before:absolute before:left-0 before:top-2 before:h-1 before:w-1 before:rounded-full before:bg-accent"
              >
                <RichText text={b} />
              </li>
            ))}
          </ul>
        </div>
      )
    case 'skill':
      return (
        <div className="flex flex-wrap gap-2">
          {node.members.map((m) => (
            <span
              key={`${node.id}-${m}`}
              className="rounded-full border border-edge-idle/60 bg-bg-dark/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-dark"
            >
              {m}
            </span>
          ))}
        </div>
      )
    case 'outcome':
      return (
        <p className="text-sm leading-relaxed text-text-dark">{node.story}</p>
      )
    case 'artifact':
      return (
        <div className="space-y-3">
          {node.detail && (
            <p className="text-sm leading-relaxed text-text-dark">
              {node.detail}
            </p>
          )}
          {node.url && (
            <a
              href={node.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent transition-colors hover:text-text-dark"
            >
              Open artifact <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )
    case 'pattern':
      return (
        <p className="text-sm leading-relaxed text-text-dark">
          {node.description}
        </p>
      )
  }
}

function GapBadge() {
  return (
    <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
      ⌥ Surfaced from source archive — outside canonical resume
    </div>
  )
}

function KindBadge({ kind }: { kind: GraphNode['kind'] }) {
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-edge-idle/40 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-text-dark-muted">
      <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
      {KIND_LABEL[kind]}
    </span>
  )
}

function OriginsFooter({
  origins,
  primary,
}: {
  origins: SourceOrigin[]
  primary: SourceOrigin
}) {
  return (
    <footer className="mt-2 border-t border-edge-idle/30 pt-4">
      <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-text-dark-muted">
        Sourced from
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {origins.map((o) => (
          <li
            key={o}
            className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] ${
              o === primary
                ? 'border border-accent/50 bg-accent/10 text-accent'
                : 'border border-edge-idle/40 text-text-dark-muted'
            }`}
          >
            {ORIGIN_LABEL[o]}
          </li>
        ))}
      </ul>
    </footer>
  )
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        const key = `${i}:${part.slice(0, 12)}`
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={key} className="font-semibold text-accent">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <Fragment key={key}>{part}</Fragment>
      })}
    </>
  )
}
