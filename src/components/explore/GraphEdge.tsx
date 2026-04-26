'use client'

import { motion } from 'motion/react'
import { memo } from 'react'

import type { GraphEdge as GraphEdgeT } from '@/lib/graph/types'
import { PALETTE } from './visuals'

interface Props {
  edge: GraphEdgeT
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  active: boolean
  dimmed: boolean
  index: number
}

function GraphEdgeImpl({
  edge,
  sourceX,
  sourceY,
  targetX,
  targetY,
  active,
  dimmed,
  index,
}: Props) {
  const path = edgePath(sourceX, sourceY, targetX, targetY)
  const isPattern =
    edge.kind === 'role-pattern' || edge.kind === 'pattern-skill'

  return (
    <>
      <motion.path
        d={path}
        fill="none"
        stroke={active ? PALETTE.gold : PALETTE.edgeIdle}
        strokeWidth={active ? 1.4 : 0.7}
        strokeOpacity={dimmed ? 0.06 : active ? 0.95 : 0.55}
        strokeDasharray={isPattern ? '2 4' : active ? '4 10' : undefined}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: dimmed ? 0.18 : 1,
          strokeDashoffset: active ? -28 : 0,
        }}
        transition={{
          pathLength: {
            duration: 0.9,
            delay: 0.55 + index * 0.012,
            ease: 'easeOut',
          },
          opacity: { duration: 0.4, delay: 0.55 + index * 0.012 },
          strokeDashoffset: active
            ? { duration: 1.2, repeat: Infinity, ease: 'linear' }
            : { duration: 0 },
        }}
      />
      {active && <CometHead path={path} />}
    </>
  )
}

const GraphEdge = memo(GraphEdgeImpl)
export default GraphEdge

function CometHead({ path }: { path: string }) {
  return (
    <>
      <circle r={3} fill={PALETTE.gold}>
        <animateMotion
          dur="1.2s"
          repeatCount="indefinite"
          path={path}
          rotate="auto"
        />
      </circle>
      <circle r={1.5} fill={PALETTE.ink} opacity={0.9}>
        <animateMotion
          dur="1.2s"
          repeatCount="indefinite"
          path={path}
          rotate="auto"
        />
      </circle>
    </>
  )
}

function edgePath(sx: number, sy: number, tx: number, ty: number): string {
  const dx = tx - sx
  const dy = ty - sy
  const dist = Math.hypot(dx, dy) || 1
  const mx = (sx + tx) / 2
  const my = (sy + ty) / 2
  const perpX = -dy / dist
  const perpY = dx / dist
  const curvature = Math.min(28, dist * 0.08)
  const cx = mx + perpX * curvature
  const cy = my + perpY * curvature
  return `M ${sx.toFixed(2)},${sy.toFixed(2)} Q ${cx.toFixed(2)},${cy.toFixed(2)} ${tx.toFixed(2)},${ty.toFixed(2)}`
}
