# Sprint 3 execution plan

Written 7 Aug 2026 by the planning run. Executor: Sonnet, zero judgment
calls. Anywhere a step would require a decision, the step is BLOCKED and
names its queue item. Token law: `docs/DESIGN-TOKENS.md`. Process law:
`docs/FRONTEND-SOP.md`.

## The ruling queue (Tier B, Brian rules in one pass)

Full evidence for each item is in the planning run's terminal report.

| Item | Question | Starred recommendation |
|---|---|---|
| T1 | Which theme file is the source of truth | * THIS repo's `app/theme.css`. The 27 Jul design-system file froze; every ruling since 29 Jul landed in the app-side file and this repo carries the latest state (status triad, blur). Confirming costs nothing; reversing would discard five ruled evolutions. |
| T2 | Do `bg-black/NN` panel fills map onto the opaque surface ramp by elevation role | * Yes: wells to `--surface-1`, cards to `--surface-2`, floating to `--surface-4`; black translucency stays legal only in the wash family over artwork. Locked as principle by the token file's own construction; the per-step mapping needs T5's render first. |
| T3 | Gold mapping for the old `--muted-gold` fleet | * Keep the live bridge: default `--gold-ornament`, interactive uses graduate to `--gold-action` per package (the creator modal and the proof both work this way). No mass swap; the alternative (everything to `--gold-action`, the old UIUX shim) brightens 1,600+ sites at once. |
| T4 | Hex promotion (bridge proposal Ruling B) | * Promote only the lore greens (`#44604b`, `#36513e`) and `--blood`/`--deep-green`; map every other stray hex per the debt map. Not yet executed anywhere; needs the ruling before lore/marketing packages convert. |
| T5 | The `#080706` surface flip (199 files) | * Convert ONE package (`studio-top-bar`), render it at 390/1440, Brian looks once, then the batch runs or stops. The biggest visual change of the bridge; never batched before the render. |
| T6 | Placeholder vs value | * Placeholder `--ink-faint`, value `--ink`. The proof demonstrates it (`picker.css:34`) and four live packages already do it; 134 sites use `--ink-dim` and read as filled values (the Lilith defect, one problem, three symptoms). One GO closes it. |
| T7 | Wash value (.40 provisional) | * Close at .40. The wash lab renders A/.70, B/.55, C/.40 side by side with C marked recommended; the copied lab lost its sample image, so Brian views the original at `~/dev/crestfall-main/Crestfall/design-system/labs/wash-lab.html`, or this sprint re-renders the ladder on a live card. Same sitting as T5. |
| T8 | White hairlines (`border-white/10`, 1,094 uses) and `white/[0.02]`-`[0.04]` washes | * Approve the warm shift to `--line` / `--line-strong` / `--edge-top` / `--fill-whisper`, verified on one rendered package in the same sitting as T5. Alternative: mint a neutral hairline token (adds a token the system deliberately lacks). |
| T9 | Shell debt (ModalShell, StudioShell, PANEL_CLASS_NAME) | * Carve ModalShell into a LOOM package first (contract: open state, close callbacks, panel slot), then its 11 caller pages convert against a real preview. StudioShell follows. Until then only the literal swaps listed in Phase 1 are touched. |
| T10 | Sub-11px type (171 `text-[10px]`, 11 `[9px]`, 7 `[8px]`) | * `text-[10px]` converts mechanically to `--text-label`; every `[9px]`/`[8px]` site gets a per-use render check because badges grow 2-3px. Includes the creator's own field labels (`Controls.jsx:12`). |
| T11 | Which agent-instruction file governs | * This repo's `CLAUDE.md`, alone. The other four (design-system CLAUDE.md, UIUX AGENTS.md, both PROJECT-INSTRUCTIONS) are archived at merge; the still-good rules from them are already folded into `docs/FRONTEND-SOP.md` with citations. |
| T12 | Legacy-practice divergences (each needs readopt / retire / ignore) | Listed in the terminal report: Tailwind default type sizes vs the ruled scale; dropdowns inside the creator vs the visual-selection law; creator modal centered vs Ruling 1's phone bottom-dock; autosave "Saved" chip vs live "Unsaved changes" dot; the missing `.grand` name field; visibility PRIVATE/UNLISTED vs the ratified four-state enum (CONTRACT-level, also for Nick); `submit-canon` page vs the "no public submit control" ruling. |
| T13 | Nav-label ownership (View vs ViewModel) | * Ratify live practice: display-ready from the ViewModel. |
| T14 | Contract version format | * Ratify semver for new contracts; existing dotted names convert opportunistically. |
| T15 | View-change approver wording (Brian vs Nicholas in legacy sheets) | * Brian rules design, Nick rules dev, per SOL-HANDOFF; fix the Kibbe-sheet wording when it is promoted. |

## Phase 1: globals and shells (START NOW except where marked)

Order: these are inherited by everything, so they land before any
consumer package is verified.

| # | File | Find (exact) | Replace (exact) | Authority | Verify |
|---|---|---|---|---|---|
| 1.1 | `app/token-bridge.css` | `  --border: var(--line-strong);` | `  --border: var(--line-strong);\n  --font-serif: var(--font-display);` | Item 1.6 (font-serif retired to display; the alias was dropped 3 Aug before its 32 consumer files migrated, so `.font-serif` currently falls back to default serif) | `/` and `/lore` at 390/1440: serif blocks render Cormorant again |
| 1.2 | `app/design-system.css` | (append at end of file) | `@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation-duration: .01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: .01ms !important;\n  }\n}` | Both ancestor theme files carried this rule; it was lost in the 3 Aug copy. Restores the accessibility catch-all | Build exit 0; `/dev/ui-preview/creation-card` still animates nothing under OS reduced-motion |
| 1.3 | `components/ui/ModalShell.jsx` | `bg-black/80 p-4` | `bg-[var(--scrim-strong)] p-4 backdrop-blur-[var(--blur-panel)]` | Scrim + blur rulings (one scrim, one blur, floating panels only) | `/dev/ui-preview/creation-preview-modal`, default and longest fixtures, 390/1440 |
| 1.4 | `components/studio/creations/CreationPreviewModal.jsx` | `shadow-2xl lg:overflow-hidden` | `shadow-[var(--shadow-modal)] lg:overflow-hidden` | Elevation item 1.9 | same route as 1.3 |
| 1.5 | `components/studio/creations/CreationPreviewModal.jsx` | `bg-[#080706] ` | BLOCKED | T5 | n/a |
| 1.6 | docs task: migrate the still-relevant legacy N-queue items (N1-N15 in `docs/_legacy-reference/design-system/DECISIONS-FOR-NICK.md`, all unanswered) into `docs/CONTRACT-REQUESTS.md` as CR items, and promote `docs/_legacy-reference/docs/architecture/CRESTFALL_LOOM_PATTERN.md` to `docs/architecture/` | n/a | n/a | Post-merge governance below; the legacy folder is deleted at sprint end and these are the only two things in it with no live home | Files exist at the new paths; em-dash count zero |
| 1.7 | `components/studio/StudioShell.jsx` carving | BLOCKED | BLOCKED | T9 | n/a |

Commit template, one file family per commit:
`fix: <area> <what> to tokens` body: which ruling, "Mechanical token
substitutions only, no value or behavior change." (matches 0bcedce and
327300d).

STOP conditions, phase 1: any find string that does not match exactly
once; any verify route that 404s; any console error new since the edit.

## Phase 2: high-level UI (START NOW except where marked)

The shared chrome everything sits inside. Inventory findings for these
packages: studio-sidebar (4), studio-top-bar (5), studio-economy-widget
(4), studio-mobile-nav, plus the sticky filter bars.

| # | Package | Work | Status |
|---|---|---|---|
| 2.1 | studio-top-bar | Its inventory findings: `rounded-xl` to `--radius-md`; raw `border-white/10` BLOCKED on T8; `#080706` BLOCKED on T5 (this package is the T5 pilot: when Brian sits, convert it fully and render it). | Partially blocked; the radius swap is START NOW |
| 2.2 | studio-sidebar | Inventory findings (shim vars, radius). Shim swaps are zero-visual-change (`--muted-gold` resolves to `--gold-ornament` today through the bridge): textual swap per debt map. | START NOW |
| 2.3 | studio-economy-widget, studio-mobile-nav | Same treatment, same rules. | START NOW |
| 2.4 | Sticky search/filter/sort bars (`filterable-index`, hub-level bars) | Remaining `rgba()` literals in `FilterableIndex.view.jsx:31,54,82,97,111,124` are panel-chrome opacity: BLOCKED on T2/T8 mapping. | BLOCKED |
| 2.5 | Logo/topbar/mobile-nav geometry | No ruled defect on file beyond the above; nothing else is touched. | n/a |

