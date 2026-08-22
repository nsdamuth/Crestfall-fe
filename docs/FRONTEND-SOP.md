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
`docs/architecture/CRESTFALL_LOOM_PATTERN.md`, promoted from the legacy
reference folder 7 Aug 2026 (Sprint 3 Phase 1 item 1.6).

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
  global `--focus-ring` rule or its gold-fill-scope sibling
  `--focus-ring-ongold` applying (the `cf-field` quieter variant
  retired 22 Aug 2026, A3, Fable law review); `grep -rn
  'focus:outline-none' components/` hits are reviewed against
  `app/design-system.css:167-170`.
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
- The Tailwind content scanner never reads `docs/`. Check:
  `grep -n '@source not "../docs"' app/globals.css` returns a hit. Cause:
  Tailwind v4 scans every text file in the repo for candidate class
  strings, including markdown prose; a doc edit containing a
  Tailwind-class-shaped string in a code span (e.g. `text-[10px]`) can
  be read as a live class and break the dev server's CSS compile.
  `docs/` ships no product markup, so it is excluded at the source
  rather than requiring every doc author to escape class-like strings.
- Views never fake application state. A missing backend is stubbed
  honestly (visible "Soon" or hidden per the HIDE/STUB call in
  section 5), never simulated. Source: SOL-HANDOFF.md and
  LOOM-TRANSITION.md, carried forward.
- Nothing is ruled by silence. An unanswered question stays open and
  the work routes around it. Source: every prior instruction set,
  unanimous on this one point.
- Contrast law (X1, `docs/DESIGN-TOKENS.md` "Contrast law" section,
  Ruling N6 12 Aug 2026, extended same-session 12 Aug 2026). Normal-
  size meaningful text meets 4.5:1 against its surface, large text
  meets 3:1; placeholders are not exempt. `--ink-faint` is illegal
  for normal-size meaningful text on `--surface-3` AND `--surface-4`;
  use `--ink-dim` there instead. `--ink-faint` stays legal on
  `--surface-1`/`--surface-2` and for large text anywhere.
  Check: `grep -rn 'ink-faint' components/ --include='*.view.jsx'`
  hits reviewed against `--surface-3`/`--surface-4` consumers
  (topbar/sidebar/sticky chrome; modal, menu, popover); any normal-
  size text hit is out of contract.
- `--gold-deep` is legal for ornament and large display text on any
  surface; illegal for normal-size meaningful text on every surface
  but `--canvas`. Check: `grep -rn 'gold-deep' components/
  --include='*.view.jsx'` hits reviewed for normal-size text off
  `--canvas`; any such hit is out of contract.
- Status colors as normal-size text on `--surface-2`/`--surface-3`/
  `--surface-4`: BLOCKED, not legal, pending a named brighter ladder
  step that does not yet exist for `--success`/`--warning`/`--danger`
  (`docs/DESIGN-TOKENS.md` "Contrast law" section). Do not invent a
  step or a literal to work around this; STOP and report if a design
  needs status text at normal size on one of those three surfaces.
  Every status use still ships with its word beside it regardless of
  size or surface, per standing law.
- Sole-identifier boundaries meet 3:1 (1.4.11): a control identified
  ONLY by its border uses `--line-strong` or a redundant cue (fill
  delta plus label, icon, or state mark). `--line` and
  `--line-whisper` stay legal as decorative or redundant edges,
  including input beds where label, placeholder, and focus ring
  jointly identify the field. Check: any new sole-boundary control
  reviewed against `docs/review-artifacts/contrast-matrix-x1.md` and
  the Contrast law section before shipping `--line`/`--line-whisper`
  as its only identifying mark.

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

## 7. Repo basics

Crestfall-fe, the front end for Crestfall by Anthology Interactive.
Independent repo, independent from services-api and from the original
Crestfall FE. Ports: this repo 3001, services-api 4000, original
Crestfall FE 3000.

Branch law: work on `design/*` or `fix/*` branches. Never commit to
main.

Sample art, RULED 10 Aug 2026. `public/tmp-mockup-images/canon-character-images/`
and `public/tmp-mockup-images/alpha-test-creator-images/` are scratch
art folders, ignored by default; a curated, resized, and compressed
subset (the files every current kit fixture and v2 mockup page
actually references, listed by name in `.gitignore`) is committed so
a fresh clone renders the kit previews and the v2 pages with no image
404s. `public/tmp-creator-tiles/logo-mark.svg` is committed the same
way. New scratch art dropped into either mockup folder stays ignored
unless its filename is added to the `.gitignore` allowlist; do that
only after resizing to a card/tile display dimension and compressing
it, never by committing a raw original. Some legacy paths still
referenced by older, non-v2 components
(`/characters/<name>/card.jpg`, `/locations/<name>/card.jpg`,
`/images/placeholder-card.jpg`) have no local file anywhere in this
repo and will still 404 on a fresh clone; no file exists to sample
from, so none is invented here.

