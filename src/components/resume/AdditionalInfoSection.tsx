import type { AdditionalInfo } from '@/app/types'
import SectionTitle from './SectionTitle'

const AdditionalInfoSection = ({ items }: { items: AdditionalInfo[] }) => {
  return (
    <div>
      <SectionTitle>Additional Information</SectionTitle>
      <div className="flex flex-wrap gap-x-5 gap-y-0.5 text-resume-xs">
        {items.map((item) => (
          <span key={item.label}>
            <span className="font-bold text-primary">{item.label}:</span>{' '}
            <span className="text-gray-700">{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default AdditionalInfoSection