Per-package verify: its `/dev/ui-preview/<package>` route, every fixture
state, 390 and 1440. Commit per package.

## Phase 3: batch modals and remaining packages

Scope source: `docs/CLOSING-INVENTORY.md` line-level findings (labels
ignored). Verified state 7 Aug: 166 finding-bearing package entries
(224 walked = 166 + 58 clean; the header's "222" is stale; one entry,
`SharedFields.jsx`, is listed twice and my-creations/edit is out of
scope anyway). Roughly one package (`create-type-card`) is closed by
the inventory's own text; the four 6 Aug account packages are PARTIALLY
closed (radius/status/scrim done, opacity findings live). The ~81
figure in `docs/ROADMAP.md:11` is not supported by the inventory and is
corrected by this plan.

Executable NOW (locked rulings, mechanical):

| Bucket | Size | Find/replace | Authority |
|---|---|---|---|
| radius/corner | 251 findings, 104 packages | `rounded-xl` to `rounded-[var(--radius-md)]`; `rounded-2xl` to `rounded-[var(--radius-md)]`; floating surfaces (the finding text says modal/dialog/sheet/popover, or the class sits on a `fixed`/`absolute` overlay panel) go to `rounded-[var(--radius-lg)]`. A surface the executor cannot classify by those two textual tests is SKIPPED and logged, never guessed (precedent: the 14 held-out packages). | Corners final ruling; commits 0bcedce, 327300d |
| status color | 91 findings, 70 packages | `red-*` triads to `--status-danger`/`-bed`/`-border`; `emerald-*` to success triad; `amber-*` to warning triad; `sky-*` info states REMOVED not converted (delete the color class, keep the copy in ink family); `violet-300` in actor-mechanics-profile-editor is off-list: SKIP and log. | Status ruling; commit 327300d |
| legacy shim vars | 220 findings, 97 packages | `var(--muted-gold)` to `var(--gold-ornament)`; `var(--muted)` to `var(--ink-dim)`; `var(--foreground)` to `var(--ink)`; `var(--border)` to `var(--line-strong)`. Zero visual change (the bridge already aliases these), so no render risk; still verified per package. Interactive-gold graduation to `--gold-action` is NOT part of this bucket (T3 governs; log candidates). | Bridge (`app/token-bridge.css`), RESTYLE-RULES note line 41 |
| destructive word | 21 findings | Add the visible word beside the icon on each flagged destructive control, ghost geometry, `--status-danger` text. Copy is the control's own verb ("Remove", "Delete") already present in its aria-label. | Destructive ruling ("Every destructive control ships with the word beside it") |
| icon sizes | 4 findings | `size={17}`/`size={18}` to `size={16}` or `size={20}` per the finding's own note; `size={13}` in the step rail rides Phase 4. | Icon scale 16/20/24 |

BLOCKED buckets, listed with their blocker, never guessed:

| Bucket | Size | Blocked on |
|---|---|---|
| opacity/wash (`bg-black/NN` fills, `white/NN` hairlines and washes) | 54 findings, 45 packages, plus the ~1,000 uncatalogued `bg-black/NN` and 1,094 `border-white/10` sites | T2, T5, T8 |
| hardcoded hex | 7 findings + the wider #080706 family | T4, T5 |
| sub-11px type | 171 + 11 + 7 sites (not in the inventory at all; this plan adds them) | T10 |
| chat/story-room raw golds | story-room-message and friends | Chat surfaces excluded from mechanical sweeps (sweep-scope ruling); dedicated sitting |
| 14 held-out packages | per `docs/NICK-SWEEP-NOTES.md` | Brian's per-item rulings |

Execution rules, phase 3: batch by directory family (create 54 pkgs,
my-creations 45 minus the out-of-scope edit tree, profile 13, creations
9, image-studio 7, room-templates 6, account 5, community 4,
story-rooms 4 chat-excluded, storylines 4, rest single). One package,
one commit. Pilot on the first ten packages, stop for a rendered
contact-sheet check before the remainder (parallelism law). Verify
every package on its `/dev/ui-preview/<package>` route at 390 and 1440,
default/error/success/empty/longest fixtures where they exist. A
package whose preview route is missing is SKIPPED and logged. No agent
grades its own work: verification agents are not the editing agents.

