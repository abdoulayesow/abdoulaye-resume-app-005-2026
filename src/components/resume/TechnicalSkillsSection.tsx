import type { TechnicalSkillCategory } from '@/app/types'
import SectionTitle from './SectionTitle'

const TechnicalSkillsSection = ({
  skills,
}: {
  skills: TechnicalSkillCategory[]
}) => {
  return (
    <div>
      <SectionTitle>Technical Skills</SectionTitle>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="text-resume-xs font-bold text-secondary">
              {group.category}
            </h3>
            <p className="text-resume-xs text-gray-600">
              {group.skills.join(' \u2022 ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TechnicalSkillsSection
