# Frontend SOP: locked practice for new work

Written 7 Aug 2026 by the Sprint 3 planning run. This is the standing
operating procedure for every NEW frontend module and every PR that
touches frontend code. Token values and roles live in
`docs/DESIGN-TOKENS.md`; this file governs process. Where a rule here
came from a prior document, the source is cited so the lineage survives
the merge.

The reason this file exists: the design system was written down once
and then not followed, because its rules were prose nobody could check.
Every rule below is stated as a condition someone can verify with a
command, a path, or a yes/no question.

## 1. New module protocol

The birth checklist for any new component. A module is not started, not
"mostly done", until every line answers yes. Shape and boundaries per
`docs/_legacy-reference/docs/architecture/CRESTFALL_LOOM_PATTERN.md`
(the one legacy doc the live repo fully implements; fold its content
forward before the legacy folder is deleted).

1. LOOM shape exists. Check: the feature folder contains all five files
   plus the Shell one level up:
   `FeatureName.view.jsx`, `useFeatureNameViewModel.js`,
   `FeatureName.contract.js`, `FeatureName.fixtures.js`, `README.md`,
   and `../FeatureName.jsx`.
2. The View is stateless presentation. Check:
   `grep -nE 'useEffect|fetch\(|axios|supabase|@/lib/(client|server)' <Feature>.view.jsx`
   returns nothing (presentation-only local state such as a tooltip
   toggle is the only sanctioned `useState`).
3. Every prop access is defensive. Check: inline destructuring defaults
   on every prop and optional chaining on every nested access; callbacks
   invoked as `onX?.()`. Source: LOOM view hard rules,
   design-system CLAUDE.md.
4. The contract exports its version on line 1. Check: line 1 of
   `FeatureName.contract.js` matches
   `export const .*CONTRACT_VERSION`. (The version string FORMAT is
   an open ruling, queue item T14: semver vs dotted-name. Match the
   package family you sit in until it is ruled.)
5. Fixtures cover the meaningful states. Check: fixtures file exports at
   least default, empty, error, loading (where async exists), and a
   longest-content case. Source: CRESTFALL_LOOM_PATTERN.md section 6.
6. The preview route exists BEFORE the component ships to a page.
   Check: `app/dev/ui-preview/<feature-name>/page.jsx` exists and
   returns `notFound()` in production.
7. Tokens only. Check: every detection command in
   `docs/DESIGN-TOKENS.md` "Out of contract" returns nothing for the
   new files.
8. Definition of done: the preview route has been rendered at 390 and
   1440, in every fixture state, with zero horizontal overflow, zero
   clipped UI, and zero console errors; and a production build exits 0.
9. The function map row exists. Check: every control the module ships
   has a row in `docs/APP-FUNCTION-MAP.csv` and the markdown rollup was
   regenerated in the same commit.
10. If the module talks to the backend, its contract is signed per
    section 5 before any code targets it.

## 2. Standing constraints

Run from the repo root. Product scope is `components/` and `app/`
excluding `app/dev/ui-preview/` (harness, never product; never edited
to fix a visual problem; never judged as product. Source: legacy
UIUX-repo AGENTS.md, preview-harness rules, carried forward here).

- No raw hex outside the token files.
  `grep -rn '#[0-9a-fA-F]\{6\}' components/ --include='*.jsx' | grep -v fixtures` must return nothing for NEW code.
- No raw opacity on panel chrome.
  `grep -rnE 'bg-(black|white)/[0-9]+' components/ --include='*.view.jsx'` must not grow.
- No type below 11px.
  `grep -rnE 'text-\[(10|9|8)px\]' components/` must not grow, and is
  zero for new modules.
- Minimum touch targets 44px. Check: every interactive control resolves
  to `--control-md` (44px) or larger at coarse pointers;
  `--control-sm` (32px) is desktop-dense chrome only.
- Mobile first at 390: single column, no horizontal overflow, no
  clipped UI, popovers fully inside the viewport, readable without
  zoom. Check: rendered at 390 before 1440, every fixture state.
