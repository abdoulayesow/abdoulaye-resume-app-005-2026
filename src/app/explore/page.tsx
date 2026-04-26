import { buildGraph } from '@/lib/graph/buildGraph'
import { loadAllSources } from '@/lib/graph/loadSources'
import { mergeSources } from '@/lib/graph/mergeSources'
import GraphClient from './graph-client'

export default function ExplorePage() {
  const sources = loadAllSources(process.cwd())
  const merged = mergeSources(sources)
  const graph = buildGraph(merged)
  return <GraphClient graph={graph} core={merged.core} />
}
