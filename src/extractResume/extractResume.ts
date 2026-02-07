import fs from 'node:fs'

import { test } from '@playwright/test'
import Mustache from 'mustache'
import type { ElementHandle } from 'playwright-core'
import YAML from 'yaml'

interface Card {
  title: string
  dates: string
  duration: string
  description: string
}

interface CardWithCompany extends Card {
  company: string
  companyPictureUrl: string | undefined
}

const cleanHTML = (html: string) =>
  html
    .replace(/\n+/g, '')
    .replace(/\s+/g, ' ')
    .replace(/(<br>)/g, '\n')
    .replace(/<\/?p>/g, '')

const removeEmojis = (text: string) => text.replace(/\p{Emoji}/gu, '').trim()

const mapBaseCard = async (
  experience: ElementHandle<SVGElement | HTMLElement>,
): Promise<Card> => {
  const title = (await (await experience.$('h3'))?.textContent())?.trim() ?? ''
  const dates =
    (await (await experience.$('.date-range'))?.textContent())?.trim() ?? ''
  const duration =
    (await (await experience.$('.before\\:middot'))?.textContent())?.trim() ??
    ''
  const descriptionLess = await experience.$('.show-more-less-text__text--less')
  const descriptionMore = await experience.$('.show-more-less-text__text--more')
  const description =
    (await (descriptionMore
      ? descriptionMore
      : descriptionLess
    )?.innerHTML()) ?? ''
  return {
    title,
    dates: dates.replace(duration, '').replace(/\n/g, '').trim(),
    duration,
    description: cleanHTML(
      description.slice(0, description.indexOf('<button class')).trim(),
    ),
  }
}

const mapCard = async (
  experience: ElementHandle<SVGElement | HTMLElement>,
): Promise<CardWithCompany> => {
  const company =
    (await (await experience.$('h4'))?.textContent())?.trim() ?? ''
  const companyPictureUrl =
    (await (
      await experience.$('.profile-section-card__image')
    )?.getAttribute('src')) ?? undefined
  return {
    ...(await mapBaseCard(experience)),
    company,
    companyPictureUrl,
  }
}

const getOverridePicture = (name: string) => {
  const overridePicturePath = `in/${name}.jpg`

  if (fs.existsSync(overridePicturePath)) {
    return `data:image/jpeg;base64,${fs.readFileSync(overridePicturePath).toString('base64')}`
  }

  return undefined
}

const mapGroup = async (
  group: ElementHandle<SVGElement | HTMLElement>,
): Promise<CardWithCompany[]> => {
  const company =
    (
      await (await group.$('.experience-group-header__company'))?.textContent()
    )?.trim() ?? ''
  const companyPictureUrl =
    getOverridePicture(company) ??
    (await (await group.$('img'))?.getAttribute('src')) ??
    undefined

  const experiences = await group.$$('.profile-section-card')
  return Promise.all(
    experiences.map(async (experience) => ({
      ...(await mapBaseCard(experience)),
      company,
      companyPictureUrl,
    })),
  )
}

const mapExperience = async (
  experience: ElementHandle<SVGElement | HTMLElement>,
): Promise<CardWithCompany | CardWithCompany[]> => {
  const classes = (await experience.getAttribute('class')) ?? ''
  if (classes.includes('experience-group')) {
    return mapGroup(experience)
  } else {
    return mapCard(experience)
  }
}

const elementToBase64Picture = async (
  promisedElement: Promise<ElementHandle<SVGElement | HTMLElement> | null>,
) => {
  const element = await promisedElement

  if (element === null) {
    return null
  }

  const src = await element.getAttribute('src')

  if (src === null || src === '') {
    return null
  }

  return (await element.screenshot()).toString('base64')
}

interface Formation {
  school: string
  degreeInfos: string
  dates: string
  schoolPictureUrl?: string
}

