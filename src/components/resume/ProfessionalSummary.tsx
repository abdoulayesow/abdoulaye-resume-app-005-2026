import SectionTitle from './SectionTitle'

const ProfessionalSummary = ({ summary }: { summary: string }) => {
  return (
    <div>
      <SectionTitle>Professional Summary</SectionTitle>
      <p className="text-resume-base text-gray-700 leading-snug">
        {summary}
      </p>
    </div>
  )
}

export default ProfessionalSummary
