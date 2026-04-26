import type {
  MergedArtifact,
  MergedCurriculum,
  MergedOutcome,
  MergedPattern,
  MergedRole,
  MergedSkillCluster,
} from './mergeSources'
import type {
  ArtifactNode,
  CoreNode,
  EdgeKind,
  Graph,
  GraphEdge,
  GraphNode,
  OutcomeNode,
  PatternNode,
  RoleNode,
  SkillCluster,
  SkillNode,
} from './types'

const ROLE_SKILL_MAP: Record<string, SkillCluster[]> = {
  'role-mcdonalds': ['ai-ml', 'product', 'agile-leadership'],
  'role-sg': ['ai-ml', 'product', 'engineering'],
  'role-credit-agricole': ['product', 'engineering'],
  'role-enedis': ['ai-ml', 'engineering'],
  'role-friasoft': ['ai-ml', 'product', 'engineering'],
  'role-independent-ai': ['ai-ml', 'engineering'],
}

const PATTERN_SKILL_MAP: Record<string, SkillCluster[]> = {
  'pattern-ai-agents': ['ai-ml', 'agile-leadership'],
}

export function buildGraph(merged: MergedCurriculum): Graph {
  const core = buildCoreNode(merged)
  const roleNodes = merged.roles.map(buildRoleNode)
  const skillNodes = merged.skills.map(buildSkillNode)
  const outcomeNodes = merged.outcomes.map(buildOutcomeNode)
  const artifactNodes = merged.artifacts.map(buildArtifactNode)
  const patternNodes = merged.patterns.map(buildPatternNode)

  const roleIds = new Set(roleNodes.map((r) => r.id))
  const skillByCluster = new Map(skillNodes.map((s) => [s.cluster, s]))

  const nodes: GraphNode[] = [
    core,
    ...roleNodes,
    ...skillNodes,
    ...outcomeNodes,
    ...artifactNodes,
    ...patternNodes,
  ]

  const edges: GraphEdge[] = [
    ...edgesCoreToRoles(core, roleNodes),
    ...edgesCoreToSkills(core, skillNodes),
    ...edgesRoleToSkill(roleNodes, skillByCluster),
    ...edgesRoleToOutcome(roleIds, outcomeNodes),
    ...edgesSkillToOutcome(skillByCluster, outcomeNodes),
    ...edgesRoleToArtifact(roleIds, artifactNodes),
    ...edgesPattern(patternNodes, roleIds, skillByCluster),
  ]

  return { nodes, edges }
}

function buildCoreNode(merged: MergedCurriculum): CoreNode {
  return {
    id: 'core',
    kind: 'core',
    label: merged.core.name,
    tagline: merged.core.tagline,
    origins: ['canonical'],
    primaryOrigin: 'canonical',
  }
}

function buildRoleNode(role: MergedRole): RoleNode {
  return {
    id: role.id,
    kind: 'role',
    label: roleDisplayLabel(role),
    company: role.company,
    client: role.client,
    location: role.location,
    dates: role.dates,
    duration: role.duration,
    bullets: role.bullets,
    isGapMaterial: role.isGapMaterial,
    origins: role.origins,
    primaryOrigin: role.primaryOrigin,
  }
}

const ROLE_LABEL_OVERRIDES: Record<string, string> = {
  'role-independent-ai': 'Independent AI Lab',
  'role-friasoft': 'Friasoft (AI Startup)',
  'role-enedis': 'ENEDIS',
}

function roleDisplayLabel(role: MergedRole): string {
  return ROLE_LABEL_OVERRIDES[role.id] ?? role.client ?? role.company
}

function buildSkillNode(skill: MergedSkillCluster): SkillNode {
  return {
    id: skill.id,
    kind: 'skill',
    label: skill.label,
    cluster: skill.cluster,
    members: skill.members,
    origins: skill.origins,
    primaryOrigin: skill.primaryOrigin,
  }
}

function buildOutcomeNode(outcome: MergedOutcome): OutcomeNode {
  return {
    id: outcome.id,
    kind: 'outcome',
    label: outcomeDisplayLabel(outcome),
    metric: outcome.metric,
    story: outcome.text,
    attributedRoleId: outcome.attributedRoleId,
    origins: outcome.origins,
    primaryOrigin: outcome.primaryOrigin,
  }
}

function outcomeDisplayLabel(outcome: MergedOutcome): string {
  const metric = outcome.metric?.trim()
  if (metric && metric.length > 2 && !/^\d+$/.test(metric)) return metric
  return truncate(outcome.text, 36)
}

function buildArtifactNode(artifact: MergedArtifact): ArtifactNode {
  return {
    id: artifact.id,
    kind: 'artifact',
    label: artifact.label,
    artifactKind: artifact.artifactKind,
    url: artifact.url,
    detail: artifact.detail,
    origins: artifact.origins,
    primaryOrigin: artifact.primaryOrigin,
  }
}

function buildPatternNode(pattern: MergedPattern): PatternNode {
  return {
    id: pattern.id,
    kind: 'pattern',
    label: pattern.label,
    description: pattern.description,
    spannedRoleIds: pattern.spannedRoleIds,
    origins: pattern.origins,
    primaryOrigin: pattern.primaryOrigin,
  }
}