- Focus is visible everywhere. Check: no `outline-none` without the
  global `--focus-ring` rule or the sanctioned `cf-field` variant
  applying; `grep -rn 'focus:outline-none' components/` hits are
  reviewed against `app/design-system.css:165-176`.
- Reduced motion respected. Check: any new `animation:` or long
  `transition:` ships a `prefers-reduced-motion` rule.
- No em dashes in code or docs. Check: `grep -rn $'\xe2\x80\x94' docs/ components/ app/ --include='*.md' --include='*.jsx' --include='*.js'`
  returns nothing outside `docs/_legacy-reference/` and generated audit
  artifacts.
- Anti-slop list (source: design-system CLAUDE.md, carried forward):
  no purple-to-cyan gradients, no glassmorphism, no emoji in product
  UI, no font weight 800 or 900, no numbered markers on non-sequential
  content, no gradient outside the sanctioned `--grad-*` list.
- Copy hygiene (source: proof.css, carried forward as a live rule
  because the live app lost it): headings `text-wrap: balance`, body
  `text-wrap: pretty`, `touch-action: manipulation` on controls; a skip
  link on every full page.
- Never sed or awk on markup or CSS.
- Views never fake application state. A missing backend is stubbed
  honestly (visible "Soon" or hidden per the HIDE/STUB call in
  section 5), never simulated. Source: SOL-HANDOFF.md and
  LOOM-TRANSITION.md, carried forward.
- Nothing is ruled by silence. An unanswered question stays open and
  the work routes around it. Source: every prior instruction set,
  unanimous on this one point.

## 3. The PR checklist

Copy this block into every pull request that touches frontend code.
Every line is yes/no and answerable in under a minute.

```
DESIGN-LAW CHECKLIST (all must be YES)
[ ] Out-of-contract greps (DESIGN-TOKENS.md section "Out of contract")
    return no NEW hits for the files in this PR
[ ] Every new visual value resolves through a var(--token)
[ ] No new type below 11px, no new bg-black/NN panel fill,
    no new Tailwind default shadow on a floating surface
[ ] Radius follows the tier test: floating or full-width = radius-lg,
    grid sibling or control = radius-md, tag or icon button = radius-full
[ ] Touch targets resolve to 44px (control-md) or larger
[ ] Rendered at 390 and 1440, every fixture state, no overflow,
    no clipped UI, no console errors
[ ] Preview route exists and loads (link it here: /dev/ui-preview/...)
[ ] Contract untouched, OR contract change is in this same commit with
    a version bump and updated fixtures
[ ] APP-FUNCTION-MAP.csv row updated for any control added or rewired
[ ] Production build exits 0
[ ] Zero em dashes introduced in code or docs
```

## 4. Ongoing maintenance

How the law grows without drifting.

- A new TOKEN enters `app/theme.css` only through a Brian ruling, and
  enters `docs/DESIGN-TOKENS.md` in the same commit with a name, both
  theme values, a one-sentence role, legal-on / never-on, and a status.
  A bare value with no role and status is rejected at review.
- A new RULE enters this file only stated as a checkable condition
  (a grep, a path, a threshold, a yes/no). "Use tokens consistently"
  shaped prose is rejected at review.
- Who proposes: anyone (agent or human) via a queue item with evidence
  (file:line witnesses, and a render when the change is visible). Who
  ratifies: Brian, always. Silence is never ratification.
- Conflicts are bugs: if this file, `docs/DESIGN-TOKENS.md`, and
  `app/theme.css` ever disagree, work stops on the affected item and
  the conflict is escalated, never resolved locally.
- Cadence: at the start of every sprint, alongside the function-map
  refresh (CLAUDE.md section 11), run every detection command in
  `docs/DESIGN-TOKENS.md` "Out of contract" and diff the counts against
  the previous sprint's. Counts that grew mean a module drifted; the
  diff names the file. Record the counts in the sprint's closing
  report.
- Shipped-module recheck: any module touched for any reason re-runs the
  section 3 checklist for its package, not just the changed lines.
