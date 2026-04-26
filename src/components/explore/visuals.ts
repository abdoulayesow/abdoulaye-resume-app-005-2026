import type { EdgeKind, GraphNode } from '@/lib/graph/types'

export const VIEWBOX = { width: 1400, height: 900 } as const

export function nodeRadius(node: GraphNode): number {
  switch (node.kind) {
    case 'core':
      return 48
    case 'role':
      return node.id === 'role-mcdonalds' ? 30 : 22
    case 'skill':
      return 18
    case 'outcome':
      return 8
    case 'artifact':
      return 11
    case 'pattern':
      return 26
  }
}

const LINK_PROFILE: Record<EdgeKind, { distance: number; strength: number }> = {
  'core-role': { distance: 220, strength: 0.7 },
  'core-skill': { distance: 160, strength: 0.7 },
  'role-skill': { distance: 130, strength: 0.4 },
  'role-outcome': { distance: 90, strength: 0.5 },
  'skill-outcome': { distance: 110, strength: 0.2 },
  'role-artifact': { distance: 80, strength: 0.35 },
  'role-pattern': { distance: 110, strength: 0.4 },
  'pattern-skill': { distance: 110, strength: 0.4 },
}

export function linkDistance(kind: EdgeKind): number {
  return LINK_PROFILE[kind].distance
}

export function linkStrength(kind: EdgeKind): number {
  return LINK_PROFILE[kind].strength
}

export const PALETTE = {
  bg: '#050b18',
  bgElev: '#0a1628',
  ink: '#e6edf7',
  inkMuted: 'rgba(230, 237, 247, 0.62)',
  inkFaint: 'rgba(230, 237, 247, 0.32)',
  gold: '#f0c674',
  goldDim: 'rgba(240, 198, 116, 0.55)',
  glow: 'rgba(240, 198, 116, 0.55)',
  teal: '#5fa8c4',
  tealDim: 'rgba(95, 168, 196, 0.45)',
  edgeIdle: 'rgba(95, 168, 196, 0.32)',
  edgeDim: 'rgba(95, 168, 196, 0.08)',
} as const
