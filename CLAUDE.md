# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 application that generates a professional curriculum vitae (CV) by extracting data from LinkedIn profile HTML and rendering it as a beautiful web page. The project uses Playwright for web scraping and YAML for data storage.

## Common Commands

- `npm run dev` - Start the Next.js development server (http://localhost:3000)
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Run Biome linter with auto-fix
- `npm run format` - Format code with Biome
- `npm run extract-resume` - Extract CV data from LinkedIn HTML using Playwright (reads `in/profile.html`, outputs to `src/data/cv.yml`)

## Architecture

### Two-Phase System

1. **Extraction Phase** (`src/extractResume/extractResume.ts`):
   - Reads LinkedIn profile HTML from `in/profile.html`
   - Uses Playwright to parse and extract:
     - Profile information (name, headline, city, profile picture)
     - Work experience (company, title, dates, descriptions)
     - Education/formations (school, degree, dates)
     - Company and school logos (converted to base64)
   - Renders data with Mustache template (`src/extractResume/template.html`)
   - Outputs structured data to `src/data/cv.yml` with embedded base64 images
   - Can override company/school images by placing JPG files in `in/` directory (e.g., `in/Company Name.jpg`)

2. **Rendering Phase** (`src/app/page.tsx`):
   - Reads CV data from `src/data/cv.yml` (or `src/data/override-cv.yml` if present)
   - Renders CV as a Next.js server component with Tailwind CSS
   - Displays profile, technical skills, talks, work experience, and education
   - Print-optimized layout with page breaks

### Key Data Flow

```
in/profile.html
  → extractResume.ts (Playwright scraping)
  → src/data/cv.yml (YAML with base64 images)
  → page.tsx (Next.js rendering)
  → Beautiful CV webpage
```

### Important Files

- `src/data/cv.yml` - Main CV data source (auto-generated, includes base64 images)
- `src/data/override-cv.yml` - Optional manual override (checked first by `page.tsx`)
- `src/data/technical-skills.md` - Markdown content for technical skills section
- `src/extractResume/template.html` - Mustache template for CV HTML (used during extraction for image conversion)
- `in/profile.html` - Input: LinkedIn profile HTML (user-provided)
- `in/*.jpg` - Optional: Override images for companies/schools (filename must match exact name)

### TypeScript Configuration

- Path alias: `@/*` maps to `./src/*`
- Strict mode enabled
- Target: ES5

### Styling

- Tailwind CSS with custom gradient colors (primary/secondary defined in `tailwind.config.ts`)
- Print-optimized styles with `print:` variants
- Custom icon components in `src/icons/`

## Development Notes

- The extraction script (`extractResume.ts`) is a Playwright test that doesn't actually test anything - it's a script that leverages Playwright's browser automation
- Images are embedded as base64 to create a self-contained CV (no external image dependencies)
- The CV calculates years of experience by parsing the first and last project dates
- HTML descriptions from LinkedIn are cleaned (removes `<br>` tags and `<p>` tags, converts to newlines)
- The app supports both LinkedIn-fetched images and locally overridden images for companies/schools