Absolute constraints: no em dashes anywhere, in code or in docs. Views
are presentation-only, no product-data access, no business logic in
page components. Every change is the smallest edit that satisfies the
task. Contracts update in the same commit as any prop change; fixtures
are added for any new visible state. Never sed or awk on markup or
CSS. Docs are code: one canonical home per topic, no duplicates; a
duplicate found anywhere is deleted, not kept alongside the canonical
copy.

## 8. Verification law

Every change is checked on a rendered page, at 390 width then 1440
width. A production build finishes with exit code 0. Any doc touched
in a pass is re-counted to zero em dashes before the pass is reported
done. Every finished-task report echoes the brief's manifest, part by
part, each marked DONE or STOPPED.

Dev server ownership (ruled, ports and processes): Brian runs his
own dev server on 3001 in a separate terminal. Before starting a
server for verification, check whether one is already listening on
3001 (`lsof -i :3001` or `curl`). If one is, use it. Never restart
it. If a server must be started for the run, start it on a different
port and track its own PID. Cleanup targets only that PID, never a
broad process-name kill (`pkill -f "next dev"` and equivalents are
banned outright). Never kill a process this run did not start.

Mobile verification method, RULED 10 Aug 2026 (R3). All mobile
verification uses the Chrome DevTools MCP emulate command with
viewport 390x844, deviceScaleFactor 2, mobile true, touch enabled.
The resize command is banned for mobile verification: it clamps near
500px wide and has produced false passes. A report claiming a 390
check that used resize is a failed report.

## 9. Working with Brian

Brian is the design authority and is not a coder. He never receives
token names, file paths, CSS terms, or diffs.

Verdict first, reasoning after, briefly. One decision at a time, never
stack asks. When a choice is real, exactly three options, one marked
as the recommendation with the reason, the other two with the reason
not. Every option ships with its real cost: time, packages touched,
rework risk.

Every recommendation is presented as already carried forward into the
next artifact. Pre-carried means written into the next artifact in
draft form; it is never executed before GO. Silence is never approval.

Reply vocabulary is GO, NO, HOLD, /HANDOFF and nothing else. Never ask
Brian to confirm the same thing twice. Never hand him a prompt missing
a decision he just made. Never re-open a locked ruling.

Every Claude Code brief states engine, effort, and permission mode as
three separate numbered actions before the paste block, never buried
inside the brief text.

Never ask Brian to perform visual analysis in prose. Render it, put
the options side by side, and mark the recommendation.

Briefs, not commands. The strategy chat writes intent and constraints;
it never hands Brian a shell command. Every command in this project is
authored by the agent, which reads the repo first and checks the
request against the standing rules. The agent's refusal is a required
layer of protection and must never be treated as friction. When an
instruction's premise does not match what the agent finds in the repo,
the agent stops and escalates rather than inventing work or complying
anyway. This behavior is correct and is not to be tuned out.

Never assert unverified state. No claim about branch state, file
contents, or how a page renders is made without having read or
rendered it in that session. Anything expected but unconfirmed is
labeled "expected, verify first" at the point it is stated, never as a
trailing caveat. A verdict is never built on top of an assumption.

## 10. Progressive context

Load only when the task calls for it, not by default:

- `docs/RESTYLE-RULES.md`: history only, cited never followed.
- `docs/CRESTFALL-DESIGN-CONTEXT.md`: product model or design language
  questions.
- `docs/BATCH-TWO-SCOPE.md`: batch two execution only.
- `docs/ROADMAP.md`: status checks, updated in the same commit as the
  work.
- `docs/contracts/`: feature work against backend contracts.
- `docs/APP-FUNCTION-MAP.csv`: before touching any page, the wiring
  behind every control on it. The markdown rollup is the readable
  view.
- `docs/COMPONENT-CENSUS.csv`: before touching any component package,
  its usage count, pages, and contract/fixture state.

## 11. Parallelism law

PARALLELISM LAW (ruled 4 Aug 2026, supersedes edits-serial)

Roles. Fable 5 plans and rules at strategy gates only, never executes.
Opus plans sprints, writes briefs, and runs synthesis phases. Sonnet
executes edits. Haiku runs bulk mechanical reads and single-rule
checks inside workflows.

Fan out by default. Any task that is a list of more than twenty like
items runs as a dynamic workflow, not a serial pass. Read-only fan-out
for audits, harvests, screenshots, and verification is always allowed,
unlimited, on the cheapest model that can do the job.

