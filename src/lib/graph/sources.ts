import type { SourceOrigin } from './types'

export type SourceKind =
  | 'yaml-canonical'
  | 'tailored-resume'
  | 'docx-md'
  | 'cover-letter'

export interface SourceSpec {
  origin: SourceOrigin
  kind: SourceKind
  path: string
  priority: number
  label: string
}

export const SOURCES: SourceSpec[] = [
  {
    origin: 'canonical',
    kind: 'yaml-canonical',
    path: 'src/data/cv-product-manager-ai-ml.yml',
    priority: 0,
    label: 'Canonical resume (AI/ML PM)',
  },
  {
    origin: 'tailored-hpe',
    kind: 'tailored-resume',
    path: 'tailored-resumes/hpe__senior-pm-greenlake-flex__2026-04-22/resume.md',
    priority: 1,
    label: 'HPE GL Flex tailored resume',
  },
  {
    origin: 'tailored-deloitte',
    kind: 'tailored-resume',
    path: 'tailored-resumes/deloitte__engineering-managed-services-senior-manager__2026-04-22/resume.md',
    priority: 2,
    label: 'Deloitte Sr Manager tailored resume',
  },
  {
    origin: 'tailored-collabera',
    kind: 'tailored-resume',
    path: 'tailored-resumes/collabera__agile-coach-spc-oilgas-woodlands__2026-04-23/resume.md',
    priority: 3,
    label: 'Collabera Agile Coach tailored resume',
  },
  {
    origin: 'cover-letter-hpe',
    kind: 'cover-letter',
    path: 'cover-letters/hpe__senior-pm-greenlake-flex__2026-04-22.md',
    priority: 4,
    label: 'HPE cover letter',
  },
  {
    origin: 'cover-letter-deloitte',
    kind: 'cover-letter',
    path: 'cover-letters/deloitte__engineering-managed-services-senior-manager__2026-04-22.md',
    priority: 5,
    label: 'Deloitte cover letter',
  },
  {
    origin: 'cover-letter-collabera',
    kind: 'cover-letter',
    path: 'cover-letters/collabera__agile-coach-spc-oilgas-woodlands__2026-04-23.md',
    priority: 6,
    label: 'Collabera cover letter',
  },
  {
    origin: 'docx-v2-delivery',
    kind: 'docx-md',
    path: 'resume-data/source-docx-md/V2_AI_Enabled_Delivery_Leader_Abdoulaye_Sow.md',
    priority: 7,
    label: 'V2 AI-Enabled Delivery Leader (current-role detail)',
  },
  {
    origin: 'docx-resume-c',
    kind: 'docx-md',
    path: 'resume-data/source-docx-md/Resume_C_AI_Enabled_Agile_Leader_Abdoulaye_Sow.md',
    priority: 8,
    label: 'Resume C: Friasoft + independent AI projects',
  },
  {
    origin: 'docx-resume-a',
    kind: 'docx-md',
    path: 'resume-data/source-docx-md/Resume_A_Technical_Product_Manager_Abdoulaye_Sow.md',
    priority: 9,
    label: 'Resume A: Friasoft Technical PM origin',
  },
]
