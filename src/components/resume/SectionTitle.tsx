import { twJoin } from 'tailwind-merge'

const SectionTitle = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={twJoin('flex items-center gap-2 mb-2', className)}>
      <h2 className="text-resume-lg font-bold uppercase tracking-[0.15em] text-primary whitespace-nowrap">
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-accent/60 to-transparent" />
    </div>
  )
}

export default SectionTitle