function edgesCoreToRoles(core: CoreNode, roles: RoleNode[]): GraphEdge[] {
  return roles.map((role) => ({
    id: `${core.id}--${role.id}`,
    source: core.id,
    target: role.id,
    kind: 'core-role',
    weight: 1,
  }))
}

function edgesCoreToSkills(core: CoreNode, skills: SkillNode[]): GraphEdge[] {
  return skills.map((skill) => ({
    id: `${core.id}--${skill.id}`,
    source: core.id,
    target: skill.id,
    kind: 'core-skill',
    weight: 1,
  }))
}

function edgesRoleToSkill(
  roles: RoleNode[],
  skillByCluster: ReadonlyMap<SkillCluster, SkillNode>,
): GraphEdge[] {
  const edges: GraphEdge[] = []
  for (const role of roles) {
    const clusters = ROLE_SKILL_MAP[role.id] ?? ['product']
    for (const cluster of clusters) {
      const skill = skillByCluster.get(cluster)
      if (!skill) continue
      edges.push(makeEdge(role.id, skill.id, 'role-skill', 0.7))
    }
  }
  return edges
}

function edgesRoleToOutcome(
  roleIds: ReadonlySet<string>,
  outcomes: OutcomeNode[],
): GraphEdge[] {
  const edges: GraphEdge[] = []
  for (const o of outcomes) {
    const roleId = o.attributedRoleId
    if (!roleId || !roleIds.has(roleId)) continue
    edges.push(makeEdge(roleId, o.id, 'role-outcome', 0.6))
  }
  return edges
}

function edgesSkillToOutcome(
  skillByCluster: ReadonlyMap<SkillCluster, SkillNode>,
  outcomes: OutcomeNode[],
): GraphEdge[] {
  const edges: GraphEdge[] = []
  for (const outcome of outcomes) {
    for (const cluster of inferOutcomeClusters(outcome)) {
      const skill = skillByCluster.get(cluster)
      if (!skill) continue
      edges.push(makeEdge(skill.id, outcome.id, 'skill-outcome', 0.4))
    }
  }
  return edges
}

const CLUSTER_PATTERNS: Record<SkillCluster, RegExp> = {
  'ai-ml': /\b(ai|ml|nlp|llm|pulse|predictive|chatbot|claude|anthropic)\b/i,
  product:
    /\b(product|feature|gtm|roadmap|subscription|discovery|adoption|customer)\b/i,
  'agile-leadership':
    /\b(team|pi|scrum|training|coaching|agile|productivity|sprint|kanban)\b/i,
  engineering:
    /\b(platform|api|automation|infra|cloud|edge|throughput|provisioning)\b/i,
}

function inferOutcomeClusters(outcome: OutcomeNode): SkillCluster[] {
  const text = `${outcome.label} ${outcome.story}`
  const matched = (Object.entries(CLUSTER_PATTERNS) as [SkillCluster, RegExp][])
    .filter(([, re]) => re.test(text))
    .map(([cluster]) => cluster)
  return matched.length > 0 ? matched : ['product']
}

const ARTIFACT_TO_ROLE: Record<string, string> = {
  'artifact-arxiv': 'role-enedis',
  'artifact-edu-school-repo': 'role-independent-ai',
  'artifact-linkedin-thought-leadership': 'role-mcdonalds',
}

function edgesRoleToArtifact(
  roleIds: ReadonlySet<string>,
  artifacts: ArtifactNode[],
): GraphEdge[] {
  const edges: GraphEdge[] = []
  for (const artifact of artifacts) {
    const target = inferArtifactRoleId(artifact, roleIds)
    if (!target) continue
    edges.push(makeEdge(target, artifact.id, 'role-artifact', 0.5))
  }
  return edges
}

function inferArtifactRoleId(
  artifact: ArtifactNode,
  roleIds: ReadonlySet<string>,
): string | undefined {
  const direct = ARTIFACT_TO_ROLE[artifact.id]
  if (direct && roleIds.has(direct)) return direct
  if (
    artifact.artifactKind === 'certification' &&
    roleIds.has('role-mcdonalds')
  )
    return 'role-mcdonalds'
  return undefined
}

function edgesPattern(
  patterns: PatternNode[],
  roleIds: ReadonlySet<string>,
  skillByCluster: ReadonlyMap<SkillCluster, SkillNode>,
): GraphEdge[] {
  const edges: GraphEdge[] = []
  for (const pattern of patterns) {
    for (const roleId of pattern.spannedRoleIds) {
      if (!roleIds.has(roleId)) continue
      edges.push(makeEdge(pattern.id, roleId, 'role-pattern', 0.5))
    }
    for (const cluster of PATTERN_SKILL_MAP[pattern.id] ?? []) {
      const skill = skillByCluster.get(cluster)
      if (!skill) continue
      edges.push(makeEdge(pattern.id, skill.id, 'pattern-skill', 0.5))
    }
  }
  return edges
}

function makeEdge(
  source: string,
  target: string,
  kind: EdgeKind,
  weight: number,
): GraphEdge {
  return { id: `${source}--${target}`, source, target, kind, weight }
}

function truncate(s: string, n: number): string {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`
}
