# Automation Roadmap

How we evolve this repo from "manual skill invocation" toward "drop a JD, get a submission-ready application." Documented 2026-04-22 after the HPE trial run.

## Guiding principle

**Automate the mechanical work; keep the human in the loop at the judgment points.**

Resumes and cover letters affect your livelihood. Pure lights-out automation removes the critic who catches the 1-in-10 weird outputs ("that bullet sounds like overclaiming," "we shouldn't apply to this one"). Best practice: cut first-draft time from 2 hours to 5 minutes, but keep two checkpoints where you confirm before continuing.

---

## Phase 1 — `/apply` orchestrator (next, ~20 min to build)

A single slash command that takes a JD path or URL and runs the full pipeline.

### Flow

```
/apply <jd-path-or-url>
  ↓
[Step 1] jd-analyst agent       → job-postings/<slug>/analysis.md
  ↓
🛑 PAUSE 1: print positioning recommendation + honest gaps + "proceed? [y/n/edit]"
  ↓ (user confirms)
[Step 2] tailor-resume + resume-bullet-writer (parallel)  → tailored-resumes/<slug>/resume.md
                                                          → tailored-resumes/<slug>/keywords-matched.md
  ↓
[Step 3] /resume-review (ats-reviewer + resume-coach in parallel)
                                                          → tailored-resumes/<slug>/full-review.md
  ↓
🛑 PAUSE 2: print combined score + top 3 fixes + "apply auto-fixes? [y/n/show diff]"
  ↓ (user confirms or skips)
[Step 4] cover-letter agent     → cover-letters/<slug>.md
[Step 5] build-application-docx.py  → resume.docx, resume-ats.docx, cover.docx
[Step 6] applications-log.md update → status: prepared
  ↓
✅ DONE — print all artifact paths + final verdict
```

### Why two checkpoints (and only two)

- **PAUSE 1** before tailoring is cheap to defer. If the JD is wrong (toxic language, scope mismatch, deal-breaker location), we save the entire tailoring/review/letter cycle.
- **PAUSE 2** before the cover letter lets you accept/reject the suggested fixes from the reviewer agents. The cover letter often needs the resume to be final-state to reference correctly.
- More checkpoints = friction. Fewer = pure-automation risk we explicitly chose not to take.

### Build steps

1. New skill at `.claude/skills/apply/SKILL.md` — orchestrates the pipeline
2. CLAUDE.md update to reference `/apply`
3. (Optional) update `applications-log.md` schema to include "match score" auto-populated from the audit

---

## Phase 2 — auto-trigger hook (~5 min to add)

Drop a JD into `job-postings/`, the harness auto-runs `/apply` on it. Zero-command pipeline.

### Implementation

In `.claude/settings.local.json`:

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "scripts/maybe-auto-apply.sh \"$CLAUDE_TOOL_PATH\""
          }
        ]
      }
    ]
  }
}
```

`scripts/maybe-auto-apply.sh` checks if the written path matches `job-postings/*.md` (and not the README), then prints a one-line note suggesting `/apply <path>`. We don't auto-execute slash commands from hooks (security boundary), but we surface the next action.

If you want truly hands-off, the hook can shell out to `claude --print --slash-command "/apply ..."` headless mode — but that's Phase 4 territory.

---

## Phase 3 — interview-prep skill (~30 min to build, fires on status flip)

When `applications-log.md` row flips from `prepared` → `submitted`, run `/interview-prep <slug>`:

- Drafts likely interview questions for the role (technical, behavioral, scenario)
- Provides STAR-format answers pulled from the resume bullets
- Suggests 5 questions to ask the interviewer (tailored to the company's culture cues from `analysis.md`)
- Outputs to `interview-prep/<slug>.md`

Why useful: turns the hardest interview prep into a 10-minute review of pre-tailored material.

---

## Phase 4 — Gmail-driven status sync (existing MCP, ~1 hour)

The Gmail MCP is already connected in this session's environment. A skill (`/sync-application-status`) could:

1. Read inbox for emails matching `from:noreply@hpe.com OR subject:"Your application"` etc.
2. Extract company name + status keywords ("received," "interview," "rejected")
3. Auto-update the corresponding row in `applications-log.md`
4. Move closed applications from "Active" to "Closed" section

Skip until you have ≥5 active applications and the manual tracking gets painful.

---

## Phase 5 — weekly batch JD scan (using `/schedule`)

Anthropic's `/schedule` skill is in this Claude Code install. It can run a scheduled remote agent (cron). Use it to:

1. Every Monday 8am, scan a saved set of LinkedIn job-search URLs
2. Run a lightweight `/jd-extract` on each new posting
3. Score positioning fit against your canonical resumes (just the recommendation step, no full tailoring)
4. Send you a digest email: "5 new this week, top 2 worth /applying to"

You only run `/apply` on the top 1–2. Cuts your search-and-decide time from "scroll LinkedIn for an hour" to "open 1 email per week."

---

## What we deliberately won't build

- **Full lights-out automation** — would skip both human checkpoints. Not recommended.
- **AI-detection-bypass tooling** — modern ATS doesn't screen resumes for AI authorship; spending energy "humanizing" is wasted. CLAUDE.md already calls this out.
- **Fancy templated UIs** — V2_McDonald's-styled `.docx` is the ceiling on visual investment per application. Time-to-submit > pixel-perfect layouts.
- **Notion / Airtable / external project management** — `applications-log.md` in Markdown is the source of truth. Stays simple, stays in repo, stays git-versioned.

---

## Recommended build order

| Phase | Effort | Payoff | When |
|---|---|---|---|
| 1. `/apply` orchestrator | 20 min | High — collapses 5 commands → 1 | **Build now** |
| 2. Auto-trigger hook | 5 min | Medium — drops the explicit invocation | After Phase 1 ships |
| 3. Interview prep skill | 30 min | Medium — only matters once you start interviewing | When first interview is scheduled |
| 4. Gmail status sync | 1 hr | Low until volume — high once tracking ≥5 active apps | When manual log updates feel painful |
| 5. Weekly batch JD scan | 2 hr | Medium — depends on how actively you're searching | When you want to be more deliberate about volume |

**Recommendation:** ship Phase 1 immediately. Defer 2–5 until each individually feels worth the friction.

---

## Decision log

| Date | Decision | Reason |
|---|---|---|
| 2026-04-22 | Two human checkpoints in `/apply`, not zero | Resume content quality requires human judgment at "is this true?" and "should we apply?" moments |
| 2026-04-22 | `applications-log.md` stays in Markdown, not Notion/Airtable | Source of truth in repo, git-versioned, no extra tools to learn |
| 2026-04-22 | Don't generate visual `.docx` templates beyond V2_McDonald's style | Diminishing returns; time better spent on content quality and per-app tailoring |
| 2026-04-22 | Skip AI-detection-bypass tooling | Modern ATS scores relevance, not authorship; waste of effort |
