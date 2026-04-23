---
name: tailor-resume
description: Produce an ATS-optimized tailored resume variant for a specific job posting. Reads the JD analysis, picks a base variant, rewrites the summary, reorders/rewrites bullets to match keywords and verb voice, outputs Markdown to tailored-resumes/<slug>/resume.md.
---

# /tailor-resume

Tailors one of the canonical resume variants to a specific job posting.

## Prerequisites

- `job-postings/{slug}/analysis.md` exists (run `/jd-extract` first if not).

## Inputs

- `$ARGUMENTS` should be the slug (e.g., `acme__senior-product-manager__2026-04-22`). If the user gives the JD path or analysis path, derive the slug from it.

## Procedure

1. **Read** `job-postings/{slug}/analysis.md` and the recommended base variant in `resume-data/`.

2. **Create** `tailored-resumes/{slug}/` if it doesn't exist.

3. **Tailor the resume** per the rules in `CLAUDE.md` (the ATS / AI-screening section is mandatory). Specifically:

   - **Summary**: Rewrite the 4–5 line professional summary to lead with the role's must-have skills, using the JD's verbatim phrasing for the top 3 keywords. Keep it true to Abdoulaye's actual experience.
   - **Core Competencies / Skills**: Reorder so categories most relevant to the JD appear first. Add any missing must-have keywords (only if they're skills Abdoulaye genuinely has — check the canonical variant). Maintain 15–25 distinct keywords total.
   - **Experience bullets**: For each role, keep 4–6 bullets max. Pull from the canonical variant. **Use `resume-bullet-writer` agent** to rewrite the top bullets so they:
     - Mirror the JD's verb language (lead/drive/own/scale/etc.)
     - Inject 1–2 must-have keywords verbatim where it's truthful to do so
     - Keep Action + Context + Metric form
   - **Certifications**: Reorder so JD-relevant certs come first. Drop ones irrelevant to the role (e.g., drop SAFe-heavy certs from a pure PM role if space is tight).
   - **Additional Information**: Trim to what matters for this role (location, languages, citizenship, availability).

4. **Write** the result to `tailored-resumes/{slug}/resume.md`. Use the Markdown structure from the canonical variants (same section order, same heading levels).

5. **Write** `tailored-resumes/{slug}/keywords-matched.md` showing:
   - Must-have keywords from JD → which appear verbatim in the tailored resume → location (Summary / Skills / Experience / Cert).
   - Keywords missing entirely (with a note on whether Abdoulaye has the skill or not).

6. **Run `/ats-audit` automatically** on the new resume and link the output.

7. **Report** to the user:
   - Path to the tailored resume.
   - Match score from keywords-matched.md (X/Y must-haves covered).
   - Any honest gaps where Abdoulaye doesn't have a must-have requirement.

## Hard rules (do not violate)

- **Never invent experience, certs, employers, dates, or metrics.** Tailoring = emphasis + translation. If the JD requires something Abdoulaye doesn't have, **flag the gap honestly** in the report — don't fabricate.
- **Don't drop the published research line** (arxiv.org/abs/2310.15612) if the role is anywhere near AI/ML/data — it's a strong signal.
- **Don't add "Objective" sections.** Modern ATS-friendly resumes use a Summary, not an Objective.
- **Single column. Standard headings. Standard bullets. Plain dates. No emoji bullets in body.** (See CLAUDE.md ATS rules.)

## When to update the canonical variant instead

If you find yourself rewriting the same bullets across multiple tailored versions, that's a signal the canonical variant in `resume-data/` should be updated. Surface this to the user — don't silently drift the canonical file.
