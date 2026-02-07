export interface TechnicalSkillCategory {
  category: string
  skills: string[]
}

export interface Project {
  title: string
  company: string
  client?: string
  location?: string
  dates: string
  duration: string
  stack?: string
  description: string
}

export interface Certification {
  acronym: string
  fullName: string
  year: number
  group: string
}

export interface Achievement {
  text: string
  metric?: string
}

export interface Publication {
  title: string
  venue: string
  date: string
  description: string
}

export interface TrainingSpeaking {
  type: string
  title: string
  description: string
  details: string[]
}

export interface Education {
  school: string
  degree: string
  dates: string
  focus?: string
}

export interface ContinuingEducation {
  name: string
  provider?: string
  status?: string
}

export interface AdditionalInfo {
  label: string
  value: string
}

export interface Curriculum {
  name: string
  headline: string
  email: string
  phone: string
  city: string
  linkedinUrl: string
  githubUrl?: string
  experienceStart: string
  pageBreakAfterProjectIndex: number
  professionalSummary: string
  coreCompetencies: TechnicalSkillCategory[]
  projects: Project[]
  certifications: Certification[]
  achievements: Achievement[]
  publications?: Publication[]
  trainingSpeaking?: TrainingSpeaking[]
  education: Education[]
  continuingEducation?: ContinuingEducation[]
  technicalSkills: TechnicalSkillCategory[]
  additionalInfo: AdditionalInfo[]
}
