# CLAUDE.md

Single entry point, ruled 7 Aug 2026 (Ruling 2). This file carries no
rules of its own. It points. Read it first, every session.

## Read, in this order

1. `docs/DESIGN-TOKENS.md`: token values, roles, legal usage. Law for
   what every color/size/effect means and where it may be written.
2. `docs/FRONTEND-SOP.md`: process law. Repo basics, verification law,
   working with Brian, progressive-context files, parallelism law, QA
   gate, contract law, definition of done, PR checklist, backend
   contract handoff.
3. Any active sprint plan in `docs/` (e.g. `docs/SPRINT-3-PLAN.md`):
   the current phases and manifest.

Those three are the only documents an agent follows as law.

## Standing reference docs

Not law, kept current as living reference material:

- `docs/APP-FUNCTION-MAP.csv`: row-per-control ledger of every page's
  wiring, referenced by `FRONTEND-SOP.md` section 13 (contract law)
  and section 14 (definition of done).
- `docs/APP-FUNCTION-INVENTORY.md`: what the CSV is, how it is
  maintained, and analysis (create/edit field deltas, destination-page
  mapping) that does not fit in a CSV cell.

## Not law

- `docs/RESTYLE-RULES.md`: historical changelog, never cited as an
  execution authority. Its settled content lives in the two law docs
  above.
- `docs/CLOSING-INVENTORY.md`: a work list. Its category LABELS are
  unreliable; its line-level findings are accurate.
- `docs/_legacy-reference/`: historical evidence, gitignored,
  read-only, never edited, deleted at end of sprint.

## Forbidden

- No em dashes anywhere, in code or in docs.
- Never sed or awk on markup or CSS.
- No duplicate instruction files. This file is the only one; any
  other agent-instruction file found in this repo is archived, not
  followed.
- No decision an agent makes for Brian. Design authority, three-option
  gates, and reply vocabulary are defined in `docs/FRONTEND-SOP.md`
  section 9.

## Verification

`docs/FRONTEND-SOP.md` section 8 is the verification law: rendered at
390 then 1440, production build exit 0, zero em dashes in any doc
touched, every finished-task report echoes the brief's manifest part
by part as DONE or STOPPED.

## When a decision is not written down

Stop and report which ruling or queue item is missing. Do not
interpret, guess, or proceed past it. Silence is never approval and is
never ratification.
