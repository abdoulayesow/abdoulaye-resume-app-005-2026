'use client'

import { motion } from 'motion/react'
import { memo, type ReactNode } from 'react'

import type { GraphNode as GraphNodeT, NodeKind } from '@/lib/graph/types'
import { nodeRadius, PALETTE } from './visuals'

interface Props {
  node: GraphNodeT
  isSelected: boolean
  isHovered: boolean
  isDimmed: boolean
  isFocusedNeighbor: boolean
  index: number
  onClick: (id: string) => void
  onHover: (id: string | null) => void
}

function GraphNodeImpl(props: Props) {
  const { node, index } = props
  const x = node.x ?? 0
  const y = node.y ?? 0
  const r = nodeRadius(node)
  const active = props.isHovered || props.isSelected
  const focused = props.isFocusedNeighbor

  return (
    <motion.g
      transform={`translate(${x},${y})`}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: props.isDimmed ? 0.18 : 1, scale: 1 }}
      transition={{
        opacity: { duration: 0.45, delay: 0.12 + index * 0.022 },
        scale: {
          type: 'spring',
          stiffness: 240,
          damping: 22,
          delay: 0.12 + index * 0.022,
        },
      }}
      style={{ cursor: 'pointer' }}
      onPointerEnter={() => props.onHover(node.id)}
      onPointerLeave={() => props.onHover(null)}
      onClick={() => props.onClick(node.id)}
    >
      {renderShape(node, r, active, focused)}
      {renderLabel(node, r)}
    </motion.g>
  )
}

const GraphNode = memo(GraphNodeImpl)
export default GraphNode

function renderShape(
  node: GraphNodeT,
  r: number,
  active: boolean,
  focused: boolean,
): ReactNode {
  const lit = active || focused
  switch (node.kind) {
    case 'core':
      return <CoreShape r={r} active={active} />
    case 'role':
      return <RoleShape r={r} active={lit} isGap={node.isGapMaterial} />
    case 'skill':
      return <SkillShape r={r} active={lit} />
    case 'outcome':
      return <OutcomeShape r={r} active={lit} />
    case 'artifact':
      return <ArtifactShape r={r} active={lit} />
    case 'pattern':
      return <PatternShape r={r} active={lit} />
  }
}

