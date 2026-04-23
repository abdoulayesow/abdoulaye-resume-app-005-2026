---
name: apply
description: End-to-end resume tailoring pipeline. Takes a JD path, URL, or slug and chains /jd-extract → /tailor-resume → /resume-review → /cover-letter → .docx build → applications-log update. Stops for two human checkpoints (after JD analysis, after review). Replaces running 5 separate slash commands manually.
---

# /apply

The single-command application pipeline. Two human checkpoints, then artifacts and a logged row.

## When to use this vs the individual skills

- **Use `/apply`** for new applications. It's the one-shot pipeline.
- **Use the individual skills** (`/jd-extract`, `/tailor-resume`, `/resume-review`, `/cover-letter`) for single-step iteration, or to recover from a failed `/apply` run.

## Inputs

`$ARGUMENTS` is one of:
- A URL — `https://careers.acme.com/jobs/12345`
- A path to a saved JD — `job-postings/acme__pm__2026-04-22.md`
- A bare slug — `acme__senior-product-manager__2026-04-22` (must already have `job-postings/{slug}/analysis.md`)

If empty, print usage and abort:
```
Usage: /apply <jd-path-or-url-or-slug>
Examples:
  /apply https://jobs.example.com/123
  /apply job-postings/acme__pm__2026-04-22.md
  /apply acme__pm__2026-04-22
```

## Pipeline

### Step 0 — Resolve argument and detect resume point

Classify `$ARGUMENTS`:

- Matches `^https?://` → **URL**. Pass to Step 1.
- Matches `^job-postings/.+\.md$` and the file exists → **path**. Pass to Step 1.
- Matches `^[a-z0-9-]+__[a-z0-9-]+__\d{4}-\d{2}-\d{2}$` → **slug**. Require `job-postings/{slug}/analysis.md` to exist; if not, abort with: "Slug given but no JD found at `job-postings/{slug}/analysis.md` — pass the JD path or URL instead."
- Otherwise → abort with usage.

If the slug is known (from path or bare slug input), check existing artifacts and **skip ahead** to the first not-yet-completed step:

| Artifact present | Jump to |
|---|---|
| `cover-letters/{slug}.docx` | Step 7 (final summary only) |
| `cover-letters/{slug}.md` | Step 5 (rebuild .docx, then log) |
| `tailored-resumes/{slug}/full-review.md` | Pause 2 |
| `tailored-resumes/{slug}/resume.md` | Step 3 |
| `job-postings/{slug}/analysis.md` | Pause 1 |
| (none) | Step 1 |

The filesystem is the state — there is no separate checkpoint file. To force a redo, the user deletes the artifact (e.g., `rm tailored-resumes/{slug}/full-review.md`) and re-runs `/apply {slug}`.

### Step 1 — JD extraction

Invoke `/jd-extract <input>` using the SlashCommand tool. After it completes, locate the produced `job-postings/{slug}/analysis.md` (the slug may be derived inside `/jd-extract`; if unknown, find the most recently modified `job-postings/*/analysis.md`). Bind `slug` for the rest of the pipeline.

If `analysis.md` doesn't exist after the call, abort: "JD extraction failed — see above." Do not continue.

### Pause 1 — go/no-go before tailoring

Read `job-postings/{slug}/analysis.md` and print, **verbatim**:

```
============================================================
PAUSE 1 of 2 — Confirm before tailoring
============================================================

JD: {Company} — {Role}
Location: {value from "Role essentials"}
Comp: {value or "not listed"}
Seniority: {value}
Closes: {value or "not listed"}

Recommended base variant: {value from "Which base variant to start from"}
Reasoning: {1-line summary}

Honest gaps (must-haves Abdoulaye doesn't have):
  - {gap 1}
  - {gap 2}
  (or "none flagged")

Red flags / concerns:
  - {concern 1}
  (or "none")

============================================================
Proceed with tailoring? Reply:
  y      → continue to /tailor-resume
  n      → abort (analysis.md is preserved)
  edit   → describe what to change in the analysis, then we'll re-prompt
============================================================
```

Then **end the turn**. Do not call any further tools. The user's next message is the response.

When the user replies:
- `y` / `yes` / `proceed` → Step 2.
- `n` / `no` / `stop` / `abort` → print "Aborted at Pause 1. Artifacts preserved at `job-postings/{slug}/analysis.md`." and stop.
- `edit` plus instructions, OR any other text → treat as edit instructions, apply with the Edit tool to `analysis.md`, re-print the Pause 1 block, prompt again.

### Step 2 — tailor the resume

Invoke `/tailor-resume {slug}`. This skill internally spawns `resume-bullet-writer` and auto-runs `/ats-audit` per its SKILL.md.

Verify `tailored-resumes/{slug}/resume.md` exists; abort if not. Warn (do not abort) if `keywords-matched.md` or `ats-audit.md` are missing.

### Step 3 — full review

Invoke `/resume-review tailored-resumes/{slug}/resume.md`. This skill spawns `ats-reviewer` + `resume-coach` in parallel and writes `tailored-resumes/{slug}/full-review.md`.

Verify the file exists; abort if not. Parse the combined score and the "Combined top fixes" block from the report.

