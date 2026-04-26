import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import YAML from 'yaml'

import type { Curriculum } from '@/app/types'
import { SOURCES, type SourceKind } from './sources'
import type { SourceOrigin } from './types'

export interface RawMarkdownSection {
  heading: string
  level: number
  content: string
  bullets: string[]
}

export interface RawCanonicalSource {
  origin: 'canonical'
  kind: 'yaml-canonical'
  curriculum: Curriculum
}

export interface RawMarkdownSource {
  origin: SourceOrigin
  kind: Exclude<SourceKind, 'yaml-canonical'>
  rawText: string
  sections: RawMarkdownSection[]
}

export type LoadedSource = RawCanonicalSource | RawMarkdownSource

export function loadAllSources(repoRoot: string): LoadedSource[] {
  return SOURCES.map((spec) => {
    const fullPath = join(repoRoot, spec.path)
    const text = readFileSync(fullPath, 'utf-8')

    if (spec.kind === 'yaml-canonical') {
      return {
        origin: 'canonical',
        kind: 'yaml-canonical',
        curriculum: YAML.parse(text) as Curriculum,
      }
    }

    return {
      origin: spec.origin,
      kind: spec.kind,
      rawText: text,
      sections: parseMarkdownSections(text),
    }
  })
}

// Source-docx-md files use **BOLD** as section markers instead of # ATX headings,
// so we accept both forms here rather than running every file through a full markdown AST.
function parseMarkdownSections(text: string): RawMarkdownSection[] {
  const lines = text.split('\n')
  const sections: RawMarkdownSection[] = []
  let current: RawMarkdownSection | null = null

  for (const line of lines) {
    const atxMatch = line.match(/^(#{1,6})\s+(.+?)\s*$/)
    const boldMatch =
      !atxMatch && line.match(/^\*\*([A-Z][A-Z0-9 &/-]+)\*\*\s*$/)

    if (atxMatch) {
      if (current) sections.push(current)
      current = {
        heading: atxMatch[2].trim(),
        level: atxMatch[1].length,
        content: '',
        bullets: [],
      }
      continue
    }
    if (boldMatch) {
      if (current) sections.push(current)
      current = {
        heading: boldMatch[1].trim(),
        level: 2,
        content: '',
        bullets: [],
      }
      continue
    }
    if (!current) continue

    current.content += `${line}\n`
    const bulletMatch = line.match(/^\s*[-*•]\s+(.+)$/)
    if (bulletMatch) {
      current.bullets.push(bulletMatch[1].trim())
    }
  }

  if (current) sections.push(current)
  return sections
}

export function findSection(
  source: RawMarkdownSource,
  predicate: (heading: string) => boolean,
): RawMarkdownSection | undefined {
  return source.sections.find((s) => predicate(s.heading))
}

export function findBullets(
  source: RawMarkdownSource,
  needle: RegExp | string,
): string[] {
  const re = typeof needle === 'string' ? new RegExp(needle, 'i') : needle
  return source.sections.flatMap((s) => s.bullets.filter((b) => re.test(b)))
}
