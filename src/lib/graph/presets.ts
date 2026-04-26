import type { GraphNode } from './types'

export const PRESET_IDS = [
  'all',
  'technical',
  'leadership',
  'outcomes',
] as const
export type PresetId = (typeof PRESET_IDS)[number]

export interface Preset {
  id: PresetId
  label: string
  hint: string
  matches: (node: GraphNode) => boolean
}

export const PRESETS: Preset[] = [
  {
    id: 'all',
    label: 'All',
    hint: 'Free exploration of every node',
    matches: () => true,
  },
  {
    id: 'technical',
    label: 'Technical',
    hint: 'AI/ML depth, engineering, published artifacts',
    matches: (n) => {
      if (n.kind === 'core') return true
      if (n.kind === 'skill')
        return n.cluster === 'ai-ml' || n.cluster === 'engineering'
      if (n.kind === 'artifact') return true
      if (n.kind === 'pattern') return true
      if (n.kind === 'outcome') {
        return /\b(AI|ML|NLP|LLM|Pulse|Edge|API|platform|automation|throughput|provisioning)\b/i.test(
          n.story,
        )
      }
      if (n.kind === 'role') {
        return [
          'role-mcdonalds',
          'role-friasoft',
          'role-independent-ai',
          'role-enedis',
        ].includes(n.id)
      }
      return false
    },
  },
  {
    id: 'leadership',
    label: 'Leadership',
    hint: 'Coaching, training, organizational transformation',
    matches: (n) => {
      if (n.kind === 'core') return true
      if (n.kind === 'skill')
        return n.cluster === 'agile-leadership' || n.cluster === 'product'
      if (n.kind === 'role') return true
      if (n.kind === 'pattern') return true
      if (n.kind === 'outcome') {
        return /\b(team|training|coaching|productivity|sprint|stakeholder|trained|managed|led)\b/i.test(
          n.story,
        )
      }
      if (n.kind === 'artifact') {
        return (
          n.artifactKind === 'certification' ||
          n.artifactKind === 'thought-leadership'
        )
      }
      return false
    },
  },
  {
    id: 'outcomes',
    label: 'Outcomes',
    hint: 'Metrics, business value, shipped impact',
    matches: (n) => {
      if (n.kind === 'core') return true
      if (n.kind === 'outcome') return true
      if (n.kind === 'role') return true
      if (n.kind === 'artifact') return true
      return false
    },
  },
]

export function getPreset(id: PresetId): Preset {
  const p = PRESETS.find((x) => x.id === id)
  if (!p) throw new Error(`Unknown preset: ${id}`)
  return p
}
