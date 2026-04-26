import { buildGraph } from '../src/lib/graph/buildGraph'
import { loadAllSources } from '../src/lib/graph/loadSources'
import { mergeSources } from '../src/lib/graph/mergeSources'

const repoRoot = process.cwd()
const sources = loadAllSources(repoRoot)
const merged = mergeSources(sources)
const graph = buildGraph(merged)

const summary = {
  sources: sources.map((s) => ({
    origin: s.origin,
    kind: s.kind,
    sectionsCount: s.kind === 'yaml-canonical' ? null : s.sections.length,
  })),
  merged: {
    core: merged.core,
    rolesCount: merged.roles.length,
    skillsCount: merged.skills.length,
    outcomesCount: merged.outcomes.length,
    artifactsCount: merged.artifacts.length,
    patternsCount: merged.patterns.length,
    gapMaterialRoles: merged.roles.filter((r) => r.isGapMaterial).map((r) => r.id),
    nonCanonicalOrigins: collectNonCanonical(merged),
  },
  graph: {
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    nodesByKind: groupByKind(graph.nodes),
    edgesByKind: groupEdgesByKind(graph.edges),
  },
  full: { merged, graph },
}

console.log(JSON.stringify(summary, null, 2))

function collectNonCanonical(merged: ReturnType<typeof mergeSources>): string[] {
  const all = [
    ...merged.roles,
    ...merged.outcomes,
    ...merged.artifacts,
    ...merged.patterns,
  ]
  return Array.from(
    new Set(all.flatMap((n) => n.origins).filter((o) => o !== 'canonical')),
  )
}

function groupByKind<T extends { kind: string; id: string; label: string }>(
  items: T[],
): Record<string, { id: string; label: string }[]> {
  return items.reduce<Record<string, { id: string; label: string }[]>>((acc, item) => {
    const bucket = acc[item.kind] ?? []
    bucket.push({ id: item.id, label: item.label })
    acc[item.kind] = bucket
    return acc
  }, {})
}

function groupEdgesByKind<T extends { kind: string }>(items: T[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item.kind] = (acc[item.kind] ?? 0) + 1
    return acc
  }, {})
}