const mapFormation = async (
  formation: ElementHandle<SVGElement | HTMLElement>,
): Promise<Formation> => {
  const school = ((await (await formation.$('h3'))?.textContent()) ?? '').trim()
  const degreeInfos = (
    await Promise.all(
      (
        await formation.$$('.education__item--degree-info')
      ).map((degree: ElementHandle<SVGElement | HTMLElement>) =>
        degree.textContent(),
      ),
    )
  ).join(' · ')
  const dates = (await (await formation.$('.date-range'))?.textContent()) ?? ''
  const schoolPictureUrl =
    getOverridePicture(school) ??
    (await (await formation.$('img'))?.getAttribute('src')) ??
    undefined

  return {
    school,
    degreeInfos,
    dates: dates.trim(),
    schoolPictureUrl,
  }
}

test('extract resume and generate json, html and pdf', async ({ page }) => {
  await page.goto('about:blank')

  const profileBuffer = fs.readFileSync('in/profile.html')
  const profile = profileBuffer.toString('utf-8')

  await page.setContent(profile)

  const experiencesTitles = await page.$$(
    '.experience__list h3, .education__list h3',
  )

  for (const experienceTitle of experiencesTitles) {
    await experienceTitle.scrollIntoViewIfNeeded()
  }

  const name = removeEmojis(
    (await (await page.$('.top-card-layout__title'))?.textContent())?.trim() ??
      '',
  )
  const about = cleanHTML(
    (
      await (await page.$('.core-section-container__content'))?.innerHTML()
    )?.trim() ?? '',
  )
  const headline =
    (
      await (await page.$('.top-card-layout__headline'))?.textContent()
    )?.trim() ?? ''
  const subinfo =
    (await (await page.$('.top-card-layout__first-subline'))?.textContent()) ??
    ''
  const city = subinfo.slice(0, subinfo.indexOf(',')).trim()
  const fullUrl =
    (await (await page.$('[rel=canonical]'))?.getAttribute('href')) ?? ''
  const url = fullUrl.slice(fullUrl.indexOf('linkedin'))
  const pictureUrl =
    (await (await page.$('.top-card__profile-image'))?.getAttribute('src')) ??
    undefined

  const rawExperiences = await page.$$('.experience-item, .experience-group')
  const projects = (
    await Promise.all(rawExperiences.map(mapExperience))
  ).flat() as CardWithCompany[]

  const rawFormations = await page.$$('.education__list-item')
  const formations = await Promise.all(rawFormations.map(mapFormation))

  const template = fs
    .readFileSync('src/extractResume/template.html')
    .toString('utf-8')

  const now = new Date()

  const firstProject = projects.at(-1)?.dates?.match(/(\d+)/g)?.[0]
  const firstProjectYear = firstProject
    ? parseInt(firstProject, 10)
    : now.getFullYear()

  const lastProjectYears = projects.at(0)?.dates.match(/(\d+)/g)
  const lastProjectYear = lastProjectYears
    ? parseInt(lastProjectYears[1] ?? lastProjectYears[0], 10)
    : now.getFullYear()

  console.log('xp', firstProjectYear, lastProjectYear)

  const data = {
    name,
    headline,
    city,
    url,
    about,
    pictureUrl,
    projects,
    formations,
    xp: lastProjectYear - firstProjectYear,
  }

  const cv = Mustache.render(template, data)
  await page.setContent(cv)

  const profilePicture = await elementToBase64Picture(page.$('#profilePicture'))

  const projectsWithPictures = await Promise.all(
    data.projects.map(async (project) => {
      return {
        ...project,
        companyPicture: await elementToBase64Picture(
          page.$(`[id="${project.dates}"]`),
        ),
      }
    }),
  )

  const formationsWithPictures = await Promise.all(
    data.formations.map(async (formation) => {
      return {
        ...formation,
        schoolPicture: await elementToBase64Picture(
          page.$(`[id="${formation.dates}"]`),
        ),
      }
    }),
  )

  const dataWithPictures = {
    ...data,
    profilePicture,
    projects: projectsWithPictures,
    formations: formationsWithPictures,
  }

  fs.writeFileSync(
    'src/data/cv.yml',
    `# yaml-language-server: $schema=./cv.yml \n${YAML.stringify(dataWithPictures, undefined)}`,
  )
})
