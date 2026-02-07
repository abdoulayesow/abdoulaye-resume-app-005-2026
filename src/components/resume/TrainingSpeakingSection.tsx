import type { TrainingSpeaking } from '@/app/types'
import SectionTitle from './SectionTitle'

const TrainingSpeakingSection = ({ items }: { items: TrainingSpeaking[] }) => {
  if (items.length === 0) return null

  return (
    <div>
      <SectionTitle>Training & Speaking</SectionTitle>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.title}>
            <div className="flex items-baseline gap-2">
              <h3 className="text-resume-sm font-bold text-primary">
                {item.title}
              </h3>
              {item.description ? (
                <span className="text-resume-xs text-muted">
                  {item.description}
                </span>
              ) : null}
            </div>
            <ul className="text-resume-xs text-gray-700 list-none pl-0 mt-0.5">
              {item.details.map((detail) => (
                <li key={detail} className="flex items-start gap-1.5 mb-0.5">
                  <span className="text-accent mt-0.5 flex-shrink-0">
                    &bull;
                  </span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrainingSpeakingSection
