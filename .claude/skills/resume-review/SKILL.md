---
name: resume-review
description: Comprehensive resume review combining mechanical ATS compliance (ats-reviewer agent) AND industry-best-practices human-eye review (resume-coach agent). Run on every tailored resume before submission. Produces a combined report with both scores and actionable fixes ranked by impact.
---

# /resume-review

The full pre-submission gauntlet. Runs **both** reviewers and combines their output:

- **`ats-reviewer`** — mechanical: format, parser-safety, keyword match, content rules
- **`resume-coach`** — human-eye: length, scannability, narrative arc, tone, recruiter perception

## Inputs

- `$ARGUMENTS` = path to a resume Markdown file. Defaults to the most recently modified file under `tailored-resumes/`.

## Procedure

1. **Read** the resume file. Identify the slug (folder name).
2. **Find** the JD analysis at `job-postings/{slug}/analysis.md` if it exists. If not, both reviews run in "no-JD mode."
3. **Spawn `ats-reviewer` agent** with resume + JD analysis. It produces the mechanical audit.
4. **Spawn `resume-coach` agent** in parallel with the same inputs. It produces the human-eye review.
5. **Combine** both into a single report at `tailored-resumes/{slug}/full-review.md` with this structure:

```
# Full Resume Review — {filename}
**Date:** {today}
**Combined score:** {ATS-weighted ~60%} + {Coach-weighted ~40%} = X / 100

## Section 1: ATS Mechanics ({score}/100)
{embed ats-audit.md content here, or link to it}

## Section 2: Industry Best Practices ({score}/100)
{embed resume-coach review content here, or link to it}

## Combined top fixes (deduplicated, ranked by impact)
1. ...
2. ...
3. ...
4. ...
5. ...

## Submission readiness verdict
- ✅ Ready to submit (combined ≥ 80, no HIGH-severity issues)
- ⚠️  Apply top fixes first (combined 65–79, OR any HIGH-severity issue)
- ❌ Major rewrite needed (combined < 65)
```

6. **Print** the verdict and top 3 fixes to the user.

## When to run

- After `/tailor-resume` produces a draft.
- Before regenerating the .docx files for submission.
- Anytime you're not sure if a draft is ready.

## Don't do this

- Don't replace `/ats-audit` — keep it as the lighter mechanical-only check for quick iterations. `/resume-review` is the full pre-submission gauntlet.
- Don't auto-apply the suggested fixes. Always show them to the user and let them choose.
