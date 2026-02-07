import type { ContinuingEducation, Education } from '@/app/types'
import SectionTitle from './SectionTitle'

const EducationSection = ({
  education,
  continuingEducation,
}: {
  education: Education[]
  continuingEducation?: ContinuingEducation[]
}) => {
  return (
    <div>
      <SectionTitle>Education</SectionTitle>
      <div className="space-y-1.5">
        {education.map((edu) => (
          <div key={edu.dates}>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-resume-sm font-bold text-primary">
                {edu.degree}
              </h3>
              <span className="text-resume-xs text-muted">{edu.dates}</span>
            </div>
            <p className="text-resume-xs text-gray-700">{edu.school}</p>
            {edu.focus ? (
              <p className="text-resume-xs text-muted italic">{edu.focus}</p>
            ) : null}
          </div>
        ))}
      </div>

      {continuingEducation && continuingEducation.length > 0 ? (
        <div className="mt-2">
          <h3 className="text-resume-xs font-bold text-secondary uppercase tracking-wide mb-0.5">
            Continuing Education
          </h3>
          {continuingEducation.map((item) => (
            <div
              key={item.name}
              className="text-resume-xs text-gray-700 mb-0.5"
            >
              <span className="font-medium">{item.name}</span>
              {item.provider ? (
                <span className="text-muted"> &ndash; {item.provider}</span>
              ) : null}
              {item.status ? (
                <span className="text-accent font-medium">
                  {' '}
                  ({item.status})
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default EducationSection
