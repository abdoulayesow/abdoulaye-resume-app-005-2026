# Session Summary Templates

Two tiers: **Lean** for short/narrow sessions, **Full** for substantial work.

---

## Lean Template

For config changes, single-skill edits, small bug fixes, simple commits.

```markdown
# Session Summary: [FEATURE_NAME]

**Date:** YYYY-MM-DD HH:MM
**Session Focus:** [one-line description]

## Completed Work

- [bullet]
- [bullet]

## Key Files Modified

| File | Changes |
|------|---------|
| `path/to/file.md` | [brief description] |

## Current State

[git status: what's committed vs pending, branch state]

## Next Steps

1. [next task]
2. [following task]

## Mistakes & Learnings

[Only if there were failed commands, retries, or avoidable mistakes]

- **[mistake]** → Fix: [what worked]. Saved to memory: [yes/no]

## Resume Prompt

` ` `
Resume [FEATURE_NAME] session.

## Context
Previous session completed:
- [key accomplishment 1]
- [key accomplishment 2]

Session summary: .claude/summaries/YYYY-MM-DD/YYYY-MM-DDTHH-MM_feature-name.md
Project context: CLAUDE.md, applications-log.md

## Key Files to Review First
- path/to/main/file (primary changes)

## Current Status
[brief status]

## Next Steps
1. [immediate next task]
2. [following task]
` ` `
```

---

## Full Template

For feature implementation, application pipelines, refactors, multi-step work.

```markdown
# Session Summary: [FEATURE_NAME]

**Date:** YYYY-MM-DD HH:MM
**Session Focus:** [brief description]

## Overview

[1-2 paragraph summary of goals and outcomes]

## Completed Work

### Application Pipeline
- [job posting saved, analysis written, resume tailored, etc.]

### Toolkit Infrastructure
- [skills/agents/hooks added or modified]

### Web App
- [src/, components, scripts changes]

### Documentation
- [CLAUDE.md updates, READMEs, applications-log.md row added]

(Drop categories that don't apply this session.)

## Key Files Modified

| File | Changes |
|------|---------|
| `path/to/file1.md` | [brief description] |
| `path/to/file2.tsx` | [brief description] |

## Design Decisions

- **[Decision]**: [what was chosen and why; trade-off considered]

## Plan Progress

| Task | Status | Notes |
|------|--------|-------|
| Task 1 | **COMPLETED** | [notes] |
| Task 2 | **PENDING** | [what remains] |

## Application Tracking (if applicable)

| Slug | Status | Match Score | Files Generated |
|------|--------|-------------|-----------------|
| `company__role__date` | prepared | 91/100 | resume.docx, resume-ats.docx, cover.docx |

## Next Steps

1. [next task with context]
2. [following task]

### Blockers or Decisions Needed
- [any blockers discovered]

## Session Retrospective

**Efficiency:** [Good / Fair / Poor] — [1-sentence justification]

### What Went Well
- [bullet]

### What Could Improve
- [bullet]

### Notable Issues
- [only if there were actual errors/failures worth documenting]

## Lessons Learned

- [pattern or insight worth remembering for future sessions]

## Mistakes & Learnings

[Review failed commands, edit retries, tool gaps from this session]

| Mistake | Root Cause | Fix | Saved to Memory? |
|---------|-----------|-----|------------------|
| [failed command/error] | [why it happened] | [what worked] | [yes — file.md / no — one-off] |

## Resume Prompt

` ` `
Resume [FEATURE_NAME] session.

## Context
Previous session completed:
- [key accomplishment 1]
- [key accomplishment 2]
- [key accomplishment 3]

Session summary: .claude/summaries/YYYY-MM-DD/YYYY-MM-DDTHH-MM_feature-name.md
Project context: CLAUDE.md, applications-log.md, docs/AUTOMATION_ROADMAP.md (if relevant)

## Key Files to Review First
- path/to/main/file.tsx (primary changes)
- path/to/related/file.md (supporting changes)

## Current Status
[brief status statement]

## Next Steps
1. [immediate next task]
2. [following task]
3. [third task]

## Important Notes
- [critical context]
- [blockers or decisions needed]
` ` `
```

---

## Template Tips

1. **Feature Name**: Use kebab-case for the filename (e.g., `hpe-application-trial`, `tailor-resume-skill-build`)
2. **Completed Work**: Group by the project's natural categories (Application pipeline / Toolkit / Web app / Documentation)
3. **Files Table**: Include only files with significant changes
4. **Resume Prompt**: Make it copy-paste ready — must work with zero conversation context
5. **Retrospective**: Be honest — don't fabricate metrics you can't measure
6. **Application Tracking**: Include this section ONLY when a job application was prepared this session