### Pause 2 — review fixes before cover letter

Print, **verbatim**:

```
============================================================
PAUSE 2 of 2 — Review fixes before cover letter
============================================================

Combined review score: {N}/100
Verdict: {from full-review.md}

Top 3 fixes:
  1. {fix 1}
  2. {fix 2}
  3. {fix 3}

Full report: tailored-resumes/{slug}/full-review.md

============================================================
Apply the top 3 auto-fixes to resume.md? Reply:
  y          → re-run /tailor-resume with the fixes baked in
  n          → skip; proceed to cover letter with resume as-is
  show diff  → preview what would change, then re-prompt
============================================================
```

Then **end the turn**.

When the user replies:

- `n` / `no` / `skip` → continue to Step 4.

- `y` / `yes` / `apply` → **auto-fix flow**:
  1. `cp tailored-resumes/{slug}/resume.md tailored-resumes/{slug}/resume.pre-fix.md` (backup).
  2. Re-invoke `/tailor-resume {slug}` with an inline directive appended to the call:
     ```
     Apply these specific fixes from the resume-review:
       1. {fix 1}
       2. {fix 2}
       3. {fix 3}
     ```
  3. Re-run `/ats-audit tailored-resumes/{slug}/resume.md` so `ats-audit.md` reflects the post-fix state.
  4. **Do NOT re-run `/resume-review`** — it would loop back to Pause 2.
  5. Continue to Step 4.

- `show diff` / `diff` → write the proposed rewrite to `tailored-resumes/{slug}/resume.proposed.md` (don't touch `resume.md` yet), run `diff -u tailored-resumes/{slug}/resume.md tailored-resumes/{slug}/resume.proposed.md`, print the diff, re-prompt y/n. On final `y`: `mv resume.proposed.md resume.md`. On `n`: `rm resume.proposed.md`. Then continue to Step 4.

### Step 4 — cover letter

Invoke `/cover-letter {slug}`. Verify `cover-letters/{slug}.md` exists; abort if not.

### Step 5 — build .docx artifacts

Run via Bash: `python3 scripts/build-application-docx.py {slug}`.

Treat any non-zero exit as fatal — print stderr and stop. On success, three files exist:
- `tailored-resumes/{slug}/resume.docx`
- `tailored-resumes/{slug}/resume-ats.docx`
- `cover-letters/{slug}.docx`

### Step 6 — update applications-log

Run via Bash: `python3 scripts/log-application.py {slug}`.

This is **non-fatal**. The script preserves any existing user-managed columns (Status, Applied, Notes); on first insert, defaults are status=prepared, applied=—, notes=blank.

If the script exits non-zero, print the warning and the row that would have been added (parse it from the script's stdout) so the user can paste it manually. Continue to Step 7.

### Step 7 — final summary

Print:

```
============================================================
Application prepared: {Company} — {Role}
============================================================

Artifacts:
  - job-postings/{slug}/analysis.md
  - tailored-resumes/{slug}/resume.md
  - tailored-resumes/{slug}/keywords-matched.md
  - tailored-resumes/{slug}/ats-audit.md
  - tailored-resumes/{slug}/full-review.md
  - tailored-resumes/{slug}/resume.docx        (V2-styled, for human/recruiter sharing)
  - tailored-resumes/{slug}/resume-ats.docx    (single-column, for portal upload)
  - cover-letters/{slug}.md
  - cover-letters/{slug}.docx

Combined review score: {N}/100
Verdict: {Ready to submit | Apply top fixes first | Major rewrite needed}
Logged in applications-log.md as: prepared

Next:
  1. Review the .docx files in Word/Pages.
  2. Upload resume-ats.docx + cover.docx via the portal.
  3. When submitted, edit applications-log.md: change status to "submitted" and set the Applied date.
============================================================
```

If the auto-fix flow ran in Pause 2, also include this line above "Next:":
```
Backup of pre-fix resume preserved at: tailored-resumes/{slug}/resume.pre-fix.md
```

## Recovery

If a step fails partway, the user can re-run `/apply {slug}` and the resume detection in Step 0 will pick up at the next missing artifact. To force a redo of a step, delete its output:

```
rm tailored-resumes/{slug}/full-review.md   # forces Step 3 to re-run
rm cover-letters/{slug}.md                  # forces Step 4 to re-run
```

For the specific case where `/resume-review` crashes mid-Step-3, fall back to the lighter `/ats-audit tailored-resumes/{slug}/resume.md` to get at least the mechanical score, then proceed manually with `/cover-letter {slug}` and `python3 scripts/build-application-docx.py {slug}`.

## Hard rules

- **Never skip the pauses.** Both checkpoints exist for a reason — see `docs/AUTOMATION_ROADMAP.md`. There is no `--no-pause` flag.
- **Never re-run `/resume-review` inside the auto-fix flow.** It would loop back to Pause 2.
- **Never overwrite `resume.pre-fix.md`** if it already exists — that would destroy the only undo path. If a second auto-fix runs in the same slug, suffix the new backup (`resume.pre-fix-2.md`).
- **Never auto-flip the log row to `submitted`.** Status flips are user actions; the script only writes `prepared` on insert.
