# Single-Page Resume Redesign

## Overview

Completely redesigned the resume from a 2-page layout to a sophisticated **single-page A4 format** with a modern editorial/magazine aesthetic inspired by Bloomberg Businessweek and Swiss Design principles.

## Design Philosophy

### Tone & Aesthetic
- **Modern Editorial/Magazine Style**: Professional authority meets visual sophistication
- **Information Density**: Maximalist approach with controlled visual hierarchy
- **Typography-Driven**: Bold headings, tight leading, strategic use of size and weight
- **Color Strategy**: Navy primary (#1e3a5f) with gold accents maintaining Executive Editorial theme

### Layout Strategy
- **Asymmetric 3-Column Grid**: `[200px | 1fr | 180px]`
  - **Left Sidebar (200px)**: Certifications summary, Technical Skills, Additional Info
  - **Main Column (fluid)**: Professional Summary, Core Competencies, Professional Experience
  - **Right Sidebar (180px)**: Key Metrics, Education, Training & Speaking

### Space Efficiency Techniques
1. **Condensed Experience**: Extract only key bullet points (max 4 per job)
2. **Visual Certification Summary**: Show count badges instead of listing all
3. **Metric-Driven Achievements**: Large numbers with compact descriptions
4. **Aggressive Font Sizing**: Range from 0.55rem to 0.8rem for body text
5. **Tight Line Heights**: `leading-tight` and `leading-snug` throughout
6. **Strategic Spacing**: 2-3 units between major sections, 0.5-1 within sections

## Key Components

### Header (Compact)
- Smaller profile image (64px → 48px when printed)
- Tighter vertical spacing (py-3 instead of py-5)
- Contact info wraps gracefully

### Experience Items (Condensed)
- Only shows impactful bullet points with metrics/achievements
- Removed full paragraph descriptions
- Visual timeline with accent dots
- Font sizes: 0.55rem for bullets, 0.675rem for titles

### Certifications (Visual Summary)
- Large count badge showing total (10 certifications)
- Category breakdown with counts
- Top 5 featured certifications expanded
- Saves ~60% vertical space vs. full listing

### Achievements (Metric Wall)
- Large accent-colored numbers
- Compact text descriptions
- Visually striking in right sidebar
- Top 6 metrics displayed prominently

## Technical Implementation

### New Files Created
1. **src/components/resume/SinglePageResume.tsx** - Main single-page component
2. **src/app/[variant]/page.tsx** - New default route (single-page)
3. **src/app/[variant]/page-two-page.tsx** - Old two-page layout preserved
4. **scripts/generate-favicon.mjs** - Favicon generation from profile.jpg
5. **public/site.webmanifest** - PWA manifest

### Favicon Implementation
Generated multiple sizes from `public/profile.jpg`:
- `favicon.ico` (32x32)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### Updated Files
- **src/app/layout.tsx** - Updated metadata with new favicon paths and manifest
- **package.json** - Added `generate-favicon` script
- **src/components/resume/index.ts** - Exported SinglePageResume

## Typography Scale

Tailwind custom sizes optimized for print:
- `resume-xs`: 0.6rem / 0.85rem line height
- `resume-sm`: 0.675rem / 0.925rem
- `resume-base`: 0.725rem / 1rem
- `resume-lg`: 0.8rem / 1.1rem
- `resume-xl`: 0.925rem / 1.25rem
- `resume-2xl`: 1.1rem / 1.4rem
- `resume-3xl`: 1.5rem / 1.85rem

## Color System

Maintains existing Executive Editorial theme:
- **Primary**: `#1e3a5f` (Navy)
- **Secondary**: `#5a7a9f` (Slate Blue)
- **Accent**: `#d4af37` (Gold)
- **Muted**: `#6b7280` (Gray)

## Content Adaptation

### Experience Section
Original descriptions were full paragraphs. New approach:
```javascript
// Extract only impactful bullets with metrics
const bullets = project.description
  .split('\n')
  .filter(line =>
    line.trim().startsWith('-') ||
    line.includes('**') ||
    line.match(/\d+%/)
  )
  .slice(0, 4) // Max 4 bullets per job
```

### Certifications Section
Original: Full list with acronym, full name, year (10+ lines)
New: Visual summary with count badge + category breakdown (4-5 lines)

### Achievements Section
Original: Two-column text list
New: Metric wall with large accent numbers and compact descriptions

## Print Optimization

- **Page Size**: A4 (210mm × 297mm)
- **Padding**: 6 units horizontal, 5 units vertical
- **Grid Gap**: 4 units between columns
- **No Page Breaks**: Everything fits on one page
- **Print-Ready Fonts**: Web fonts load properly for PDF export

## Usage

### Development
```bash
npm run dev
# Visit http://localhost:3000/agile-coach
```

### Build
```bash
npm run build
```

### Generate Favicon (if profile.jpg changes)
```bash
npm run generate-favicon
```

### Access Two-Page Layout
The old two-page layout is preserved in `src/app/[variant]/page-two-page.tsx` if needed for reference or rollback.

## Variants Supported

Both variants work with the new single-page layout:
- `/agile-coach` - Agile Transformation Leader variant
- `/product-manager-ai-ml` - Product Manager AI/ML variant

## Print Instructions

1. Open resume in browser
2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
3. Settings:
   - Paper: A4
   - Margins: Default
   - Background graphics: On (for colors)
   - Scale: 100%
4. Save as PDF or print

## Design Decisions

### Why Single-Page?
- **Recruiter-Friendly**: One glance captures entire career
- **Print-Efficient**: One sheet to print/share
- **Digital-First**: Better for LinkedIn/email attachments
- **Forces Clarity**: Only most impactful information survives

### Why Asymmetric Grid?
- **Visual Interest**: Breaks monotony of symmetric layouts
- **Information Hierarchy**: Main content gets most space
- **Scanning Efficiency**: Eye naturally moves through columns
- **Professional**: Feels designed, not templated

### Why Condensed Content?
- **Metric-Focused**: Achievements speak louder than descriptions
- **Attention Span**: Recruiters spend 6-7 seconds per resume
- **Scanning Optimization**: Bullets and bold metrics catch the eye
- **Space Efficiency**: Fits 10+ years of experience on one page

## Future Enhancements

Potential improvements if needed:
1. **Dynamic Content Pruning**: Automatically select top N achievements based on metrics
2. **QR Code**: Add QR code linking to LinkedIn/portfolio
3. **Skills Visualization**: Replace text lists with visual skill ratings
4. **Color Variants**: Easy theme switching (keep navy/gold, add alternatives)
5. **Export Button**: One-click PDF generation with optimal settings

## Comparison: Two-Page vs. Single-Page

### Two-Page Layout
- ✅ Complete project descriptions
- ✅ Full certification details
- ✅ More white space
- ❌ Excessive empty space on Page 1
- ❌ Content split across pages
- ❌ Two sheets to print

### Single-Page Layout (Current)
- ✅ Everything on one page
- ✅ Visually striking and memorable
- ✅ Metric-focused and achievement-driven
- ✅ Print-efficient (one sheet)
- ✅ Sophisticated editorial aesthetic
- ❌ Less detailed project descriptions
- ✅ But: Forces focus on impact over narrative

## Accessibility Notes

- Semantic HTML structure maintained
- Sufficient color contrast (navy on white, gold accents)
- Font sizes remain readable even at 0.55rem when printed on A4
- Screen reader friendly with proper heading hierarchy
- Print styles ensure colors render correctly

---

**Design & Implementation**: Frontend Design Skill (Claude Code)
**Date**: 2026-02-07
**Version**: 1.0
