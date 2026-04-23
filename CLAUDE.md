# CLAUDE.md

Guidance for Claude Code working in this repository.

## Mission

This repo serves **two related goals**:

1. **Web-rendered CV** — a Next.js 14 app that renders Abdoulaye Sow's resume as a polished single-page web/print artifact (the original purpose of the project).
2. **Application toolkit** — maintain multiple resume variants and tailor them to specific job postings, with matching cover letters, optimized for **Applicant Tracking Systems (ATS) and AI screening**.

When the user asks you to "tailor" or "apply" or "draft a cover letter," you're working in goal #2. When they ask about layout, components, or `/agile-coach` / `/product-manager-ai-ml` URLs, it's goal #1.

## Candidate profile (single source of truth)

- **Name**: Abdoulaye Sow
- **Email**: abdoulaye.sow.co@gmail.com
- **Phone**: (281) 323-8023
- **Location**: Conroe, TX 77384 (Houston area) — open to remote, hybrid, or relocation
- **LinkedIn**: linkedin.com/in/abdoulaye-sow-44861633
- **GitHub**: github.com/abdoulayesow
- **Citizenship**: U.S. Citizen (security clearance eligible)
- **Languages**: English (fluent), French (native)
- **Notice**: 2 weeks
- **Published research**: arxiv.org/abs/2310.15612 (multilingual NLP)

## Resume variants

Two canonical Markdown source variants live in `resume-data/`:

- `Resume_Agile_Coach.md` — Agile Transformation Leader / SAFe SPC6 Trainer
- `Resume_Product_Manager_AI_ML.md` — Principal PM, AI/ML

Both are also rendered by the Next.js app via `src/data/cv-agile-coach.yml` and `src/data/cv-product-manager-ai-ml.yml`. **Do not let the Markdown and YAML drift apart** — when you change one, update the other or note the divergence in the PR/commit.

Tailored variants are generated under `tailored-resumes/<slug>/` and **must not** overwrite the canonical Markdown sources.

## Workflow: tailoring a resume to a job

The expected flow:

1. User drops a job posting under `job-postings/`.
2. Run `/jd-extract` → produces a structured analysis (must-have skills, nice-to-have, keywords, seniority, culture cues).
3. Run `/tailor-resume` → picks the closer base variant, rewrites summary + reorders bullets + injects matched keywords naturally, outputs `tailored-resumes/<slug>/resume.md`.
4. Run `/ats-audit` → scores the tailored resume against ATS rules, reports a checklist.
5. Run `/cover-letter` → drafts a 1-page cover letter referencing the same keywords and 2-3 specific achievements.

## ATS / AI-screening rules (mandatory for any tailored output)

These are baked-in industry standards as of 2026. Follow them in every tailored resume **and** keep the canonical Markdown sources compatible:

### Format & structure
- **Single column.** No tables, text boxes, columns, or sidebar layouts in the Markdown source. (The Next.js render can be multi-column; the Markdown cannot.)
- **Standard section headings only**: `Professional Summary`, `Core Competencies` or `Skills`, `Professional Experience`, `Education`, `Certifications`, `Additional Information`. Never invent creative names like "My Journey" or "What I Bring."
- **Section order**: Contact → Summary → Skills → Experience → Education → Certifications → Additional.
- **Standard bullets only**: `-` or `•`. No emoji bullets, no checkmarks, no decorative glyphs in body text. (Trophy/checkmark icons are OK in the achievements section as accents but never as bullet characters.)
- **Dates as `Mon YYYY – Mon YYYY`** or `Mon YYYY – Present`. Consistent throughout.
- **No images, charts, or graphics in the .docx/PDF that gets uploaded.** Profile photo OK on the web version, never on the ATS-uploaded version.
- **Fonts (when exporting)**: Arial, Calibri, Georgia, Times New Roman, or Verdana. 10–12pt body.
- **Upload format**: prefer `.docx`. PDF is acceptable only if it's a native (text-selectable) PDF, never a scanned/image PDF.

### Keyword strategy
- **15–25 distinct relevant keywords per resume.** More than that risks keyword-stuffing penalties from modern semantic screeners.
- **Match 3–5 exact keywords from the job description verbatim** (e.g., if the JD says "Agile Release Train," use "Agile Release Train" — not "ART program" — at least once).
- **Include both acronyms and full forms** (e.g., "Search Engine Optimization (SEO)", "Large Language Model (LLM)"). Modern parsers map both, but conservative ones still need explicit pairing.
- **Contextualize, don't dump.** Every keyword should appear inside a bullet that names a metric or outcome. Never standalone keyword piles outside the Skills section.
- **Mirror the JD's seniority language.** If the JD says "lead," "drive," "own," reuse those verbs.

### Content quality
- **Every experience bullet should follow Action + Context + Metric.** Example: `Coached 24 engineers across 3 Scrum teams to 100% productivity improvements within 6 months.`
- **Numbers > adjectives.** Replace "significantly improved" with `improved by 35%`. If you don't have a number, write what you actually did, not how amazing it was.
- **Lead with the strongest 4 bullets per role.** ATS reads everything, but humans only scan ~6-7 seconds — front-load impact.
- **Cap each role at 4–6 bullets** (single-page constraint).
- **No first person.** No "I" or "my." Implied subject only.

