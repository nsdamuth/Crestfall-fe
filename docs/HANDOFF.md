# Handoff

Written 16 Aug 2026, DC1 docs-only close, branch
`design/ed1e-editor-design`.

## Verified state

- **Branch:** `design/ed1e-editor-design`, tip `eb000bd`
  ("design(ed1e): editor design standard, defect catalogue, exemplar
  renders"), tree clean.
- **Cut from:** `design/sprint-h-final` at `ad8e586`
  ("docs(cm1): stale-doc audit for FE-REVIEW-01, add review record").
- **Merged into `sprint-h-final` ahead of `ad8e586`:** chat core C1
  through C6 (`3a2d167`) and the editor's ED1b, ED1c, ED1d passes
  (`7f131c8`, defect pass at `44c5a72`). `design/community-parity`
  (`05e7eae`) was already an ancestor before either merge.
- **FE-REVIEW-01:** closed 15 Aug 2026, disposition APPROVE AFTER
  REVISIONS. The Chassis/Skin boundary is now standing rule
  FE-REVIEW-01 in CLAUDE.md. Full record: `docs/reviews/FE-REVIEW-01.md`.
- **Editor:** contract 4.0.0, hero plus accordion plus ToC rail
  architecture (ED1c, `0c4f453`), defect pass folded (ED1d, `44c5a72`).
  The ED1e design standard (`docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md`)
  catalogues 22 defects and is DRAFT until Brian rules the two gates
  in its section 9. Editor family is frozen from outside edits until
  those gates close.
- **Docs regenerated this pass:** `docs/CRESTFALL-DESIGN-CONTEXT.md`
  (supersedes the 12 Aug 2026 version), this file, and a check of
  `docs/PROJECT-INSTRUCTIONS.md` against CLAUDE.md.

## The immediate next action

Brian rules the two ED1e gates, one at a time, in this order:

1. **Choice 1, field style (Gate 1).** Three renders of the same
   editor section: Quiet (recommended), Gilded, Blended. Contact
   sheet: `docs/review-artifacts/ed1e/ed1e-contact-sheet.html`. Live
   route: `/dev/ui-preview/ed1e-editor-design`.
2. **Choice 2, artwork area (Gate 2), rendered in the Gate 1 pick.**
   Side art cleaned (recommended), Full-width banner, Backdrop hero.
3. **The four law-gap flags**, ruled separately (not gates, no
   sequencing requirement, but do not close ED1e without them): status
   color contrast on `--surface-2/3/4`, field-level error treatment,
   the composed disabled-control recipe, helper text's size token.
   Detail: `docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md` section 10.

## What follows

- **Merge ED1e to trunk** once both gates close and the four flags are
  ruled, expected, verify no additional Brian sign-off step was added
  to the agreed order between now and then.
- **Propagation brief, ED2 onward.** The Sonnet propagation checklist
  (ED1e section 11) applies the ruled recipes across the editor
  family, one package family per commit, each verified at 390 then
  1440 with build exit 0. `docs/ROADMAP.md` Phase 3 lists ED2 (media
  rail) through ED9 (plus K2 JSON consolidation) as the sweep that
  follows.
- **Chat render sitting.** Chat (C1-C6) is merged but not yet reviewed
  running; `docs/ROADMAP.md` Phase 2 has this and a first ultrareview
  pass still unchecked.
- **Nick's payload pack and allowlist.** FE-REVIEW-01 agreed-order
  step 3 (realistic payload pack from Chassis) and step 4 (WP-C
  Chassis contracts and fixtures for the three profiles) are next
  once the SHA freeze (step 2) happens; expected, verify the freeze
  has not already occurred by the time this is read. The `.gitignore`
  allowlist mechanism for any new dev-only files these steps introduce
  is `docs/FRONTEND-SOP.md` section 7.

## Standing rules

- **Filled fixtures required.** FE fixtures ship a filled,
  value-carrying variant, not an empty or placeholder one
  (FE-REVIEW-01).
- **Agents never sign in.** Verification uses the auth-free
  `/dev/ui-preview/*` mirrors and fixture-driven routes only. Seeded
  dev login is approved for dev-scoped human use, not for agents.
- **Chassis logic never moves into Crestfall-fe.** Crestfall owns
  routes and application logic; Crestfall-fe is Views, Kit, tokens,
  fixtures, and page composition only (FE-REVIEW-01, CLAUDE.md).
