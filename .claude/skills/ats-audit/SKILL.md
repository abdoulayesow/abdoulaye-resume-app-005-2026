---
name: ats-audit
description: Score a resume Markdown file against the 2026 ATS / AI-screening checklist. Returns pass/fail per rule, an overall score, and concrete fixes. Run on every tailored resume before submission.
---

# /ats-audit

Scores a resume against the ATS rules baked into `CLAUDE.md`.

## Inputs

- `$ARGUMENTS` = path to a resume Markdown file. Defaults to the most recently modified file under `tailored-resumes/`.

## Procedure

1. **Read** the resume file.
2. **Spawn the `ats-reviewer` agent** with the resume contents and the JD analysis (if available — the slug is in the path).
3. **Write** the audit report to `tailored-resumes/{slug}/ats-audit.md` (or alongside the resume if not in a slug folder).

## Report format

```
# ATS Audit: {filename}
Date: {today}
Overall score: {X}/100  ({Pass ≥80} / {Borderline 60-79} / {Fail <60})

## Format & structure
- [ PASS / FAIL ] Single column (no tables/columns/text boxes in source)
- [ PASS / FAIL ] Standard section headings only
- [ PASS / FAIL ] Section order: Contact → Summary → Skills → Experience → Education → Certifications → Additional
- [ PASS / FAIL ] Standard bullets (- or •); no emoji bullets in body
- [ PASS / FAIL ] Consistent date format (Mon YYYY – Mon YYYY)
- [ PASS / FAIL ] No images/charts/graphics
- [ PASS / FAIL ] No critical info in headers/footers

## Keyword strategy (vs. job-postings/{slug}/analysis.md if available)
- Must-have keywords matched verbatim: X/Y
  - ✅ Matched: {list}
  - ❌ Missing: {list, with note: "Abdoulaye has this skill — should add" / "Honest gap — flag in cover letter"}
- Total distinct relevant keywords: {N} (target 15–25)
- Acronym + full-form pairing: {pass/fail with examples}
- Keyword density check: {pass/fail — flag any term appearing >5x}

## Content quality
- Bullets following Action + Context + Metric: {N}/{total}
  - Weak bullets (no metric): {list line numbers}
- Bullets per role: {OK / over-cap (>6) / under-cap}
- First-person leakage ("I", "my"): {none / list locations}
- Banned cliché audit (passionate / proven track record / etc.): {none / list}

## Verb voice match (vs. JD)
- JD-favored verbs: {lead, drive, own, scale...}
- Resume verb usage matches: {percentage}
- Suggestions: {if mismatch, what to swap}

## Top fixes (ranked by impact)
1. ...
2. ...
3. ...

## Honest gaps (must-have requirements Abdoulaye doesn't have)
- {list — these belong in cover letter framing or are deal-breakers}
```

## Scoring weights

- Format & structure: 30 pts (any FAIL = -5 each)
- Keyword match: 30 pts (X/Y must-haves × 30)
- Content quality: 25 pts
- Verb voice match: 15 pts

## Don't do this

- Don't run AI-detection scoring (e.g., "this looks AI-generated"). Modern ATS doesn't screen for AI authorship of resumes — they score relevance. The user's CLAUDE.md explicitly calls this out.
- Don't suggest keyword stuffing. If a must-have is missing, the answer is "add it once in a real bullet" not "add it five times to the skills list."
- Don't grade subjectively on "tone" — that's the cover letter's job.
