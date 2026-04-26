import type { Achievement, Curriculum } from '@/app/types'
import {
  findBullets,
  type LoadedSource,
  type RawMarkdownSource,
} from './loadSources'
import type { ArtifactKind, SkillCluster, SourceOrigin } from './types'

export interface MergedRole {
  id: string
  title: string
  company: string
  client?: string
  location?: string
  dates: string
  duration: string
  bullets: string[]
  origins: SourceOrigin[]
  primaryOrigin: SourceOrigin
  isGapMaterial: boolean
}

export interface MergedSkillCluster {
  id: string
  cluster: SkillCluster
  label: string
  members: string[]
  origins: SourceOrigin[]
  primaryOrigin: SourceOrigin
}

export interface MergedOutcome {
  id: string
  text: string
  metric?: string
  attributedRoleId?: string
  origins: SourceOrigin[]
  primaryOrigin: SourceOrigin
}

export interface MergedArtifact {
  id: string
  label: string
  artifactKind: ArtifactKind
  url?: string
  detail?: string
  attributedRoleId?: string
  origins: SourceOrigin[]
  primaryOrigin: SourceOrigin
}

export interface MergedPattern {
  id: string
  label: string
  description: string
  spannedRoleIds: string[]
  origins: SourceOrigin[]
  primaryOrigin: SourceOrigin
}

export interface MergedCurriculum {
  core: { name: string; headline: string; tagline: string; location: string }
  roles: MergedRole[]
  skills: MergedSkillCluster[]
  outcomes: MergedOutcome[]
  artifacts: MergedArtifact[]
  patterns: MergedPattern[]
}

export function mergeSources(sources: LoadedSource[]): MergedCurriculum {
  const canonical = getCanonical(sources)
  const merged = buildBaseline(canonical)
  augmentWithFriasoft(merged, sources)
  augmentWithIndependentAIDev(merged, sources)
  augmentWithEdgePlatform(merged, sources)
  augmentWithPulseSaaS(merged, sources)
  augmentWithProductivityDoubling(merged, sources)
  augmentWithAIAgentsPattern(merged, sources)
  augmentWithEduSchoolRepo(merged, sources)
  augmentWithThoughtLeadership(merged, sources)
  augmentWithCoverLetterScale(merged, sources)
  return merged
}

function getCanonical(sources: LoadedSource[]): Curriculum {
  const found = sources.find(
    (s): s is Extract<LoadedSource, { kind: 'yaml-canonical' }> =>
      s.kind === 'yaml-canonical',
  )
  if (!found) {
    throw new Error(
      'Canonical YAML source missing — check src/data/cv-product-manager-ai-ml.yml',
    )
  }
  return found.curriculum
}

function getSource(
  sources: LoadedSource[],
  origin: SourceOrigin,
): RawMarkdownSource | undefined {
  return sources.find(
    (s): s is RawMarkdownSource =>
      s.origin === origin && s.kind !== 'yaml-canonical',
  )
}

function buildBaseline(canonical: Curriculum): MergedCurriculum {
  return {
    core: {
      name: canonical.name,
      headline: canonical.headline,
      tagline: 'Principal PM / AI-ML · 14 years · Houston / Remote',
      location: canonical.city,
    },
    roles: canonical.projects.map((project) => ({
      id: roleIdFor(project.client ?? project.company),
      title: project.title,
      company: project.company,
      client: project.client,
      location: project.location,
      dates: project.dates,
      duration: project.duration,
      bullets: extractBullets(project.description),
      origins: ['canonical'],
      primaryOrigin: 'canonical',
      isGapMaterial: false,
    })),
    skills: buildSkillClusters(canonical),
    outcomes: canonical.achievements.map(achievementToOutcome),
    artifacts: buildBaselineArtifacts(canonical),
    patterns: [],
  }
}

