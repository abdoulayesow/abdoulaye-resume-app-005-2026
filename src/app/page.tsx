import Link from 'next/link'

import profileImg from '../../public/profile.jpg'

const variants = [
  {
    slug: 'agile-coach',
    title: 'Agile Coach',
    subtitle: 'Transformation Leader & SAFe SPC6 Trainer',
    description:
      'Enterprise agile transformation, ART launches, team coaching, and SAFe training expertise.',
  },
  {
    slug: 'product-manager-ai-ml',
    title: 'Product Manager AI/ML',
    subtitle: 'Published ML Researcher & SaaS Leader',
    description:
      'AI/ML product strategy, Evidence-Based Management, and cross-functional team leadership.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center mb-10">
        <img
          src={profileImg.src}
          className="w-24 h-24 rounded-full object-cover border-3 border-accent/50 mx-auto mb-4 shadow-lg"
          alt=""
        />
        <h1 className="font-serif text-4xl text-primary tracking-wide mb-2">
          Abdoulaye Sow
        </h1>
        <p className="text-muted text-sm max-w-md mx-auto">
          Select a resume variant to view
        </p>
        <div className="w-16 h-0.5 bg-accent/60 mx-auto mt-3" />
      </div>

      <div className="flex gap-6 max-w-2xl w-full">
        {variants.map((v) => (
          <Link
            key={v.slug}
            href={`/${v.slug}`}
            className="flex-1 group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-accent/30"
          >
            <div className="w-8 h-0.5 bg-accent/60 mb-3 group-hover:w-12 transition-all duration-300" />
            <h2 className="font-serif text-xl text-primary mb-1 group-hover:text-secondary transition-colors">
              {v.title}
            </h2>
            <p className="text-resume-sm font-medium text-accent mb-2">
              {v.subtitle}
            </p>
            <p className="text-resume-sm text-muted leading-relaxed">
              {v.description}
            </p>
            <div className="mt-4 text-resume-xs font-semibold text-secondary uppercase tracking-wider group-hover:text-accent transition-colors">
              View Resume &rarr;
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
