import fs from 'node:fs'

import YAML from 'yaml'

import type { Curriculum } from '@/app/types'
import {
  A4Page,
  AchievementsSection,
  AdditionalInfoSection,
  CertificationsSection,
  CoreCompetencies,
  EducationSection,
  ExperienceItem,
  Header,
  ProfessionalSummary,
  PublicationsSection,
  SectionTitle,
  TechnicalSkillsSection,
  TrainingSpeakingSection,
} from '@/components/resume'

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

  const firstPageProjects = data.projects.slice(
    0,
    data.pageBreakAfterProjectIndex + 1,
  )
  const secondPageProjects = data.projects.slice(
    data.pageBreakAfterProjectIndex + 1,
  )

  return (
    <>
      {/* Page 1 */}
      <A4Page className="px-8 pt-6 pb-4 flex flex-col">
        <Header data={data} />

        <div className="flex flex-col gap-2 mt-3 flex-1">
          <ProfessionalSummary summary={data.professionalSummary} />

          <CoreCompetencies competencies={data.coreCompetencies} />

          <div>
            <SectionTitle>Professional Experience</SectionTitle>
            <div className="flex flex-col gap-2">
              {firstPageProjects.map((project) => (
                <ExperienceItem key={project.dates} project={project} />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center text-resume-xs text-muted/50 mt-auto pt-2">
          Page 1 of 2
        </div>
      </A4Page>

      {/* Page 2 */}
      <A4Page className="px-8 pt-6 pb-4 flex flex-col">
        {secondPageProjects.length > 0 ? (
          <div>
            <SectionTitle>Professional Experience (continued)</SectionTitle>
            <div className="flex flex-col gap-2">
              {secondPageProjects.map((project) => (
                <ExperienceItem key={project.dates} project={project} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 mt-2.5">
          <CertificationsSection certifications={data.certifications} />

          <AchievementsSection achievements={data.achievements} />

          <EducationSection
            education={data.education}
            continuingEducation={data.continuingEducation}
          />

          {data.publications && data.publications.length > 0 ? (
            <PublicationsSection publications={data.publications} />
          ) : null}

          {data.trainingSpeaking && data.trainingSpeaking.length > 0 ? (
            <TrainingSpeakingSection items={data.trainingSpeaking} />
          ) : null}

          <TechnicalSkillsSection skills={data.technicalSkills} />

          <AdditionalInfoSection items={data.additionalInfo} />
        </div>

        <div className="text-center text-resume-xs text-muted/50 mt-auto pt-2">
          Page 2 of 2
        </div>
      </A4Page>
    </>
  )
}
