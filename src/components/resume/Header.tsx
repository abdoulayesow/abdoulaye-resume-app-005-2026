import type { Curriculum } from '@/app/types'
import ObfuscatedText from '@/components/ObfuscatedText'
import EmailIcon from '@/icons/EmailIcon'
import GithubIcon from '@/icons/GithubIcon'
import LinkedinIcon from '@/icons/LinkedinIcon'
import LocationIcon from '@/icons/LocationIcon'
import PhoneIcon from '@/icons/PhoneIcon'
import profileImg from '../../../public/profile.jpg'

const Header = ({ data }: { data: Curriculum }) => {
  const yearsOfExperience = Math.floor(
    (Date.now() - new Date(data.experienceStart).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000),
  )

  return (
    <div className="bg-primary text-white px-8 py-5 -mx-8 -mt-6">
      <div className="flex items-center gap-6">
        <img
          src={profileImg.src}
          className="w-[72px] h-[72px] rounded-full object-cover border-2 border-accent/70 flex-shrink-0"
          alt=""
        />
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-resume-4xl tracking-wide text-white leading-none mb-1">
            {data.name}
          </h1>
          <p className="text-resume-base text-accent font-medium tracking-wide uppercase">
            {data.headline}
          </p>
          <p className="text-resume-xs text-blue-200/80 mt-0.5">
            {yearsOfExperience}+ years of experience
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/15 text-resume-xs text-blue-100/90">
        <span className="flex items-center gap-1">
          <LocationIcon className="text-accent text-sm" />
          {data.city}
        </span>
        <span className="text-white/30">|</span>
        <span className="flex items-center gap-1">
          <EmailIcon className="text-accent text-sm" />
          <ObfuscatedText encoded={data.email} />
        </span>
        <span className="text-white/30">|</span>
        <span className="flex items-center gap-1">
          <PhoneIcon className="text-accent text-sm" />
          <ObfuscatedText encoded={data.phone} />
        </span>
        <span className="text-white/30">|</span>
        <span className="flex items-center gap-1">
          <LinkedinIcon className="text-accent text-sm" />
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
              <GithubIcon className="text-accent text-sm" />
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
  )
}

export default Header
