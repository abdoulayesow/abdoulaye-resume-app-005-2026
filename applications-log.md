# Applications Log

A running log of every job application we've prepared in this repo. Most recent first.

## Schema

| Field | Notes |
|---|---|
| Slug | `{company}__{role}__{YYYY-MM-DD}` — used as folder name everywhere |
| Status | `prepared` (artifacts done) → `submitted` → `interview` → `offer` / `rejected` / `withdrawn` |
| Applied | Date the resume + cover letter were submitted |
| Closes | Application deadline if known |
| Match score | From `tailored-resumes/<slug>/ats-audit.md` |
| Notes | Any free-text — referrals, follow-ups, gaps to address in conversations |

---

## Active applications

| Slug | Company | Role | Location | Status | Applied | Closes | Match | Salary band | Notes |
|---|---|---|---|---|---|---|---|---|---|
| `hpe__senior-pm-greenlake-flex__2026-04-22` | HPE | Senior Product Manager, GL Flex Solutions | Hybrid, avg. 2 days/week from an HPE office | submitted | 2026-04-22 | 2026-05-25 | 91/100 | $120,500 – $276,500 | First trial run. CPQ is the biggest gap — frame in cover letter as fast-learn / adjacent experience. Role 2 retitle (Senior Agile Coach & Product Practice Lead) applied before submission. |

---

## Closed applications

*(none yet)*

---

## How to update

- After a new application is prepared (artifacts written), add a row above with status `prepared`.
- When you submit, change status to `submitted` and fill the `Applied` date.
- When the outcome lands, move the row to **Closed applications** with the final status.
- Keep `Notes` short — full detail lives in `tailored-resumes/<slug>/` and `cover-letters/<slug>.md`.
