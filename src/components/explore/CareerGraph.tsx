'use client'

import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'
import { useMemo } from 'react'

import {
  edgeEndpointId,
  type Graph,
  type GraphEdge as GraphEdgeT,
  type GraphNode,
} from '@/lib/graph/types'
import GraphEdge from './GraphEdge'
import GraphNodeView from './GraphNode'
import {
  linkDistance,
  linkStrength,
  nodeRadius,
  PALETTE,
  VIEWBOX,
} from './visuals'

const SETTLE_TICKS = 320
const VIEWBOX_ATTR = `${-VIEWBOX.width / 2} ${-VIEWBOX.height / 2} ${VIEWBOX.width} ${VIEWBOX.height}`
const FULL_RECT = {
  x: -VIEWBOX.width / 2,
  y: -VIEWBOX.height / 2,
  width: VIEWBOX.width,
  height: VIEWBOX.height,
} as const

interface EdgeView {
  edge: GraphEdgeT
  sId: string
  tId: string
  sx: number
  sy: number
  tx: number
  ty: number
}

interface SettledGraph {
  nodes: GraphNode[]
  edgeViews: EdgeView[]
}

interface Props {
  graph: Graph
  selectedId: string | null
  hoveredId: string | null
  dimmedIds: ReadonlySet<string>
  focusNeighborIds: ReadonlySet<string>
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export default function CareerGraph(props: Props) {
  const { nodes, edgeViews } = useMemo(
    () => settleGraph(props.graph),
    [props.graph],
  )
  const focusId = props.hoveredId ?? props.selectedId

  return (
    <svg
      viewBox={VIEWBOX_ATTR}
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Career neural network"
    >
      <Backdrop />
      <g>
        {edgeViews.map((ev, i) => (
          <GraphEdge
            key={ev.edge.id}
            edge={ev.edge}
            sourceX={ev.sx}
            sourceY={ev.sy}
            targetX={ev.tx}
            targetY={ev.ty}
            active={focusId === ev.sId || focusId === ev.tId}
            dimmed={props.dimmedIds.has(ev.sId) || props.dimmedIds.has(ev.tId)}
            index={i}
          />
        ))}
      </g>
      <g>
        {nodes.map((node, i) => (
          <GraphNodeView
            key={node.id}
            node={node}
            index={i}
            isSelected={props.selectedId === node.id}
            isHovered={props.hoveredId === node.id}
            isDimmed={props.dimmedIds.has(node.id)}
            isFocusedNeighbor={props.focusNeighborIds.has(node.id)}
            onClick={props.onSelect}
            onHover={props.onHover}
          />
        ))}
      </g>
    </svg>
  )
}

function Backdrop() {
  return (
    <g pointerEvents="none">
      <defs>
        <radialGradient id="atmosphere" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#0d2240" stopOpacity="0.85" />
          <stop offset="55%" stopColor={PALETTE.bg} stopOpacity="1" />
          <stop offset="100%" stopColor="#020610" stopOpacity="1" />
        </radialGradient>
        <pattern
          id="constellation"
          x="0"
          y="0"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="14" cy="22" r="0.6" fill={PALETTE.teal} opacity="0.35" />
          <circle cx="68" cy="9" r="0.4" fill={PALETTE.gold} opacity="0.25" />
          <circle cx="92" cy="74" r="0.5" fill={PALETTE.teal} opacity="0.3" />
          <circle cx="40" cy="98" r="0.35" fill={PALETTE.ink} opacity="0.28" />
          <circle
            cx="105"
            cy="40"
            r="0.45"
            fill={PALETTE.teal}
            opacity="0.22"
          />
        </pattern>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
        </radialGradient>
      </defs>
      <rect {...FULL_RECT} fill="url(#atmosphere)" />
      <rect {...FULL_RECT} fill="url(#constellation)" />
      <rect {...FULL_RECT} fill="url(#vignette)" />
    </g>
  )
}

function chargeFor(node: GraphNode): number {
  switch (node.kind) {
    case 'core':
      return -800
    case 'role':
      return -360
    case 'skill':
      return -260
    case 'pattern':
      return -260
    case 'outcome':
      return -90
    case 'artifact':
      return -120
  }
}

// Run d3-force synchronously to a settled layout, then render once. Avoids the
// per-tick re-render cascade (300 ticks × ~94 motion elements) that costs the
// initial paint heavily and forces motion to interpolate "between" tick frames.
function settleGraph(graph: Graph): SettledGraph {
  const nodes = graph.nodes.map((n) => ({ ...n }))
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const edgeMeta = graph.edges.map((e) => ({
    edge: e,
    sId: edgeEndpointId(e.source),
    tId: edgeEndpointId(e.target),
  }))
  const edges = edgeMeta.map(({ edge, sId, tId }) => ({
    ...edge,
    source: byId.get(sId) ?? sId,
    target: byId.get(tId) ?? tId,
  }))
  const core = nodes.find((n) => n.kind === 'core')
  if (core) {
    core.fx = 0
    core.fy = 0
  }
  const sim = forceSimulation<GraphNode>(nodes)
    .force(
      'link',
      forceLink<GraphNode, GraphEdgeT>(edges)
        .id((n) => n.id)
        .distance((e) => linkDistance(e.kind))
        .strength((e) => linkStrength(e.kind)),
    )
    .force('charge', forceManyBody<GraphNode>().strength(chargeFor))
    .force('center', forceCenter(0, 0).strength(0.04))
    .force(
      'collide',
      forceCollide<GraphNode>().radius((n) => nodeRadius(n) + 6),
    )
    .stop()
  for (let i = 0; i < SETTLE_TICKS; i++) sim.tick()

  const edgeViews: EdgeView[] = []
  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i]
    const { sId, tId } = edgeMeta[i]
    const s = byId.get(sId)
    const t = byId.get(tId)
    if (!s || s.x == null || s.y == null) continue
    if (!t || t.x == null || t.y == null) continue
    edgeViews.push({ edge, sId, tId, sx: s.x, sy: s.y, tx: t.x, ty: t.y })
  }
  return { nodes, edgeViews }
}
