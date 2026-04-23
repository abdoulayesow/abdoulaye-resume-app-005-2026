# Command Accuracy Guidelines

Get it right the first time through verification and pattern-matching.

## Core Rules

1. **Verify before executing** — Check assumptions before running commands
2. **Follow existing patterns** — Match what already works in the repo
3. **Read definitions first** — Understand types/interfaces/skills/agents before extending them
4. **Use forward slashes** — Always
5. **Test incrementally** — Validate each step before proceeding

## Path Accuracy

**Do:**
- Use forward slashes: `tailored-resumes/hpe__senior-pm-greenlake-flex__2026-04-22/resume.md`
- Verify paths exist: `Glob pattern="tailored-resumes/*"` then `Read`
- Match exact case from Glob results (Linux is case-sensitive)
- Use the slug convention `{company}__{role}__{YYYY-MM-DD}` consistently

**Don't:**
- Use backslashes
- Assume slug folders exist without checking (`mkdir -p` if you need them)
- Guess case for resume filenames

## Edit Tool

**Do:**
- Read the file immediately before editing
- Copy `old_string` exactly from Read output (including whitespace and Markdown formatting)
- Include enough surrounding context to make the match unique

**Don't:**
- Edit without reading first
- Use a too-short `old_string` that matches multiple sections (e.g., `"## Summary"` appears in many resumes)
- Change indentation in `old_string` (3-space vs 4-space = "string not found")

## Skill / Agent / Hook Authoring

**Do:**
- Read existing skills (`.claude/skills/<name>/SKILL.md`) and agents (`.claude/agents/<name>.md`) before adding new ones
- Match the YAML frontmatter format exactly (`---\nname: ...\ndescription: ...\n---`)
- Place skills under `.claude/skills/<kebab-name>/SKILL.md`
- Place agents at `.claude/agents/<kebab-name>.md` (not in subfolders)
- Reference companion files in skills with relative paths (`guidelines/file.md`)

**Don't:**
- Skip the YAML frontmatter (the harness won't load the skill)
- Use spaces or camelCase in skill/agent names (use kebab-case)
- Create deeply nested structures unless the skill genuinely needs sub-files

## Resume Markdown Editing

**Do:**
- Verify the resume Markdown structure matches what `scripts/build-application-docx.py` expects (section headings: `PROFESSIONAL SUMMARY`, `KEY ACHIEVEMENTS`, `TECHNICAL & LEADERSHIP COMPETENCIES`, `PROFESSIONAL EXPERIENCE`, `CERTIFICATIONS`, `EDUCATION`, `PUBLICATIONS`)
- Use `### CompanyName — Location` for experience role headers
- Use `**Role Title** | *Date Range*` immediately under company line
- Use `- ` for bullet points (single dash, never `•` or emoji bullets in source)

**Don't:**
- Rename canonical section headings (breaks the .docx generator)
- Mix bullet styles
- Leave inline HTML in the Markdown source

## .docx Generation

**Do:**
- Run `python3 scripts/build-application-docx.py <slug>` after every resume.md change
- Verify all three outputs landed (resume.docx, resume-ats.docx, cover-letter .docx) by listing the slug folder

**Don't:**
- Hand-edit the `.docx` files (they get overwritten on next build)
- Assume `pandoc` is available — it's not on this machine; the script uses `python-docx` directly

## Pre-Execution Checklist

**Read/Edit/Write:**
- [ ] Path uses forward slashes
- [ ] File/directory exists (verified with Glob, or created with `mkdir -p`)
- [ ] Case matches exactly

**Edit specifically:**
- [ ] Recently read the file
- [ ] `old_string` copied exactly from Read output
- [ ] `old_string` is unique in the file

**New skill / agent:**
- [ ] YAML frontmatter present and valid
- [ ] Kebab-case naming
- [ ] Companion files referenced with relative paths

## Recovery

When a command fails:
1. Read the error message — it usually tells you exactly what's wrong
2. Verify your assumptions (path exists? correct case? correct heading name?)
3. Check existing patterns in similar files (other skills, other tailored resumes)
4. Fix and move on — don't repeat the same mistake
