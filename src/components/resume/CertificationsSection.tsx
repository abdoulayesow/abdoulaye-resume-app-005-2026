import type { Certification } from '@/app/types'
import SectionTitle from './SectionTitle'

const CertificationsSection = ({
  certifications,
}: {
  certifications: Certification[]
}) => {
  const groups = certifications.reduce<Record<string, Certification[]>>(
    (acc, cert) => {
      if (!acc[cert.group]) acc[cert.group] = []
      acc[cert.group].push(cert)
      return acc
    },
    {},
  )

  return (
    <div>
      <SectionTitle>Certifications</SectionTitle>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        {Object.entries(groups).map(([group, certs]) => (
          <div key={group}>
            <h3 className="text-resume-xs font-bold text-secondary uppercase tracking-wide mb-0.5">
              {group}
            </h3>
            {certs.map((cert) => (
              <div
                key={cert.acronym}
                className="flex items-baseline gap-1.5 text-resume-xs mb-0.5"
              >
                <span className="font-bold text-primary">{cert.acronym}</span>
                <span className="text-gray-500">&ndash;</span>
                <span className="text-gray-600">{cert.fullName}</span>
                <span className="text-muted">({cert.year})</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CertificationsSection
