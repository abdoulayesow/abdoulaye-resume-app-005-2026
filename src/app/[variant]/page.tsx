import fs from 'node:fs'

import YAML from 'yaml'

import type { Curriculum } from '@/app/types'
import { A4Page } from '@/components/resume'
import SinglePageResume from '@/components/resume/SinglePageResume'

const VALID_VARIANTS = ['agile-coach', 'product-manager-ai-ml']

export function generateStaticParams() {
  return VALID_VARIANTS.map((variant) => ({ variant }))
}

const getCurriculum = (variant: string): Curriculum => {
  const filePath = `${process.cwd()}/src/data/cv-${variant}.yml`
  return YAML.parse(fs.readFileSync(filePath).toString())
}

export default async function ResumePage({
  params,
}: {
  params: Promise<{ variant: string }>
}) {
  const { variant } = await params
  const data = getCurriculum(variant)

  return (
    <A4Page className="px-6 py-5">
      <SinglePageResume data={data} />
    </A4Page>
  )
}
