'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'

import HeaderBar from '@/components/explore/HeaderBar'
import PresetChips from '@/components/explore/PresetChips'
import ResumeButton from '@/components/explore/ResumeButton'
import SidePanel from '@/components/explore/SidePanel'
import type { MergedCurriculum } from '@/lib/graph/mergeSources'
import { getPreset, type PresetId } from '@/lib/graph/presets'
import { edgeEndpointId, type Graph } from '@/lib/graph/types'

const CareerGraph = dynamic(() => import('@/components/explore/CareerGraph'), {
  ssr: false,
  loading: () => <BootLoader />,
})

const EMPTY_SET: ReadonlySet<string> = new Set()

interface Props {
  graph: Graph
  core: MergedCurriculum['core']
}

export default function GraphClient({ graph, core }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [presetId, setPresetId] = useState<PresetId>('all')

  const nodeById = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, n])),
    [graph],
  )
  const adjacency = useMemo(() => buildAdjacency(graph), [graph])

  const dimmedIds = useMemo(
    () => computeDimmed(graph, presetId),
    [graph, presetId],
  )
  const focusId = hoveredId ?? selectedId
  const focusedNeighborIds = focusId
    ? (adjacency.get(focusId) ?? EMPTY_SET)
    : EMPTY_SET
  const selectedNode = selectedId ? (nodeById.get(selectedId) ?? null) : null

  const closePanel = useCallback(() => setSelectedId(null), [])

  return (
    <div className="relative h-screen w-screen bg-bg-dark text-text-dark">
      <HeaderBar core={core} />
      <ResumeButton />
      <CareerGraph
        graph={graph}
        selectedId={selectedId}
        hoveredId={hoveredId}
        dimmedIds={dimmedIds}
        focusNeighborIds={focusedNeighborIds}
        onSelect={setSelectedId}
        onHover={setHoveredId}
      />
      <PresetChips active={presetId} onChange={setPresetId} />
      <SidePanel node={selectedNode} onClose={closePanel} />
    </div>
  )
}

function computeDimmed(graph: Graph, presetId: PresetId): ReadonlySet<string> {
  if (presetId === 'all') return EMPTY_SET
  const preset = getPreset(presetId)
  return new Set(graph.nodes.filter((n) => !preset.matches(n)).map((n) => n.id))
}

function buildAdjacency(graph: Graph): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>()
  const link = (from: string, to: string) => {
    let bucket = adj.get(from)
    if (!bucket) {
      bucket = new Set()
      adj.set(from, bucket)
    }
    bucket.add(to)
  }
  for (const edge of graph.edges) {
    const s = edgeEndpointId(edge.source)
    const t = edgeEndpointId(edge.target)
    link(s, t)
    link(t, s)
  }
  return adj
}

function BootLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-text-dark-muted">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em]">
        ◌ Initializing career network…
      </div>
    </div>
  )
}
