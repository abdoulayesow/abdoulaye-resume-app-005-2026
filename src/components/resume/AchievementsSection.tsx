import type { Achievement } from '@/app/types'
import SectionTitle from './SectionTitle'

const AchievementsSection = ({
  achievements,
}: {
  achievements: Achievement[]
}) => {
  return (
    <div>
      <SectionTitle>Key Achievements</SectionTitle>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {achievements.map((item) => (
          <div
            key={item.text}
            className="flex items-start gap-2 text-resume-xs"
          >
            {item.metric ? (
              <span className="font-bold text-accent min-w-[3em] text-right flex-shrink-0">
                {item.metric}
              </span>
            ) : null}
            <span className="text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AchievementsSection