### What NOT to do (these will fail screening)
- Don't use multi-column layouts in the source Markdown.
- Don't put critical info in headers or footers (many parsers ignore them).
- Don't fabricate experience, certifications, dates, or metrics. Tailoring is **emphasis and translation**, never invention.
- Don't keyword-stuff: cramming the same term 10x in white text or invisible divs is detected and penalized.
- Don't run AI-detection bypass / "humanizer" tools on the output. Modern screeners don't actually run AI-detection on resumes — they score relevance. Spending energy "humanizing" is wasted; spend it on metrics and keyword fit instead.

## Web app (Next.js) — common commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` / `npm run lint:fix` / `npm run format` — Biome
- `npm run extract-resume` — extract from `in/profile.html` LinkedIn export → `src/data/cv.yml`
- `npm run generate-favicon` — regenerate favicons from `public/profile.jpg`

Variants live at `/agile-coach` and `/product-manager-ai-ml`. The single-page redesign is documented in `SINGLE_PAGE_REDESIGN.md`.

## Web-app architecture (unchanged)

### Two-Phase System

1. **Extraction** (`src/extractResume/extractResume.ts`):
   - Reads `in/profile.html` (LinkedIn export) → Playwright parses → outputs `src/data/cv.yml` with base64-embedded images.
   - Override company/school logos by dropping `in/<Exact Name>.jpg`.

2. **Rendering** (`src/app/[variant]/page.tsx`):
   - Reads `src/data/cv-<variant>.yml` (or `cv.yml`).
   - Renders single-page A4 layout via `SinglePageResume` components in `src/components/resume/`.
   - Print-optimized with Tailwind `print:` variants.

### Important files

- `src/data/cv-agile-coach.yml`, `src/data/cv-product-manager-ai-ml.yml` — variant data.
- `src/data/cv.yml` — auto-generated from LinkedIn extraction.
- `src/data/override-cv.yml` — optional manual override checked first.
- `src/components/resume/SinglePageResume.tsx` — single-page layout entrypoint.
- `tailwind.config.ts` — `resume-xs` … `resume-3xl` custom typography scale, navy/gold color tokens.

### TypeScript / styling

- Path alias `@/*` → `./src/*`.
- Strict mode, target ES5.
- Tailwind with custom gradient + print styles.

## Skills available in this repo

Located in `.claude/skills/`:

- `/jd-extract` — parse a job posting into structured intel (must-have, keywords, seniority, culture).
- `/tailor-resume` — produce a tailored resume variant for a specific posting.
- `/cover-letter` — draft a 1-page cover letter for a tailored application.
- `/ats-audit` — score a resume against the ATS rules in this file.
- `/resume-review` — full pre-submission gauntlet: combines `ats-reviewer` + `resume-coach` agents and produces a single combined report with a submission verdict.

## Agents available in this repo

Located in `.claude/agents/`:

- `jd-analyst` — deep-dive a JD; extracts requirements, keywords, signals.
- `resume-bullet-writer` — rewrites bullets to Action+Context+Metric form, swaps verbs to match JD voice.
- `ats-reviewer` — mechanical ATS audit (format, parser-safety, keyword match, content rules).
- `resume-coach` — qualitative human-eye review (length-vs-seniority, narrative arc, tone, recruiter 7-second scan, modern conventions). Pairs with `ats-reviewer`.

Use these via the Task tool when a workflow needs a focused subagent rather than a full slash command.

## Resume length standard (private-sector tech, 2026)

- Entry / 0–3 yrs: 1 page strict
- Mid / 3–8 yrs: 1–2 pages, 1 preferred
- **Senior / 8+ yrs (Abdoulaye): 2 pages — sweet spot**
- Executive (VP+): 2–3 pages
- Academic CV / Federal: different beasts (4+ pages OK)

3+ pages for a Senior IC role is a red flag. The `resume-coach` agent enforces this.

## Output conventions (recap)

- Job postings input → `job-postings/`
- Tailored resumes → `tailored-resumes/<slug>/resume.md` (+ optional `resume-ats.md`)
- Cover letters → `cover-letters/<slug>.md`
- Slug format: `{company-slug}__{role-slug}__{YYYY-MM-DD}`

## Dual-source resume pattern (visual + ATS divergence)

Each application can have **one** Markdown source or **two**, depending on whether the visual `.docx` and ATS `.docx` should differ in *content* (not just styling):

```
tailored-resumes/<slug>/
  resume.md       → resume.docx        (V2_McDonald's-styled, for human/recruiter sharing)
  resume-ats.md   → resume-ats.docx    (single-column ATS-safe, for portal upload)
```

- **If only `resume.md` exists**: the build script uses it for both `.docx` outputs. Default for new applications.
- **If `resume-ats.md` also exists**: the build script uses it for the ATS variant. Lets the ATS version diverge — typically tighter (shorter tagline, fewer roles, combined Certs+Education section). The visual version stays richer.
- **Always edit the Markdown, never the `.docx` directly.** `python3 scripts/build-application-docx.py <slug>` regenerates both `.docx` files from Markdown source — direct `.docx` edits get overwritten.
- **Section heading variant supported**: `## CERTIFICATIONS & EDUCATION` (combined) renders alongside the standard separate `## CERTIFICATIONS` + `## EDUCATION` form.

If you find yourself diverging the same way across multiple applications (e.g., always dropping the same role from ATS versions), that's a signal the canonical source resumes in `resume-data/` should be split into "full" vs "tight" variants — surface it to the user, don't silently drift.
