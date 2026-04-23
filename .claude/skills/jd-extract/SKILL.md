---
name: jd-extract
description: Parse a raw job description into a structured analysis (must-have skills, nice-to-have, keywords for ATS matching, seniority signals, culture cues). Run this BEFORE /tailor-resume for any new posting.
---

# /jd-extract

Turns a raw job posting into structured intel that drives the rest of the workflow.

## Inputs

- `$ARGUMENTS` should be the path to a posting under `job-postings/`. If the user gives a URL or pastes raw text instead, save it to `job-postings/{company}__{role}__{YYYY-MM-DD}.md` first (ask the user for company/role if not obvious from the text).

## Procedure

1. **Read the posting.** If it's a URL, use WebFetch to grab it.
2. **Spawn the `jd-analyst` agent** with the posting text. It returns structured intel.
3. **Write the analysis** to `job-postings/{slug}/analysis.md` with these sections:

   ```
   # JD Analysis: {Company} — {Role}

   ## Role essentials
   - Title:
   - Seniority: (junior / mid / senior / staff / principal / director)
   - Location / remote policy:
   - Comp range (if listed):
   - Reporting line (if listed):

   ## Must-have requirements
   (bullet list, verbatim phrasing where possible)

   ## Nice-to-have
   (bullet list)

   ## Keywords for ATS matching (15–25)
   (Use exact JD phrasing. Mark as `KW` for the must-haves to match verbatim.)
   - KW: Agile Release Train
   - KW: Evidence-Based Management
   - ...

   ## Seniority & verb language
   (Verbs the JD favors — "lead, drive, own, scale, ship, partner, influence." Reuse these in tailored bullets.)

   ## Culture / values cues
   (Anything signaling what they value — "bias for action," "customer obsession," regulated industry, startup chaos, etc.)

   ## Which base variant to start from
   - Recommended: `Resume_Agile_Coach.md` OR `Resume_Product_Manager_AI_ML.md`
   - Reasoning: 1-2 sentences

   ## Red flags / concerns (if any)
   ```

4. **Print a one-paragraph summary** to the user so they can confirm before running `/tailor-resume`.

## Notes

- Don't invent requirements not in the posting.
- If the posting is vague ("we want a rockstar"), say so explicitly in the analysis. Vague postings need a more skills-forward tailored variant.
- Default base variant when the JD straddles both: pick the one whose top 3 must-haves overlap more with the variant's core competencies.
