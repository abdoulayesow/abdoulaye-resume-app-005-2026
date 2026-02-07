import type { TechnicalSkillCategory } from '@/app/types'
import SectionTitle from './SectionTitle'

const CoreCompetencies = ({
  competencies,
}: {
  competencies: TechnicalSkillCategory[]
}) => {
  return (
    <div>
      <SectionTitle>Core Competencies</SectionTitle>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {competencies.map((group) => (
          <div key={group.category}>
            <h3 className="text-resume-sm font-bold text-secondary mb-0.5">
              {group.category}
            </h3>
            <p className="text-resume-xs text-gray-600 leading-snug">
              {group.skills.join(' \u2022 ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CoreCompetencies
