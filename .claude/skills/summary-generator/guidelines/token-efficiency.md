# Token Efficiency Guidelines

Reduce token usage while maintaining quality. Efficiency = maximizing value per token.

## Core Rules

1. **Search before reading** — Use Grep/Glob to find what you need, then Read targeted sections
2. **Read once, reference later** — Don't re-read files already in context; reference conversation memory
3. **Be concise** — Bullets over paragraphs, explain "why" not "what"
4. **Combine operations** — Use brace expansion (`**/*.{ts,tsx,md}`) and regex alternation
5. **Use agents for complex exploration** — One Explore-agent spawn beats 10 manual searches

## File Operations

**Do:**
- `Grep pattern="functionName" path="src/"` then `Read file.ts offset=50 limit=20`
- Use `offset`/`limit` for large files (e.g., long resume Markdown)
- Trust earlier reads — only re-read if the file may have changed
- For .docx-converted Markdown in `resume-data/source-docx-md/`, read once and reference

**Don't:**
- Read the same large file multiple times in one session
- Read entire files when Grep answers the question
- Read generated files (`node_modules`, `dist`, `*.docx` binaries)

## Search Operations

**Do:**
- `Glob pattern="**/*.{md,tsx,ts}"` (one search, not three)
- `Grep pattern="(PSPO II|SAFe SPC6|PAL-EBM)" path="resume-data/"` (one search, not three)
- Scope searches to relevant directories (`src/`, `resume-data/`, `tailored-resumes/`)

**Don't:**
- Run sequential similar globs/greps that could be combined
- Search the entire codebase when you know the subdirectory
- Re-grep for things you already found

## Responses

**Do:**
- `"Trim landed: 40→20 bullets, 126→88 lines"` (~10 tokens)
- Explain decisions, not actions — tool calls are self-evident in the transcript

**Don't:**
- Multi-paragraph explanations for simple changes
- Re-explain concepts already established in conversation
- Narrate every tool call before making it

## Code & Content Generation

**Do:**
- Read patterns first (CLAUDE.md, existing skills/agents), generate complete content in one pass
- Include all sections, formatting, and details — no placeholders to revisit later
- For tailored resumes, write the full Markdown in one Write call rather than incrementally

**Don't:**
- Generate incrementally (heading, then summary, then experience…)
- Guess at structure then fix mismatches — read existing variants first

## Planning

**Do:**
- Understand requirements → ask clarifying questions only when blocking → plan → execute
- Reference `CLAUDE.md`, `applications-log.md`, and existing skills already in context

**Don't:**
- Trial-and-error tailoring (generate → mismatch → regenerate → mismatch)
- Re-establish information already present in the conversation

## Quick Checklist

- [ ] Used Grep before Read when searching
- [ ] Avoided re-reading the same file
- [ ] Combined similar search patterns
- [ ] Scoped searches to relevant directories
- [ ] Kept responses concise
- [ ] Read patterns/templates before generating new content
- [ ] Referenced earlier context instead of re-reading
