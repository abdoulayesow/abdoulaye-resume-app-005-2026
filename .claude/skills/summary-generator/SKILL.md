---
name: summary-generator
description: Generates session summaries and resume prompts for multi-session work on this resume-tailoring + Next.js CV project. Use when completing application pipelines, tailoring sessions, web-app changes, before context limits (~50% capacity), or when user says "summary", "wrap up", "save progress", "end session". Creates markdown in .claude/summaries/YYYY-MM-DD/ with completed work, files modified, and a copy-paste resume prompt.
allowed-tools: Read, Edit, Glob, Grep, Bash(git diff:*), Bash(git log:*), Bash(git status:*), Write
---

# Session Summary Generator

## Overview

Creates session summaries for multi-session work on this repo, enabling seamless resumption. Generates a Markdown file in `.claude/summaries/YYYY-MM-DD/` with a standardized format, plus a self-reflection step that updates auto memory.

## Project context this skill serves

This repo has two intertwined goals (see `CLAUDE.md`):
1. **Web-rendered CV** (Next.js 14 app at `/agile-coach`, `/product-manager-ai-ml`)
2. **Application toolkit** — tailor resumes + cover letters to specific job postings, ATS-optimized

When summarizing, segment the session's work by which goal it served — the reader resuming weeks later needs to know whether they're picking up web-app work, a job application, or skills/agent infrastructure.

## When to Use

- User requests a summary ("generate summary", "wrap up", "save progress", "end session")
- Completing a job application pipeline (resume + cover letter + audit shipped)
- Completing a feature/refactor on the Next.js app
- Adding/modifying skills, agents, hooks, or CLAUDE.md
- Conversation context reaching ~50% before auto-compact
- Before starting a new chat session

## Output Location

```
.claude/summaries/YYYY-MM-DD/YYYY-MM-DDTHH-MM_feature-name.md
```

- **Folder**: date portion of the filename
- **Filename**: `YYYY-MM-DDTHH-MM_kebab-feature-name.md` (time from current timestamp; `-` instead of `:` for filesystem safety)
- **Feature name**: kebab-case, descriptive (`hpe-application-trial`, `single-page-redesign`, `tailor-resume-skill-build`, etc.)

## Template Tiers

Choose based on session scope:

### Lean Summary
Use for: short or narrow sessions — config tweaks, single-file fixes, small CLAUDE.md edits, single-skill additions.

### Full Summary
Use for: feature implementation, multi-step work, full application pipelines, refactors, sessions with significant design decisions (e.g., adding a new agent + skill + CLAUDE.md update).

See [TEMPLATE.md](TEMPLATE.md) for both templates.

## Guidelines

Follow these when gathering information and writing the summary:

- **Token efficiency** (`guidelines/token-efficiency.md`): Search before reading, combine operations, scope searches to relevant dirs, don't re-read files already in context. Keep summary prose concise — bullets over paragraphs.
- **Command accuracy** (`guidelines/command-accuracy.md`): Use forward slashes in all paths, verify paths with Glob before referencing them in the summary, copy exact file paths from tool output.

## Instructions

### Step 1: Analyze Current Work

```bash
git status
git diff --stat
git log --oneline -10
```

Review the conversation history to identify:
- What was accomplished (resumes tailored, skills/agents created, web-app changes)
- Key decisions made (positioning, design choices, ATS trade-offs)
- Files created or modified
- New entries added to `applications-log.md` (if a job application was prepared)
- Remaining tasks

### Step 2: Choose Template Tier

- **Lean**: short session, narrow scope, ≤5 files changed
- **Full**: multi-step work, architectural decisions, ≥5 files touched, or any complete application pipeline

### Step 3: Generate Summary File

Use the appropriate template from [TEMPLATE.md](TEMPLATE.md). Group "Completed Work" by category — for this repo good categories are:

- **Application pipeline** (job-postings/, tailored-resumes/, cover-letters/ outputs)
- **Toolkit infrastructure** (.claude/skills/, .claude/agents/, hooks, settings)
- **Web app** (src/, package.json, scripts/)
- **Documentation** (CLAUDE.md, READMEs, applications-log.md)
- **Source data** (resume-data/, docs/resume/)

### Step 4: Create Resume Prompt

The resume prompt should be copy-paste ready and include:
- Context reference to the summary file
- Specific file paths to review first
- Current status and immediate next steps
- Any blockers or decisions needing user input
- A reminder to read `CLAUDE.md` and `applications-log.md` for project state

### Step 5: Session Retrospective (Full template only)

Provide an honest, qualitative assessment:
- **Efficiency**: Good / Fair / Poor with one-sentence justification
- **What went well**: bullets
- **What could improve**: bullets
- **Notable issues**: only if there were actual errors/failures

Do not fabricate token counts, command totals, or scoring numbers. If you can't measure it, don't report it.

### Step 6: Self-Reflection & Memory Update

Review the session for recurring mistakes and persist learnings to auto memory. Runs for **both** Lean and Full summaries.

**What to look for:**
- Commands that failed and had to be retried (wrong flags, missing tools like `pandoc`, bad paths)
- Edit failures requiring multiple attempts
- Patterns you discovered mid-session that would have saved time if known upfront
- Workarounds for tooling quirks (e.g., docx generation, V2 layout fidelity)
- Application-pipeline learnings (e.g., a JD that was filled, an ATS rule that mattered)

**What to do:**
1. Scan the conversation for failed tool calls, error outputs, and retry patterns
2. For each recurring or avoidable mistake, check if it's already in auto memory (`MEMORY.md` or topic files)
3. If not already recorded, write it to the appropriate memory file — concise, actionable, with the fix
4. If an existing memory entry is wrong or outdated, update or remove it

**What NOT to save:**
- One-off typos or trivial mistakes that won't recur
- Session-specific context (current job application details, temporary state)
- Anything that duplicates CLAUDE.md instructions

## Example Usage

When user says: "Let's wrap up for today"

1. Analyze git changes and conversation history
2. Create `.claude/summaries/2026-04-22/2026-04-22T18-30_hpe-application-trial.md`
3. Provide the resume prompt
4. Suggest: "When context gets long, start a new chat with this resume prompt"

## Tips

- Keep summaries focused on a single feature or area
- Include exact file paths for easy navigation
- Note any environmental setup needed (python-docx install, pandoc not available, etc.)
- Flag any blocking issues or decisions made
- For application sessions, always link to the relevant `tailored-resumes/<slug>/` and `cover-letters/<slug>.md` paths
- Reference `CLAUDE.md` for project conventions
- If the summary documents a job application, also note the row added to `applications-log.md`