STOP conditions, phase 3: a find string matching zero or 2+ times where
the manifest expects one; any corner the two-question tier test cannot
classify; any status color not on the ruled list; any console error;
any route that fails to load.

## Phase 4: fine-tuning and consolidation

| # | Work | Status |
|---|---|---|
| 4.1 | Creator modal adopts the unified frame: `CreatorStops.view.jsx:96-102` drops the old color-mix fill for `--surface-4`, `backdrop-blur-[2px]` on the veil becomes `var(--blur-panel)`. Ruled by Ruling 1 (which explicitly names this fill change), but this is the flagship: convert, render at 390/1440, hand Brian the before/after with the T5 sitting. The phone bottom-dock half of Ruling 1 conflicts with the proof's ratified centered-modal and is T12: do NOT dock until ruled. | START NOW (fill + blur only), render-gated |
| 4.2 | Placeholder pair: after T6, `placeholder:text-[var(--ink-dim)]` to `placeholder:text-[var(--ink-faint)]` in the 134 sites (creator first: `NameStop.view.jsx:34,48`, `shared/Controls.jsx:397,430,446`, seal age field). Closes the Lilith defect. | BLOCKED on T6 (one GO) |
| 4.3 | Creator field labels off 10px: `shared/Controls.jsx:12` FIELD_LABEL_CLASS `text-[10px] ... leading-[0.9rem] tracking-[0.14em]` to `text-[var(--text-label)] leading-[var(--lh-label)] tracking-[var(--track-label)]`. | BLOCKED on T10 (rides its first batch) |
| 4.4 | Propagate the creator's proven structure (step rail, field+counter, footer composition) to the other modals (crestfall-option-modal, trait/multi-trait, weather-config, pickers). Structural, per-modal design mapping, each needs a render gate. | POLISH, after T9 and the T-sitting |
| 4.5 | Step rail touch targets (28/32px nodes vs the 44px floor) and the missing `.grand` name field | BLOCKED on T12 (proof-vs-live items) |

## Ship gate

REQUIRED TO MERGE AND GO LIVE:
- Phase 1 items 1.1 (broken serif), 1.2 (reduced-motion), 1.3/1.4
  (ModalShell scrim + shadow), 1.6 (nothing lost when the evidence
  folder dies).
- The two zero-byte broken routes `/chronicle/[...slug]` and
  `/stories/[...slug]` (pre-existing bugs, tracked in
  `docs/NICK-SWEEP-NOTES.md`; not styling, but nothing ships with two
  crashing routes).
- T6 + 4.2 (the placeholder defect is user-visible in the flagship
  creator).
- The governance docs themselves (`docs/DESIGN-TOKENS.md`,
  `docs/FRONTEND-SOP.md`, this file) merged, plus the RESTYLE-RULES
  demotion notice applied after Brian's GO.
- CR-005 remains Nick's; the frontend guard already shipped. Not a
  frontend merge blocker.

POLISH, AFTER LAUNCH: everything in Phase 3 (the app already renders
consistently enough to ship; conversion is drift-repayment), Phase 2
remainder, Phase 4.4/4.5, T4 lore-green promotion, T10 type floor
batches, the T5/T8 fleet conversions once ruled.

MINIMUM PATH to merged-and-live, in order:
1. Brian's one sitting: T1, T5 (one render), T6, T7 (lab view), T8
   (same render), T11.
2. Phase 1 items 1.1-1.4, 1.6.
3. Fix the two zero-byte routes (contents are Nick-side data pages;
   if backend data is not ready, an honest stub page per the HIDE/STUB
   rule).
4. Phase 4 item 4.2 (placeholder swap) and 4.1 (creator frame, with
   its render check).
5. Full preview-gallery render pass (every `/dev/ui-preview/*` route,
   390/1440) plus a build with exit 0.
6. Merge. Everything else follows as post-launch batches under the SOP.

## Out of scope, all phases

- `app/dev/ui-preview/**`: test harness, never product, never edited.
- `components/studio/my-creations/edit/**` standalone editor including
  `SharedFields.jsx` and SectionTitle: off limits, awaiting its own
  ruling (CR-007/CR-008 territory), 48 files depend on it.
- Fixtures, contracts, ViewModels: presentation-only sweeps never touch
  them; a needed contract change stops and escalates (contract law).
