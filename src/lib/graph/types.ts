import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force'

export type SourceOrigin =
  | 'canonical'
  | 'tailored-hpe'
  | 'tailored-deloitte'
  | 'tailored-collabera'
  | 'cover-letter-hpe'
  | 'cover-letter-deloitte'
  | 'cover-letter-collabera'
  | 'docx-v2-delivery'
  | 'docx-resume-c'
  | 'docx-resume-a'

export type NodeKind =
  | 'core'
  | 'role'
  | 'skill'
  | 'outcome'
  | 'artifact'
  | 'pattern'

export type SkillCluster =
  | 'ai-ml'
  | 'product'
  | 'agile-leadership'
  | 'engineering'

export type ArtifactKind =
  | 'publication'
  | 'certification'
  | 'github-repo'
  | 'thought-leadership'

export type EdgeKind =
  | 'core-role'
  | 'core-skill'
  | 'role-skill'
  | 'role-outcome'
  | 'skill-outcome'
  | 'role-artifact'
  | 'role-pattern'
  | 'pattern-skill'

interface BaseNode extends SimulationNodeDatum {
  id: string
  kind: NodeKind
  label: string
  origins: SourceOrigin[]
  primaryOrigin: SourceOrigin
}

export interface CoreNode extends BaseNode {
  kind: 'core'
  tagline: string
}

export interface RoleNode extends BaseNode {
  kind: 'role'
  company: string
  client?: string
  dates: string
  duration: string
  location?: string
  bullets: string[]
  isGapMaterial: boolean
}

export interface SkillNode extends BaseNode {
  kind: 'skill'
  cluster: SkillCluster
  members: string[]
}

export interface OutcomeNode extends BaseNode {
  kind: 'outcome'
  metric?: string
  story: string
  attributedRoleId?: string
}

export interface ArtifactNode extends BaseNode {
  kind: 'artifact'
  url?: string
  artifactKind: ArtifactKind
  detail?: string
}

export interface PatternNode extends BaseNode {
  kind: 'pattern'
  description: string
  spannedRoleIds: string[]
}

export type GraphNode =
  | CoreNode
  | RoleNode
  | SkillNode
  | OutcomeNode
  | ArtifactNode
  | PatternNode

export interface GraphEdge extends SimulationLinkDatum<GraphNode> {
  id: string
  kind: EdgeKind
  weight: number
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export function edgeEndpointId(
  ref: GraphEdge['source'] | GraphEdge['target'],
): string {
  if (typeof ref === 'string') return ref
  if (typeof ref === 'number') return String(ref)
  return ref.id
}