function CoreShape({ r, active }: { r: number; active: boolean }) {
  return (
    <>
      <motion.circle
        r={r * 1.9}
        fill={PALETTE.gold}
        opacity={0}
        animate={{ r: [r * 1.6, r * 2.4], opacity: [0.22, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.circle
        r={r * 1.5}
        fill={PALETTE.gold}
        opacity={0}
        animate={{ r: [r * 1.3, r * 2.0], opacity: [0.32, 0] }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 1.1,
        }}
      />
      <circle
        r={r + 8}
        fill="none"
        stroke={PALETTE.gold}
        strokeOpacity={0.35}
        strokeWidth={0.6}
      />
      <circle
        r={r}
        fill={PALETTE.bgElev}
        stroke={PALETTE.gold}
        strokeWidth={1.5}
      />
      <circle
        r={r - 6}
        fill="none"
        stroke={PALETTE.gold}
        strokeOpacity={0.5}
        strokeWidth={0.5}
      />
      <motion.circle
        r={r * 0.4}
        fill={PALETTE.gold}
        animate={{ opacity: active ? 0.85 : [0.55, 0.85, 0.55] }}
        transition={
          active
            ? { duration: 0.2 }
            : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        }
      />
    </>
  )
}

function RoleShape({
  r,
  active,
  isGap,
}: {
  r: number
  active: boolean
  isGap: boolean
}) {
  return (
    <>
      <motion.circle
        r={r + 6}
        fill={PALETTE.gold}
        opacity={0}
        animate={{ opacity: active ? 0.18 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <circle
        r={r}
        fill={PALETTE.bgElev}
        stroke={active ? PALETTE.gold : PALETTE.tealDim}
        strokeWidth={active ? 1.6 : 1}
        strokeDasharray={isGap ? '3 2' : undefined}
      />
      <circle
        r={r * 0.35}
        fill={active ? PALETTE.gold : PALETTE.teal}
        opacity={0.85}
      />
    </>
  )
}

function SkillShape({ r, active }: { r: number; active: boolean }) {
  return (
    <>
      <motion.circle
        r={r + 5}
        fill={PALETTE.teal}
        opacity={0}
        animate={{ opacity: active ? 0.22 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <circle r={r} fill={PALETTE.teal} fillOpacity={active ? 0.28 : 0.16} />
      <circle
        r={r}
        fill="none"
        stroke={PALETTE.teal}
        strokeOpacity={active ? 1 : 0.55}
      />
    </>
  )
}

function OutcomeShape({ r, active }: { r: number; active: boolean }) {
  return (
    <>
      <motion.circle
        r={r + 4}
        fill={PALETTE.gold}
        opacity={0}
        animate={{ opacity: active ? 0.45 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <circle r={r} fill={PALETTE.gold} fillOpacity={active ? 1 : 0.85} />
      <circle r={r * 0.45} fill={PALETTE.bg} />
    </>
  )
}

function ArtifactShape({ r, active }: { r: number; active: boolean }) {
  const half = r
  const path = `M0,-${half} L${half},0 L0,${half} L-${half},0 Z`
  return (
    <>
      <motion.path
        d={`M0,-${half * 1.4} L${half * 1.4},0 L0,${half * 1.4} L-${half * 1.4},0 Z`}
        fill={PALETTE.gold}
        opacity={0}
        animate={{ opacity: active ? 0.22 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <path
        d={path}
        fill={PALETTE.bgElev}
        stroke={active ? PALETTE.gold : PALETTE.goldDim}
        strokeWidth={active ? 1.4 : 0.9}
      />
      <circle r={2} fill={PALETTE.gold} />
    </>
  )
}

function PatternShape({ r, active }: { r: number; active: boolean }) {
  return (
    <>
      <motion.circle
        r={r + 6}
        fill={PALETTE.gold}
        opacity={0}
        animate={{ opacity: active ? 0.16 : 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.circle
        r={r}
        fill="none"
        stroke={PALETTE.gold}
        strokeWidth={1.4}
        strokeDasharray="2 4"
        animate={{ rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
      />
      <circle
        r={r * 0.5}
        fill={PALETTE.bgElev}
        stroke={PALETTE.goldDim}
        strokeWidth={0.8}
      />
      <circle r={r * 0.18} fill={PALETTE.gold} />
    </>
  )
}

const LABEL_STYLE: Record<
  Exclude<NodeKind, 'core'>,
  { fontSize: number; mono: boolean }
> = {
  role: { fontSize: 11, mono: true },
  skill: { fontSize: 10, mono: false },
  outcome: { fontSize: 8.5, mono: true },
  artifact: { fontSize: 11, mono: false },
  pattern: { fontSize: 11, mono: true },
}

function renderLabel(node: GraphNodeT, r: number): ReactNode {
  if (node.kind === 'core') {
    return (
      <g pointerEvents="none">
        <text
          y={r + 28}
          textAnchor="middle"
          fontFamily="var(--font-serif), Georgia, serif"
          fontSize={20}
          fill={PALETTE.ink}
          letterSpacing="0.04em"
        >
          {node.label}
        </text>
        <text
          y={r + 48}
          textAnchor="middle"
          fontFamily="var(--font-mono), monospace"
          fontSize={9}
          fill={PALETTE.inkFaint}
          letterSpacing="0.18em"
        >
          {node.tagline.toUpperCase()}
        </text>
      </g>
    )
  }
  const style = LABEL_STYLE[node.kind]
  return (
    <text
      pointerEvents="none"
      y={r + 14}
      textAnchor="middle"
      fontFamily={
        style.mono
          ? 'var(--font-mono), monospace'
          : 'var(--font-sans), system-ui, sans-serif'
      }
      fontSize={style.fontSize}
      fill={PALETTE.inkMuted}
      letterSpacing="0.05em"
    >
      {node.label}
    </text>
  )
}