const ROLE_ID_ALIASES: Array<{ test: (slug: string) => boolean; id: string }> =
  [
    { test: (s) => s.includes('mcdonald'), id: 'role-mcdonalds' },
    {
      test: (s) => s.includes('societe-generale') || s === 'sg',
      id: 'role-sg',
    },
    { test: (s) => s.includes('credit-agricole'), id: 'role-credit-agricole' },
    { test: (s) => s.includes('enedis'), id: 'role-enedis' },
  ]

function roleIdFor(name: string): string {
  const slug = slugify(name)
  for (const alias of ROLE_ID_ALIASES) {
    if (alias.test(slug)) return alias.id
  }
  return `role-${slug}`
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractBullets(description: string): string[] {
  return description
    .split('\n')
    .map((line) => line.match(/^\s*-\s+(.+)$/)?.[1].trim())
    .filter((b): b is string => Boolean(b))
}

function buildSkillClusters(c: Curriculum): MergedSkillCluster[] {
  const find = (label: string) => {
    const fromCore =
      c.coreCompetencies.find((cc) => cc.category === label)?.skills ?? []
    const fromTech =
      c.technicalSkills.find((cc) => cc.category === label)?.skills ?? []
    return Array.from(new Set([...fromCore, ...fromTech]))
  }
  const aiml = [...find('AI/ML Expertise'), ...find('AI/ML Stack')]
  const product = [
    ...find('Product Strategy & Leadership'),
    ...find('Product Management Tools'),
    ...find('Data & Analytics'),
  ]
  const agile = find('Technical & Agile')
  const engineering = [...find('Software Development'), ...find('Technical')]
  return [
    cluster('skill-ai-ml', 'ai-ml', 'AI / ML', dedupe(aiml)),
    cluster('skill-product', 'product', 'Product Leadership', dedupe(product)),
    cluster(
      'skill-agile-leadership',
      'agile-leadership',
      'Agile & Leadership',
      dedupe(agile),
    ),
    cluster(
      'skill-engineering',
      'engineering',
      'Engineering Foundations',
      dedupe(engineering),
    ),
  ]
}

function cluster(
  id: string,
  cluster: SkillCluster,
  label: string,
  members: string[],
): MergedSkillCluster {
  return {
    id,
    cluster,
    label,
    members,
    origins: ['canonical'],
    primaryOrigin: 'canonical',
  }
}

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

function isSourceOrigin(o: SourceOrigin | undefined): o is SourceOrigin {
  return Boolean(o)
}

function achievementToOutcome(a: Achievement, idx: number): MergedOutcome {
  const id = `outcome-canonical-${idx}`
  const attributedRoleId = guessRoleAttribution(a.text)
  return {
    id,
    text: a.text,
    metric: a.metric,
    attributedRoleId,
    origins: ['canonical'],
    primaryOrigin: 'canonical',
  }
}

function guessRoleAttribution(text: string): string | undefined {
  const t = text.toLowerCase()
  if (t.includes('sprint') || t.includes('92%')) return 'role-credit-agricole'
  if (t.includes('mcdonald') || t.includes('45%') || t.includes('30%'))
    return 'role-mcdonalds'
  if (t.includes('research') || t.includes('publication')) return 'role-enedis'
  return undefined
}

function buildBaselineArtifacts(c: Curriculum): MergedArtifact[] {
  const artifacts: MergedArtifact[] = []
  for (const pub of c.publications ?? []) {
    artifacts.push({
      id: 'artifact-arxiv',
      label: pub.venue,
      artifactKind: 'publication',
      url: 'https://arxiv.org/abs/2310.15612',
      detail: pub.title,
      origins: ['canonical'],
      primaryOrigin: 'canonical',
    })
  }
  const featuredCerts = ['SAFe SPC6', 'PSPO II', 'PAL-EBM']
  for (const cert of c.certifications) {
    if (!featuredCerts.includes(cert.acronym)) continue
    artifacts.push({
      id: `artifact-cert-${slugify(cert.acronym)}`,
      label: cert.acronym,
      artifactKind: 'certification',
      detail: `${cert.fullName} (${cert.year})`,
      origins: ['canonical'],
      primaryOrigin: 'canonical',
    })
  }
  return artifacts
}

// ─── augmentations ──────────────────────────────────────────────────────────

function augmentWithFriasoft(
  merged: MergedCurriculum,
  sources: LoadedSource[],
): void {
  const resumeC = getSource(sources, 'docx-resume-c')
  const resumeA = getSource(sources, 'docx-resume-a')
  const sourceA = resumeC ?? resumeA
  if (!sourceA) return
  const bullets = findBullets(sourceA, /Friasoft|Friallel|West African/i)
  if (bullets.length === 0) return
  merged.roles.push({
    id: 'role-friasoft',
    title: 'Co-Founder & AI Product Lead',
    company: 'Friasoft',
    location: 'Houston, TX',
    dates: '2019 – 2020',
    duration: '~1 year',
    bullets,
    origins: dedupe([resumeC?.origin, resumeA?.origin].filter(isSourceOrigin)),
    primaryOrigin: resumeC ? resumeC.origin : 'docx-resume-a',
    isGapMaterial: true,
  })
}

function augmentWithIndependentAIDev(
  merged: MergedCurriculum,
  sources: LoadedSource[],
): void {
  const resumeC = getSource(sources, 'docx-resume-c')
  if (!resumeC) return
  const bullets = findBullets(
    resumeC,
    /independent ai|edu-school|ollama|claude ai|prompt engineering/i,
  )
  if (bullets.length === 0) return
  merged.roles.push({
    id: 'role-independent-ai',
    title: 'Independent AI Development & Research',
    company: 'Self-Directed',
    location: 'Houston, TX',
    dates: '2024 – Present',
    duration: '~1.5 years',
    bullets,
    origins: [resumeC.origin],
    primaryOrigin: resumeC.origin,
    isGapMaterial: true,
  })
}

function augmentWithEdgePlatform(
  merged: MergedCurriculum,
  sources: LoadedSource[],
): void {
  const hpe = getSource(sources, 'tailored-hpe')
  const v2 = getSource(sources, 'docx-v2-delivery')
  const origins: SourceOrigin[] = []
  if (hpe) origins.push(hpe.origin)
  if (v2) origins.push(v2.origin)
  if (origins.length === 0) return
  merged.outcomes.push({
    id: 'outcome-edge-platform',
    text: "30-min new-lab provisioning, 70% manual testing reduction, 500% automated data throughput across McDonald's 5 global Edge labs",
    metric: '70% / 500% / 30 min',
    attributedRoleId: 'role-mcdonalds',
    origins,
    primaryOrigin: hpe ? hpe.origin : 'docx-v2-delivery',
  })
}

function augmentWithPulseSaaS(
  merged: MergedCurriculum,
  sources: LoadedSource[],
): void {
  const hpe = getSource(sources, 'tailored-hpe')
  const letter = getSource(sources, 'cover-letter-hpe')
  const origins: SourceOrigin[] = []
  if (hpe) origins.push(hpe.origin)
  if (letter) origins.push(letter.origin)
  if (origins.length === 0) return
  merged.outcomes.push({
    id: 'outcome-pulse-saas',
    text: 'Built and sold Pulse — Claude-powered SaaS — owning subscription pricing, GTM, and end-to-end customer journey',
    metric: 'Built · Sold · Subscription',
    attributedRoleId: 'role-mcdonalds',
    origins,
    primaryOrigin: hpe ? hpe.origin : 'cover-letter-hpe',
  })
}

function augmentWithProductivityDoubling(
  merged: MergedCurriculum,
  sources: LoadedSource[],
): void {
  const v2 = getSource(sources, 'docx-v2-delivery')
  const collabera = getSource(sources, 'tailored-collabera')
  const letter = getSource(sources, 'cover-letter-collabera')
  const origins = [v2?.origin, collabera?.origin, letter?.origin].filter(
    isSourceOrigin,
  )
  if (origins.length === 0) return
  merged.outcomes.push({
    id: 'outcome-productivity-doubling',
    text: '100% team productivity improvement across 3 Scrum teams in 6 months via Solution-Focused methods + Kanban transition',
    metric: '100% × 3 teams · 6 months',
    attributedRoleId: 'role-mcdonalds',
    origins: dedupe(origins),
    primaryOrigin: origins[0],
  })
}

function augmentWithAIAgentsPattern(
  merged: MergedCurriculum,
  sources: LoadedSource[],
): void {
  const origins = [
    getSource(sources, 'tailored-hpe')?.origin,
    getSource(sources, 'tailored-deloitte')?.origin,
    getSource(sources, 'docx-v2-delivery')?.origin,
  ].filter(isSourceOrigin)
  if (origins.length === 0) return
  merged.patterns.push({
    id: 'pattern-ai-agents',
    label: '5 Production AI Agents',
    description:
      'GitHub Copilot Skills + Atlassian MCP / Rovo Dev integration: story automation, risk alerts, executive reporting, AI-augmented delivery tooling shipped across multiple roles.',
    spannedRoleIds: ['role-mcdonalds', 'role-independent-ai'],
    origins: dedupe(origins),
    primaryOrigin: origins[0],
  })
}

function augmentWithEduSchoolRepo(
  merged: MergedCurriculum,
  sources: LoadedSource[],
): void {
  const resumeC = getSource(sources, 'docx-resume-c')
  if (!resumeC) return
  if (!findBullets(resumeC, /edu-school/i).length) return
  merged.artifacts.push({
    id: 'artifact-edu-school-repo',
    label: 'edu-school-system-repository',
    artifactKind: 'github-repo',
    url: 'https://github.com/abdoulayesow',
    detail:
      'Offline-first school management system with AI integration for African schools — built independently with Claude AI, Anthropic APIs, Ollama.',
    attributedRoleId: 'role-independent-ai',
    origins: [resumeC.origin],
    primaryOrigin: resumeC.origin,
  })
}

function augmentWithThoughtLeadership(
  merged: MergedCurriculum,
  sources: LoadedSource[],
): void {
  const resumeC = getSource(sources, 'docx-resume-c')
  if (!resumeC) return
  const bullets = findBullets(
    resumeC,
    /linkedin|tools don't make you agile|viral/i,
  )
  if (bullets.length === 0) return
  merged.artifacts.push({
    id: 'artifact-linkedin-thought-leadership',
    label: '"Tools Don\'t Make You Agile"',
    artifactKind: 'thought-leadership',
    detail:
      'Viral LinkedIn article on agile mindset vs. tooling — drove inbound community engagement.',
    origins: [resumeC.origin],
    primaryOrigin: resumeC.origin,
  })
}

function augmentWithCoverLetterScale(
  merged: MergedCurriculum,
  sources: LoadedSource[],
): void {
  const letter = getSource(sources, 'cover-letter-collabera')
  if (!letter) return
  if (!/35M|35 million/i.test(letter.rawText)) return
  merged.outcomes.push({
    id: 'outcome-enedis-scale',
    text: 'Delivered AI-powered predictive maintenance for ENEDIS national grid serving 35M customers',
    metric: '35M customers',
    attributedRoleId: 'role-enedis',
    origins: [letter.origin],
    primaryOrigin: letter.origin,
  })
  if (/\$15M|15M banking/i.test(letter.rawText)) {
    merged.outcomes.push({
      id: 'outcome-sg-modernization',
      text: '$15M banking platform modernization at Société Générale — AI-powered fraud detection, NLP chatbot, predictive credit scoring',
      metric: '$15M',
      attributedRoleId: 'role-sg',
      origins: [letter.origin],
      primaryOrigin: letter.origin,
    })
  }
}
