import type { Project } from '@/app/types'
import Markdown from '@/components/Markdown'

const ExperienceItem = ({ project }: { project: Project }) => {
  return (
    <div className="relative pl-3 border-l-2 border-accent/30">
      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-accent" />

      <div className="flex items-baseline justify-between gap-2 mb-0.5">
        <h3 className="text-resume-base font-bold text-primary">
          {project.title}
        </h3>
        <span className="text-resume-xs text-muted whitespace-nowrap flex-shrink-0">
          {project.dates}
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-resume-sm font-semibold text-secondary">
          {project.company}
        </span>
        {project.client ? (
          <>
            <span className="text-resume-xs text-muted">&rarr;</span>
            <span className="text-resume-sm font-medium text-gray-700">
              {project.client}
            </span>
          </>
        ) : null}
        {project.location ? (
          <span className="text-resume-xs text-muted ml-auto flex-shrink-0">
            {project.location}
          </span>
        ) : null}
      </div>

      <div className="text-resume-xs text-gray-700 [&_ul]:mt-0.5 [&_li]:mb-0">
        <Markdown>{project.description}</Markdown>
      </div>
    </div>
  )
}

export default ExperienceItem