Parallel edits are permitted when and only when each unit is one
package in its own worktree landing as one commit. One item, one
commit survives unchanged. Anything that cannot be isolated that way
stays serial.

No agent grades its own work. Every editing workflow ships a
verification phase run by different agents than the ones that edited.

Every fan-out pilots on its first ten units and stops for a rendered
check before the remainder runs.

Renders are deliverables. Screenshots are handed back, never deleted.

Automatic orchestration mode stays off. Workflows are triggered
deliberately, per task.

Budget. Plan capacity is a resource to spend, not to preserve. Burn is
authorized to reach the Nick handoff. The only spend limit is a run
that cannot be verified or undone.

Escalation. A workflow that meets a rule it cannot apply mechanically
stops that unit and reports it. It never guesses.

Generated audit artifacts are exempt from the em dash law and are
deleted at end of life.

## 12. QA gate

QA GATE (ruled 4 Aug 2026)

A render is not a deliverable. A judgment is.

Every verification agent renders the package, then rules it against
every rule family assigned to it, returning PASS or FLAG with the
specific rule named on any FLAG.

A screenshot is never handed to Brian as a question. It is handed as
evidence behind a ruling already made.

Brian sees three things and nothing else: the count of packages
passed, every flagged item with what is wrong and the recommended
fix, and a contact sheet of passing renders for spot approval.

An agent that cannot rule a package flags it. It never asks Brian to
look and decide in its place.

Scope is verified, never inherited. Before any sweep phase, confirm
the scope document covers every surface the rules apply to, and
report any surface outside it.

Every preview link handed to Brian is verified to load first. A link
that 404s is a failed report.

## 13. Contract law

Presentation may change. What a component reports may not. A View may
change how a choice is presented, for example tabs becoming a
dropdown, only while it continues to report the same selection to the
same handler. If a redesign appears to require a contract, ViewModel
or data-flow change, stop and escalate to Brian. Never decide it.

`docs/APP-FUNCTION-MAP.csv` is the ledger of what every control
reports and where it is wired. Check the control's row before
restyling it; its `operation_name` must still be reachable after the
change.

## 14. Definition of done

Every feature starts with a PRD and a signed contract using
`docs/contracts/CONTRACT-TEMPLATE.md`, stored in the shared workspace
so both the backend and frontend lanes read the same document. No
package codes against an unsigned contract.

Every feature closes by updating `docs/APP-FUNCTION-MAP.csv` and
regenerating the markdown rollup. A feature that ships without that
update is not done.

## 15. Map refresh

The function map is regenerated at the start of every sprint, not
once. It is a living document, and its diff is how upstream change is
detected.

## 16. Visible change rule

Every sprint ends with before and after renders at 390 and 1440. Work
that changes nothing Brian can see does not close a sprint on its
own.

## 17. Token-first directive

RULED 7 Aug 2026 (Brian's architectural directive, binding on all
future work). Every color and typography value pulls from a global
token first. A local adjustment is permitted only when Brian has
explicitly requested that specific adjustment. If a value needed has
no token, the agent stops and reports it as a missing token; it never
invents a literal.

Check: every new or touched line resolves through `var(--token)` (CSS)
or a `var(--token)`-wrapped Tailwind arbitrary value (`text-[var(--x)]`,
`bg-[var(--x)]`), never a raw hex, rgb/rgba, or a bare Tailwind color
utility (`red-500`, `white/10`, etc.) outside the token files
themselves.

Detect: `grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\([0-9]' components/ app/ --include='*.jsx' --include='*.js' --include='*.css' | grep -vE 'app/theme\.css|app/globals\.css|fixtures'`
must return nothing new for any file touched in the current pass.

## 18. Feature flags

Standing law once a flag ships: default state is stated in words (not
just code), the override env var name is named, and the flag's scope
(what it gates) is one sentence. A flag with no line here is not
ruled to exist.

- **Sidebar v2 preview**, RULED 9 Aug 2026 (demo prep pass). Env var
  `NEXT_PUBLIC_SIDEBAR_V2_PREVIEW`, read by
  `lib/shared/flags/sidebarV2Preview.js`. On by default for dev and
  staging (any `NODE_ENV` other than `production`), off in
  production; the env var forces either direction explicitly
  (`"true"` or `"false"`). Gates the nine-destination journey-order
  preview nav on `components/studio/studio-sidebar/StudioSidebar.view.jsx`
  (journey order per `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 2):
  built destinations route to their live `/studio/v2/*` page, unbuilt
  destinations render quiet and non-interactive, and today's existing
  sidebar links collapse into a Legacy group beneath, unchanged.
  Flag off renders the sidebar exactly as it did before the flag
  existed. Full detail: `components/studio/studio-sidebar/README.md`.