- `docs/_legacy-reference/**`: evidence, never edited, deleted at
  sprint end per the governance section.
- The modal-to-popup conversion: unruled strategy sitting; the proof's
  popup chrome is documented in the terminal report, nothing more.
- Top-level marketing/lore components outside the inventory's scope
  note (its own line 5), except the two Phase 1 global fixes that
  restore already-ruled behavior.
- Chat surfaces (sweep-scope ruling: dedicated sitting).

## Post-merge governance

Documents that TRAVEL with the merge and govern afterward:
`CLAUDE.md` (the one instruction file, pending T11), `docs/DESIGN-TOKENS.md`,
`docs/FRONTEND-SOP.md`, `docs/APP-FUNCTION-MAP.csv` + rollup,
`docs/COMPONENT-CENSUS.csv` + rollup, `docs/CONTRACT-REQUESTS.md`,
`docs/NICK-BLOCKERS.md`, `docs/ROADMAP.md`, `docs/contracts/**`,
`docs/CRESTFALL-DESIGN-CONTEXT.md`, `docs/CRESTFALL-PRODUCT-MODEL.md`,
`docs/architecture/CRESTFALL_LOOM_PATTERN.md` (promoted by item 1.6),
and this file until its phases close.

The FIRST FILE an agent reads in the merged repo: `CLAUDE.md`, which
points at the two law docs. No other instruction file survives: the
design-system CLAUDE.md, the UIUX AGENTS.md, and both
PROJECT-INSTRUCTIONS variants are deleted or archived at merge (pending
T11), never left in place for a future agent to find.

ARCHIVE (kept, moved under `docs/_archive/`, cited never followed):
`docs/RESTYLE-RULES.md` (after the demotion notice is applied),
`docs/BATCH-TWO-SCOPE.md`, `docs/BATCH-TWO-ORDER.md`,
`docs/SWEEP-REPORT.md`, `docs/SWEEP-PROGRESS.md`,
`docs/CLOSING-REPORT.md`, `docs/HARVEST-GAPS.md`, `docs/RAW-LITERALS.md`,
`docs/REDESIGN-ORDER.md`, `docs/DEEP-MAP-CREATOR.*`,
`docs/SHELL-INVENTORY.md`, `docs/NICK-SWEEP-NOTES.md` once its 14 items
are ruled.

DELETED: `docs/CLOSING-INVENTORY.md` when its last finding closes or
archives (generated artifact, deleted at end of life by its own
header); `docs/_legacy-reference/**` at sprint end, AFTER item 1.6
rescues the N-queue and the LOOM pattern doc (the only two things in it
with no live home; everything else was verified duplicate or superseded
this run).

## Context block (paste into the Claude webapp)

CRESTFALL FRONTEND, SPRINT 3. The law lives in two files in the repo:
DESIGN-TOKENS.md (every color, size, and effect: its value, its role,
where it is legal, and its status) and FRONTEND-SOP.md (how new work is
built, the PR checklist, and the backend handoff rules). Those two plus
CLAUDE.md are the only documents agents follow. RESTYLE-RULES.md is
history, never law. CLOSING-INVENTORY.md is a work list whose labels
are unreliable; only its line-level findings count. The folder
docs/_legacy-reference is evidence from the old repos, gitignored, and
gets deleted at the end of this sprint.

Verification: agents can only see pages under /dev/ui-preview, which
render each component alone from canned states; that harness is never
the product and never edited. Signed-in pages on port 3001 need Brian's
own eyes; agents cannot reach them.

Rulings run in two tiers. Tier A is what the code already proves;
agents lock it and cite two live witnesses. Tier B is anything the code
contradicts, is silent on, or that changes the look at scale; agents
present evidence and options, and only Brian rules. Nothing is ever
ruled by silence.

The current Tier B queue, one sitting: T1 confirm this repo's token
file as the source of truth. T5 approve or reject the panel-color flip
on one rendered package (the biggest visual change pending). T6 approve
the placeholder fix (the "Lilith looks typed-in" defect). T7 close the
wash value by looking at the three-shade lab render. T8 approve warming
the white hairlines to the gold line tokens on the same render. T11
pick the single agent-instruction file. Then, lower priority: gold
graduation (T3), stray-color promotion (T4), shell carving (T9), tiny
text (T10), and the proof-vs-live creator differences (T12).
