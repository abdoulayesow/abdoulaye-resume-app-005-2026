import type { Curriculum } from '@/app/types'
import ObfuscatedText from '@/components/ObfuscatedText'
import EmailIcon from '@/icons/EmailIcon'
import GithubIcon from '@/icons/GithubIcon'
import LinkedinIcon from '@/icons/LinkedinIcon'
import LocationIcon from '@/icons/LocationIcon'
import PhoneIcon from '@/icons/PhoneIcon'
import profileImg from '../../../public/profile.jpg'

const SinglePageResume = ({ data }: { data: Curriculum }) => {
  const yearsOfExperience = Math.floor(
    (Date.now() - new Date(data.experienceStart).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000),
  )

  // Group certifications by category
  const certGroups = data.certifications.reduce<Record<string, number>>(
    (acc, cert) => {
      acc[cert.group] = (acc[cert.group] || 0) + 1
      return acc
    },
    {},
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-primary text-white px-5 py-3 -mx-6 -mt-5">
        <div className="flex items-center gap-4">
          <img
            src={profileImg.src}
            className="w-16 h-16 rounded-full object-cover border-2 border-accent/70 flex-shrink-0"
            alt=""
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-resume-3xl tracking-wide text-white leading-none mb-0.5">
              {data.name}
            </h1>
            <p className="text-resume-sm text-accent font-medium tracking-wide uppercase leading-none">
              {data.headline}
            </p>
            <p className="text-resume-xs text-blue-200/80 mt-0.5">
              {yearsOfExperience}+ years of experience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/15 text-resume-xs text-blue-100/90 flex-wrap">
          <span className="flex items-center gap-1">
            <LocationIcon className="text-accent text-xs" />
            {data.city}
          </span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-1">
            <EmailIcon className="text-accent text-xs" />
            <ObfuscatedText encoded={data.email} />
          </span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-1">
            <PhoneIcon className="text-accent text-xs" />
            <ObfuscatedText encoded={data.phone} />
          </span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-1">
            <LinkedinIcon className="text-accent text-xs" />
            <a
              href={`https://${data.linkedinUrl}`}
              target="_blank"
              className="hover:text-white transition-colors"
            >
              {data.linkedinUrl}
            </a>
          </span>
          {data.githubUrl ? (
            <>
              <span className="text-white/30">|</span>
              <span className="flex items-center gap-1">
                <GithubIcon className="text-accent text-xs" />
                <a
                  href={`https://${data.githubUrl}`}
                  target="_blank"
                  className="hover:text-white transition-colors"
                >
                  {data.githubUrl}
                </a>
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-[200px_1fr_180px] gap-4 mt-3 flex-1">
        {/* LEFT SIDEBAR */}
        <div className="space-y-3">
          {/* Certifications Summary */}
          <div>
            <h2 className="text-resume-sm font-bold uppercase tracking-wider text-primary mb-1.5 pb-0.5 border-b-2 border-accent/30">
              Certifications
            </h2>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                  <span className="text-resume-xl font-bold text-primary">
                    {data.certifications.length}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-resume-xs font-bold text-secondary">
                    Total Certifications
                  </div>
                  <div className="text-resume-xs text-muted leading-tight">
                    SAFe, Scrum, Kanban, Leadership
                  </div>
                </div>
              </div>
              {Object.entries(certGroups).map(([group, count]) => (
                <div
                  key={group}
                  className="flex items-baseline gap-1.5 text-resume-xs"
                >
                  <span className="font-bold text-accent w-5">{count}</span>
                  <span className="text-gray-700 leading-snug">{group}</span>
                </div>
              ))}
            </div>

            {/* Key Certifications */}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="text-resume-xs font-bold text-secondary mb-1">
                Featured
              </div>
              {data.certifications.slice(0, 5).map((cert) => (
                <div
                  key={cert.acronym}
                  className="text-resume-xs mb-0.5 leading-tight"
                >
                  <div className="font-bold text-primary">{cert.acronym}</div>
                  <div className="text-gray-600">{cert.fullName}</div>
                  <div className="text-muted text-[0.55rem]">({cert.year})</div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-resume-sm font-bold uppercase tracking-wider text-primary mb-1.5 pb-0.5 border-b-2 border-accent/30">
              Technical Skills
            </h2>
            {data.technicalSkills.map((group) => (
              <div key={group.category} className="mb-2">
                <h3 className="text-resume-xs font-bold text-secondary mb-0.5">
                  {group.category}
                </h3>
                <p className="text-[0.55rem] text-gray-600 leading-snug">
                  {group.skills.join(' • ')}
                </p>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div>
            <h2 className="text-resume-sm font-bold uppercase tracking-wider text-primary mb-1.5 pb-0.5 border-b-2 border-accent/30">
              Additional
            </h2>
            {data.additionalInfo.map((item) => (
              <div key={item.label} className="mb-1">
                <div className="text-resume-xs font-bold text-secondary">
                  {item.label}
                </div>
                <div className="text-[0.55rem] text-gray-700 leading-tight">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="space-y-2.5">
          {/* Professional Summary */}
          <div>
            <h2 className="text-resume-base font-bold uppercase tracking-wider text-primary mb-1 pb-0.5 border-b-2 border-accent/30">
              Professional Summary
            </h2>
            <p className="text-resume-xs text-gray-700 leading-snug">
              {data.professionalSummary}
            </p>
          </div>

          {/* Core Competencies */}
          <div>
            <h2 className="text-resume-base font-bold uppercase tracking-wider text-primary mb-1 pb-0.5 border-b-2 border-accent/30">
              Core Competencies
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {data.coreCompetencies.map((group) => (
                <div key={group.category}>
                  <h3 className="text-resume-xs font-bold text-secondary">
                    {group.category}
                  </h3>
                  <p className="text-[0.55rem] text-gray-600 leading-snug">
                    {group.skills.join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience - Condensed */}
          <div>
            <h2 className="text-resume-base font-bold uppercase tracking-wider text-primary mb-1 pb-0.5 border-b-2 border-accent/30">
              Professional Experience
            </h2>
            <div className="space-y-2">
              {data.projects.map((project) => {
                // Extract key bullet points from description
                const bullets = project.description
                  .split('\n')
                  .filter(
                    (line) =>
                      line.trim().startsWith('-') ||
                      line.includes('**') ||
                      line.match(/\d+%/),
                  )
                  .slice(0, 4) // Max 4 bullets per job
                  .map((line) =>
                    line
                      .replace(/^[-*]\s*/, '')
                      .replace(/\*\*/g, '')
                      .trim(),
                  )
                  .filter((line) => line.length > 0)

                return (
                  <div
                    key={project.dates}
                    className="relative pl-2.5 border-l-2 border-accent/30"
                  >
                    <div className="absolute -left-[4px] top-0.5 w-1.5 h-1.5 rounded-full bg-accent" />

                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <h3 className="text-resume-sm font-bold text-primary leading-tight">
                        {project.title}
                      </h3>
                      <span className="text-[0.55rem] text-muted whitespace-nowrap">
                        {project.dates}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-0.5">
                      <span className="text-resume-xs font-semibold text-secondary">
                        {project.company}
                      </span>
                      {project.client ? (
                        <>
                          <span className="text-[0.5rem] text-muted">→</span>
                          <span className="text-resume-xs font-medium text-gray-700">
                            {project.client}
                          </span>
                        </>
                      ) : null}
                    </div>

                    <ul className="space-y-0.5">
                      {bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="text-[0.55rem] text-gray-700 leading-tight pl-2 relative before:content-['▸'] before:absolute before:left-0 before:text-accent"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-3">
          {/* Key Achievements */}
          <div>
            <h2 className="text-resume-sm font-bold uppercase tracking-wider text-primary mb-1.5 pb-0.5 border-b-2 border-accent/30">
              Key Metrics
            </h2>
            <div className="space-y-1.5">
              {data.achievements.slice(0, 6).map((item) => (
                <div key={item.text} className="text-center">
                  <div className="text-resume-xl font-bold text-accent leading-none">
                    {item.metric}
                  </div>
                  <div className="text-[0.55rem] text-gray-700 leading-tight mt-0.5">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-resume-sm font-bold uppercase tracking-wider text-primary mb-1.5 pb-0.5 border-b-2 border-accent/30">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.dates} className="mb-2">
                <div className="text-resume-xs font-bold text-primary leading-tight">
                  {edu.degree}
                </div>
                <div className="text-[0.55rem] text-gray-700">{edu.school}</div>
                <div className="text-[0.55rem] text-muted">{edu.dates}</div>
                {edu.focus ? (
                  <div className="text-[0.55rem] text-gray-600 italic mt-0.5 leading-tight">
                    {edu.focus}
                  </div>
                ) : null}
              </div>
            ))}

            {data.continuingEducation && data.continuingEducation.length > 0 ? (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-resume-xs font-bold text-secondary mb-1">
                  Continuing Education
                </div>
                {data.continuingEducation.map((item) => (
                  <div
                    key={item.name}
                    className="text-[0.55rem] text-gray-700 mb-0.5 leading-tight"
                  >
                    <span className="font-medium">{item.name}</span>
                    {item.provider ? (
                      <span className="text-muted"> – {item.provider}</span>
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

          {/* Training & Speaking */}
          {data.trainingSpeaking && data.trainingSpeaking.length > 0 ? (
            <div>
              <h2 className="text-resume-sm font-bold uppercase tracking-wider text-primary mb-1.5 pb-0.5 border-b-2 border-accent/30">
                Training & Speaking
              </h2>
              {data.trainingSpeaking.map((item) => (
                <div key={item.title} className="mb-2">
                  <div className="text-resume-xs font-bold text-primary leading-tight">
                    {item.title}
                  </div>
                  {item.description ? (
                    <div className="text-[0.55rem] text-muted mb-0.5">
                      {item.description}
                    </div>
                  ) : null}
                  {item.details?.map((detail, idx) => (
                    <div
                      key={idx}
                      className="text-[0.55rem] text-gray-700 leading-tight mb-0.5"
                    >
                      • {detail}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default SinglePageResume
