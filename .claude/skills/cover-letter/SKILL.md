---
name: cover-letter
description: Draft a 1-page cover letter tailored to a specific job posting, referencing 2-3 of Abdoulaye's most relevant achievements and the JD's stated values/keywords. Outputs to cover-letters/<slug>.md.
---

# /cover-letter

Drafts a tailored cover letter for an application.

## Prerequisites

- `job-postings/{slug}/analysis.md` exists.
- Ideally `tailored-resumes/{slug}/resume.md` also exists (so the cover letter and resume reinforce each other).

## Inputs

- `$ARGUMENTS` should be the slug.

## Procedure

1. **Read** the JD analysis and the tailored resume (or canonical variant if no tailored version yet).

2. **Identify** the hiring manager's name from the JD or `job-postings/{slug}/{posting}.md`. If unknown, use `Dear Hiring Team,`.

3. **Draft** the letter with this structure (~350–450 words, fits on one page):

   ```
   Abdoulaye Sow
   abdoulaye.sow.co@gmail.com | (281) 323-8023
   Conroe, TX 77384 | linkedin.com/in/abdoulaye-sow-44861633

   {Date — today's date}

   {Hiring manager name or "Hiring Team"}
   {Company}

   Dear {name or "Hiring Team"},

   ## Opening (2–3 sentences)
   - Name the role and where it was found.
   - State the single strongest reason Abdoulaye is a fit (the headline alignment between his experience and the must-have).
   - Show genuine interest in the company specifically — reference something concrete (product, mission, recent news), not generic flattery.

   ## Body 1 (4–6 sentences)
   - Tell ONE specific story that maps to the JD's #1 requirement.
   - Use a concrete metric. Lead with outcome, then how.

   ## Body 2 (4–6 sentences)
   - Map a second story to a different must-have or to the company's stated values.
   - Optional: name-drop a relevant cert (PSPO II, SAFe SPC6, PAL-EBM) if the JD asks for it.
   - If the role is AI/ML-adjacent, weave in the published research (arxiv.org/abs/2310.15612).

   ## Close (2–3 sentences)
   - Forward-looking: what excites him about the role/team.
   - Direct call to action: "I'd welcome the chance to discuss how I can contribute to {specific team initiative}."

   Sincerely,
   Abdoulaye Sow
   ```

4. **Write** to `cover-letters/{slug}.md`.

5. **Print** the letter to the user.

## Voice rules

- **First person OK in cover letters** (unlike resumes). Use "I" naturally.
- **No clichés.** Ban: "passionate," "results-driven," "proven track record," "synergy," "thought leader," "team player," "go-getter." If you catch yourself reaching for one, replace with a concrete example.
- **No AI tells.** Avoid "I am writing to express my interest" / "I am thrilled to apply" / "Furthermore" / em-dash chains. Read it aloud — if it sounds like a press release, rewrite.
- **Specific > generic.** "Increased adoption by 45% via EBM-based prioritization" beats "drove significant adoption gains."
- **Match the company's tone.** Formal bank → conservative voice. Series-A startup → tighter, more direct. The JD analysis tells you which.

## What to skip

- No "References available upon request" — implied.
- No salary expectations unless the JD explicitly asks.
- No address of the company (header has the name; no need for "1234 Main St").
- No headers/footers with extra info (parsers ignore them).