- One instruction set: after Brian rules queue item T11, exactly one
  agent-instruction file governs this repo and the other instruction
  files are archived or deleted. "No satellite process docs, ever"
  (legacy UIUX AGENTS.md) is carried forward as the standing rule.

## 5. Backend contract handoff (Nick)

Synthesized from the six legacy handoff drafts plus the Kibbe pilot
sheet and the live `docs/CONTRACT-REQUESTS.md`. Nothing below is
invented; each rule names its source. Contradictions found between the
drafts are NOT silently resolved here; they are queue items T13 to T15.

- WHERE THE CONTRACT LIVES. One `FeatureName.contract.js` per feature
  folder, version on line 1, plus the per-feature README sheet in the
  same folder as the negotiation surface. Source: LOOM-TRANSITION.md
  ("One sheet per feature, README.md in the feature folder") which the
  live repo's 227 feature READMEs already follow. Cross-repo requests
  and anything blocked on backend work live in
  `docs/CONTRACT-REQUESTS.md` as CR-NNN items.
- WHO OWNS FIELD NAMING. Contracts use semantic names, never database
  or form-field names ("Preferred: onReplaceBodyTraits(). Avoid:
  updateField(\"body_type\", value)", CRESTFALL_LOOM_PATTERN.md).
  Views receive display-ready data only; semantic intents cross as
  named callbacks (SOL-HANDOFF.md). Nick rules everything dev; Brian
  rules naming as the user sees it (SOL-HANDOFF.md). Whether nav-type
  labels are View-owned or arrive display-ready from the ViewModel is
  contradicted between the drafts and live practice: queue item T13.
- HOW A FIELD CHANGE IS PROPOSED AND ACCEPTED. Proposals land as edits
  to the feature's README sheet; agreement lands as the contract file
  change plus a version note. A CONTRACT_VERSION bump is the signal
  both sides watch. Optional prop additions are compatible; renames,
  removals, and meaning changes bump the version. Source:
  LOOM-TRANSITION.md and SOL-HANDOFF.md, identical on this rule.
- HOW A VIEW SIGNALS A BACKEND NEED WITHOUT A LIVE ENDPOINT. Two
  dispositions, recorded per feature: HIDE (the visible affordance
  would promise something the app cannot do) or STUB (harmless visible
  placeholder, fixture-fed). Never fake application state inside a
  View. Unsure which applies: log a CR item in
  `docs/CONTRACT-REQUESTS.md`, whose own header is the strictest and
  governing form of this rule: "Design never builds the fix itself
  here; it stubs the UI honestly or pauses the affected component and
  logs the gap." Sources: SOL-HANDOFF.md, LOOM-TRANSITION.md, live
  CONTRACT-REQUESTS.md.
- STANDING ITEMS CARRIED BY ID, so they are not lost:
  CR-005 (services-api answers HTTP 200 on a failed GraphQL write;
  transport fix is with Nick; the frontend `/api/creations` route
  guards against it but every other caller is still exposed; still
  untested end to end).
  CR-007 (no path reopens a saved character in the seven-stop creator,
  so update-in-place is unproven; this is also what blocks the old
  CR-004 check (c)).
  Plus the fifteen unanswered N-queue items in the legacy
  DECISIONS-FOR-NICK.md, which have NO CR equivalents and would be
  lost when the legacy folder is deleted: migrating the still-relevant
  ones into `docs/CONTRACT-REQUESTS.md` is a Sprint 3 Phase 1 task.

## 6. Rulings this SOP is waiting on

- T11: which single agent-instruction file governs this repo.
- T13: nav-label ownership (View-owned vs display-ready ViewModel).
- T14: contract version string format (semver vs dotted name).
- T15: approver of View-scope changes in the pilot sheet lineage
  (Brian vs Nicholas wording conflict between SOL-HANDOFF.md and the
  Kibbe sheet).
Until each is ruled, follow the live majority practice of the package
family you are in, and log the item, never guess a new standard.
