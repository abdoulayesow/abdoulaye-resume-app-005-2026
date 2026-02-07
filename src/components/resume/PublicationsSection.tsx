import type { Publication } from '@/app/types'
import SectionTitle from './SectionTitle'

const PublicationsSection = ({
  publications,
}: {
  publications: Publication[]
}) => {
  if (publications.length === 0) return null

  return (
    <div>
      <SectionTitle>Research & Publications</SectionTitle>
      {publications.map((pub) => (
        <div key={pub.title} className="mb-1">
          <h3 className="text-resume-sm font-bold text-primary">{pub.title}</h3>
          <p className="text-resume-xs text-muted">
            {pub.venue} &middot; {pub.date}
          </p>
          <p className="text-resume-xs text-gray-700">{pub.description}</p>
        </div>
      ))}
    </div>
  )
}

export default PublicationsSection
