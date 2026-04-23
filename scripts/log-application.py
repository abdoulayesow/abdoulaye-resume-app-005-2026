#!/usr/bin/env python3
"""Insert or update a row in applications-log.md from a slug's JD analysis + ATS audit.

For each application slug, reads the JD analysis and ATS audit, then upserts a row
in applications-log.md under "Active applications" with status=prepared.

Usage:
  python3 scripts/log-application.py <slug>

Example:
  python3 scripts/log-application.py hpe__senior-pm-greenlake-flex__2026-04-22

Reads:
  job-postings/<slug>/analysis.md       Company, Role (H1), Location, Closes, Salary band
  tailored-resumes/<slug>/ats-audit.md  Match score from "Overall score: N/100"

Writes (idempotent):
  applications-log.md  inserts a row in "Active applications"; updates in place
                       if a row with the same slug already exists.

Exit codes:
  0  success
  2  missing input file
  3  parse failure
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
LOG_PATH = REPO_ROOT / "applications-log.md"
SLUG_PATTERN = re.compile(r"^[a-z0-9-]+__[a-z0-9-]+__\d{4}-\d{2}-\d{2}$")
TABLE_SEPARATOR_PATTERN = re.compile(r"\s*\|[\s|:\-]+\|\s*$")


def strip_bold(s: str) -> str:
    return re.sub(r"\*+", "", s)


def read_file(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return None


def grab_field(text: str, label_pattern: str) -> str | None:
    """Return the value after `- {label}:` on a single line, with or without bold.

    Accepts both `- **Location / remote policy:** value` and `- Location: value`.
    """
    bolded = rf"^-\s*\*\*{label_pattern}[^*]*\*\*:?\s*(.+?)$"
    plain = rf"^-\s*{label_pattern}[^\n]*?:\s*(.+?)$"
    m = re.search(bolded, text, re.MULTILINE) or re.search(plain, text, re.MULTILINE)
    return m.group(1).strip() if m else None


def parse_analysis(text: str) -> dict[str, str]:
    """Extract Company, Role, Location, Closes, Salary band from analysis.md."""
    out: dict[str, str] = {}

    # Prefer em-dash / en-dash (used by the canonical JD analysis format); fall back
    # to space-hyphen-space only if neither is present, so company/role names that
    # contain hyphens don't get split at the wrong point.
    h1 = re.search(r"^#\s+JD Analysis:\s*(.+?)\s+[—–]\s+(.+?)\s*$", text, re.MULTILINE)
    if h1 is None:
        h1 = re.search(r"^#\s+JD Analysis:\s*(.+?)\s+-\s+(.+?)\s*$", text, re.MULTILINE)
    if h1:
        out["company"] = h1.group(1).strip()
        out["role"] = h1.group(2).strip()

    loc = grab_field(text, r"Location")
    if loc:
        loc = strip_bold(loc)
        # Split on period followed by whitespace + uppercase letter (sentence boundary
        # heuristic that survives "avg.", "e.g.", "etc.").
        parts = re.split(r"\.(?=\s+[A-Z])", loc, maxsplit=1)
        loc = parts[0].strip().rstrip(",;:")
        if len(loc) > 60:
            loc = loc[:57].rstrip() + "..."
        out["location"] = loc

    closes_line = grab_field(text, r"Application closes") or grab_field(text, r"Closes")
    if closes_line:
        date_m = re.search(r"\d{4}-\d{2}-\d{2}", closes_line)
        if date_m:
            out["closes"] = date_m.group(0)

    comp_line = grab_field(text, r"Comp range") or grab_field(text, r"Comp")
    if comp_line:
        comp_clean = strip_bold(comp_line)
        range_m = re.search(
            r"\$[\d,]+(?:\.\d+)?\s*[KkMm]?\s*[–\-]\s*\$[\d,]+(?:\.\d+)?\s*[KkMm]?",
            comp_clean,
        )
        out["salary"] = range_m.group(0).strip() if range_m else comp_clean[:40].strip()

    return out


def parse_ats_score(text: str) -> str | None:
    """Extract score from a line like 'Overall score: **91 / 100**'."""
    m = re.search(r"Overall score:\s*\**\s*(\d+)\s*/\s*100", text)
    return f"{m.group(1)}/100" if m else None


def build_row(slug: str, fields: dict[str, str]) -> str:
    cols = [
        f"`{slug}`",
        fields.get("company", "TBD"),
        fields.get("role", "TBD"),
        fields.get("location", "TBD"),
        "prepared",
        "—",
        fields.get("closes", "—"),
        fields.get("match", "TBD"),
        fields.get("salary", "—"),
        "",
    ]
    return "| " + " | ".join(cols) + " |"


PRESERVED_COLUMNS = {"Status", "Applied", "Notes"}
COLUMN_ORDER = [
    "Slug", "Company", "Role", "Location",
    "Status", "Applied", "Closes", "Match", "Salary band", "Notes",
]


def split_row(row: str) -> list[str]:
    """Split a Markdown table row into its cell values, trimmed."""
    inner = row.strip()
    if inner.startswith("|"):
        inner = inner[1:]
    if inner.endswith("|"):
        inner = inner[:-1]
    return [c.strip() for c in inner.split("|")]


def merge_row(existing: str, fresh: str) -> str:
    """Merge `fresh` into `existing`, preserving user-managed columns.

    Status, Applied, Notes are kept from existing (so user edits aren't clobbered).
    All other columns are taken from fresh (re-extracted from analysis.md / ats-audit.md).
    """
    existing_cells = split_row(existing)
    fresh_cells = split_row(fresh)
    if len(existing_cells) != len(COLUMN_ORDER) or len(fresh_cells) != len(COLUMN_ORDER):
        return fresh
    merged = [
        existing_cells[i] if COLUMN_ORDER[i] in PRESERVED_COLUMNS else fresh_cells[i]
        for i in range(len(COLUMN_ORDER))
    ]
    return "| " + " | ".join(merged) + " |"


def upsert_row(log_text: str, slug: str, new_row: str) -> str | None:
    """Insert new_row under '## Active applications', or update an existing row.

    Updates only happen for rows in the Active section — rows in Closed (or any
    other section) are left untouched even if they share the slug, since closed
    applications shouldn't be revived by re-running /apply.

    On update: preserves user-managed columns (Status, Applied, Notes). Refreshes
    Company / Role / Location / Closes / Match / Salary band from `new_row`.

    Returns the new log text, or None if the Active section couldn't be located
    and no Active-section row matched.
    """
    lines = log_text.splitlines()
    slug_pattern = re.compile(rf"\|\s*`{re.escape(slug)}`\s*\|")

    # First pass: find whether an Active-section row exists for this slug.
    in_active_scan = False
    has_active_row = False
    for line in lines:
        stripped = line.strip()
        if stripped.lower() == "## active applications":
            in_active_scan = True
            continue
        if in_active_scan and stripped.startswith("## "):
            in_active_scan = False
            continue
        if in_active_scan and slug_pattern.search(line):
            has_active_row = True
            break

    out: list[str] = []
    in_active = False
    done = False  # set once we've either replaced an existing row or inserted a new one

    for line in lines:
        stripped = line.strip()
        if stripped.lower() == "## active applications":
            in_active = True
            out.append(line)
            continue

        if in_active and stripped.startswith("## "):
            in_active = False
            out.append(line)
            continue

        if in_active and slug_pattern.search(line):
            if not done:
                out.append(merge_row(line, new_row))
                done = True
            # Drop additional duplicate rows in the Active section (de-dupe).
            continue

        if (
            in_active
            and not has_active_row
            and not done
            and TABLE_SEPARATOR_PATTERN.match(line)
        ):
            out.append(line)
            out.append(new_row)
            done = True
            continue

        out.append(line)

    if not done:
        return None

    trailing = "\n" if log_text.endswith("\n") else ""
    return "\n".join(out) + trailing


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__, file=sys.stderr)
        return 2
    slug = sys.argv[1]

    if not SLUG_PATTERN.fullmatch(slug):
        print(
            f"invalid slug: {slug!r} (expected {{company}}__{{role}}__YYYY-MM-DD)",
            file=sys.stderr,
        )
        return 2

    analysis_path = REPO_ROOT / "job-postings" / slug / "analysis.md"
    audit_path = REPO_ROOT / "tailored-resumes" / slug / "ats-audit.md"

    analysis_text = read_file(analysis_path)
    if analysis_text is None:
        print(f"missing: {analysis_path}", file=sys.stderr)
        return 2

    audit_text = read_file(audit_path)
    if audit_text is None:
        print(f"missing: {audit_path}", file=sys.stderr)
        return 2

    log_text = read_file(LOG_PATH)
    if log_text is None:
        print(f"missing: {LOG_PATH}", file=sys.stderr)
        return 2

    fields = parse_analysis(analysis_text)
    if not fields.get("company") or not fields.get("role"):
        print(f"could not parse Company/Role H1 from {analysis_path}", file=sys.stderr)
        return 3

    score = parse_ats_score(audit_text)
    if score:
        fields["match"] = score

    row = build_row(slug, fields)
    new_log = upsert_row(log_text, slug, row)
    if new_log is None:
        print(
            f"could not locate '## Active applications' section in {LOG_PATH}",
            file=sys.stderr,
        )
        return 3

    LOG_PATH.write_text(new_log, encoding="utf-8")
    rel = LOG_PATH.relative_to(REPO_ROOT)
    print(f"updated {rel}")
    print(f"  row: {row}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
