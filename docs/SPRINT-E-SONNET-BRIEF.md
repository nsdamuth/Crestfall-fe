# SPRINT-E-SONNET-BRIEF v1.0.0, written 10 Aug 2026, for one unattended Sonnet session

Engine Sonnet, effort high, auto-accept. Execute the five phases
below in order, unattended. One workstream dominates: the image
creator panel on the Images page (phases 1 to 3), then the
review-gate deferrals (phase 4) and the closing sweep (phase 5).
Each phase is committed, pushed, and verified before the next
begins. You have explicit permission to STOP CLEANLY at any phase
boundary when your remaining context thins; a clean stop with a
correct handoff is a success, not a failure. This brief plus the
repo is everything you need; nothing lives in any prior chat.

## FIRST ACTIONS

1. Run `git status`. You must be on `design/kit-polish-3` with a
   clean tree. Never touch main. If the tree is dirty or the branch
   is wrong, STOP and write the handoff (see STOP RULES).
2. Run the production build (`npm run build`) BEFORE starting any
   dev server. It must exit 0. If it fails, fixing it is phase 0
   and everything else waits.
3. Read, in this order: `CLAUDE.md`, `docs/SPRINT-E-PLAN.md` (the
   execution spec for every phase below; where this brief says "per
   plan section N" that section is authoritative detail),
   `docs/DESIGN-TOKENS.md`, `docs/FRONTEND-SOP.md` sections 1, 2,
   3, 8, 9, 13, 14, 17, `docs/BUILD-BLUEPRINT.md` sections 2.5,
   2.9, 2.16, 3.1, 3.3, 3.4, `docs/APP-FUNCTION-INVENTORY.md` (the
   R6 image creator inventory pass section), and
   `docs/HANDOFF-NEXT-CHAT.md` (top section).
4. Read before writing any code:
   `components/kit/modal-frame/` (all files),
   `components/kit/dropdown/` (all files; note the 1.1.0
   `ariaLabel` prop),
   `components/kit/studio-page/` (all files),
   `components/kit/studio-filter-bar/KitStudioFilterBar.view.jsx`,
   `app/studio/v2/images/ImagesV2Mockup.jsx`,
   `app/studio/v2/FixtureActionNotice.jsx` (the R4 stub shape every
   not-yet-wired control opens),
   `app/dev/ui-preview/images-v2-page/` (the mirror pattern),
   and READ ONLY, never edit, the live creator flow the panel
   mirrors: `app/studio/image-studio/page.js`,
   `components/studio/image-studio/` (composer, workbench,
   ingredient-slot, ingredient-picker, creation-picker-panel,
   custom-ingredient-editor, save-ingredient-preset,
   video-tools-panel, imageStudioData.js and the workbench
   ViewModel).
5. Do NOT read the old crestfall-main repo.

## RULES IN FORCE

- Tokens only. Every color, size, and typography value resolves
  through `var(--token)` per `docs/DESIGN-TOKENS.md` and
  FRONTEND-SOP section 17. A value with no token is a missing
  token: stop that unit and report it, never invent a literal.
  This sprint mints NO new token and amends no token law.
- Mobile verification method (R3, standing law, SOP section 8):
  all mobile verification uses the Chrome DevTools MCP EMULATE
  command with viewport 390x844, deviceScaleFactor 2, mobile true,
  touch enabled. The resize command is BANNED for mobile checks;
  any mobile result obtained through resize is void.
- Mobile modal law (R4): popup modals maximize the screen at phone
  width. The creator panel modal, the ingredient picker, and the
  save-preset modal all inherit this from KitModalFrame by
  construction; verify it anyway.
- Honest stubs only (SOP sections 2 and 5): generation,
  persistence, and navigation that wait on live wiring open the
  R4 fixture-action notice (`app/studio/v2/FixtureActionNotice.jsx`);
  never fake a pending job, a saved preset, or a navigation.
- Content width law (R1 of Sprint A): one content width per page.
  The desktop rail sits INSIDE the content width; heading, filter
  line, grid, load-more, and banner keep their shared edges. If
  the rail and the five-edge law prove incompatible between 1100
  and 1279 wide, drop the rail to the CTA treatment below 1280 and
  record the chosen breakpoint (plan 1.4).
- Card law, filter line law, tag economy, selection states, focus
  law, corners two tiers, ratings from the terminology module,
  backend names unchanged: all standing, per the law docs read in
  FIRST ACTIONS.
- Held pages out of scope entirely: Adventures, Studio, Home,
  Lore. The LIVE image studio (`app/studio/image-studio/`,
  `components/studio/image-studio/`, `components/studio/media/`)
  is READ ONLY reference; never edit it. Live pages generally are
  READ ONLY; the two authorized exceptions in plan section 2 (play
  page typo, header call-site cleanup) are OPEN FOR BRIAN items
  29 and 30 and are NOT authorized yet; skip them unless a ruling
  note in the plan says otherwise.
- Subagents are read-only (audit and verification passes only).
  Every file edit, commit, and push happens serially in this main
  session.
- Never run /init. Never run a production build or clear caches
  while the dev server is running. Dev server law (SOP section 8):
  check 3001 first (`lsof -i :3001`), use it if present, NEVER
  restart or kill it; if you must start one, use another port,
  track its PID, and kill only that PID when done.
- No em dashes anywhere, in code or docs. Verify with
  `grep -rn $'\xe2\x80\x94'` on every file you touch before each
  commit.
- Never sed or awk on markup or CSS.
- Contract law: presentation may change; what a component reports
  may not. The ONLY contract changes authorized are the plan
  section 1.6 table: KitImageCreatorPanel new at 1.0.0, and
  KitStudioPage 1.0.0 to 1.1.0 ONLY if the rail cannot compose
  inside the existing `children` slot (try composition first). If
  any step appears to need any other contract, ViewModel, or
  data-flow change, STOP that phase and write it up; never decide
  it.
- No decision is made for Brian. The plan's OPEN FOR BRIAN list
  (items 1 through 30) names every open pick with its built
  default; build the defaults, never resolve the items. Anything
  new goes in the report under OPEN FOR BRIAN with the work
  stopped at that point.
- Definition of done per phase: `docs/APP-FUNCTION-MAP.csv` gains
  or updates a row for every control shipped, in the same commit,
  preserving the file's CRLF line endings and 21-column shape
  (validate with the csv module after editing). Do NOT hand-edit
  `docs/APP-FUNCTION-MAP.md`; log "rollup not regenerated, script
  not in repo" in the report.

## STOP RULES

- Commit and push at the end of every phase, with a descriptive
  message per logical chunk.
- Never start a phase you cannot finish AND verify inside your
  remaining context. Phase boundaries are the sanctioned clean
  stop points.
- If a phase fails verification twice, or your remaining context
  drops below roughly 15 percent: stop immediately, update
  `docs/HANDOFF-NEXT-CHAT.md` with exact per-phase state (each
  phase DONE with commit hash, or STOPPED with what is done, what
  is not, and the exact next action), zero em dashes in it,
  commit, push, end the session.
- If a rule cannot be applied mechanically, or the repo
  contradicts this brief's premise anywhere (for example the
  KitDropdown contract not at 1.1.0, or FixtureActionNotice.jsx
  missing), stop that unit and report it. Never guess.

## VERIFY (run at the end of every phase, before its commit is called done)

Rendered checks only, via Chrome DevTools MCP against the running
dev server (dev server law), on the auth-free mirror routes and
package previews:

1. EMULATE viewport 390x844, deviceScaleFactor 2, mobile true,
   touch enabled, FIRST. Walk every fixture state and every new
   surface. No horizontal overflow, nothing clipped, everything
   reachable, touch targets 44px or larger at coarse pointers.
2. Then 1440 wide. Same walk. For page phases, walk with the
   mirror sidebar expanded AND collapsed.
3. Targeted measurements via evaluate_script:
   - R1 five-edge measurement on the Images page (filter line
     inner row, heading block, grid container, load-more, banner)
     within 1px at both widths, both sidebar states, with the rail
     present (1100 and up) and absent.
   - R4: at 390 the creator panel modal, the ingredient picker,
     and the save-preset modal each measure the full viewport
     (within the safe-area inset).
   - Sticky: at 1440 the rail's top edge tracks the filter line
     with no gap and no overlap through a full-page scroll; at 390
     the create CTA's bounding box stays fully inside the viewport
     at the top, middle, and bottom of the scroll range.
4. Console: zero NEW errors. Known pre-existing noise: one
   crestfall-seal.svg preload warning.
5. ESLint on every touched file: zero NEW errors. Known
   pre-existing: three `react-hooks/static-components` errors in
   `StudioSidebar.view.jsx`; they stay, they do not count.
6. Zero em dashes in every touched file.
7. Production build exit 0 at session start (FIRST ACTIONS 2) and
   again at session end, dev server stopped first.

## THE FIVE PHASES

### Phase 1: the KitImageCreatorPanel package

Per plan section 1.1. Build the full LOOM package
(`components/kit/image-creator-panel/` plus the
`components/kit/KitImageCreatorPanel.jsx` shell) and its preview
route `app/dev/ui-preview/kit-image-creator-panel/`. Anatomy: mode
row (Image / Video, aria-pressed), the six ingredient slots with
the LIVE labels (Character, Player Character, Pose, Clothing
Source, Location / Scene, Rendering Preset; character and player
character mutually exclusive; clear controls; custom-mode inline
editor with Back to presets / Save as preset / Clear), prompt
textarea, the single Options expander (five KitDropdown
single-selects each with `ariaLabel`, plus negative prompt),
the generate block (fixture coin line, availability help line,
Generate opening the R4 notice, honest disabled states), and the
video block (three dropdowns, direction textarea, "Generate video
soon" disabled stub). Fixtures: default, emptySlots,
insufficientCoins, customIngredient, videoMode, longestContent.
Contract 1.0.0, version on line 1. Preview walks every fixture.
CSV rows for the panel's controls land in phase 3 with the page;
this phase logs none. VERIFY per the standard walk on the package
preview. Commit, push.

### Phase 2: the ingredient picker and save-preset modals

Per plan sections 1.2 and 1.3. Both on KitModalFrame variant
modal, opened from the panel: the picker (kit-search-input search,
fixture ingredient card grid per slot type, Use Once card, New
Preset card, load-error fixture), the save-preset modal (Preset
Name required, Description, Prompt / Guidance, Tags on cf-field
recipes with counters, Save as preset and Use once actions, saving
state disables close, save opens the R4 notice). Fixtures per plan
section 4. VERIFY: full-screen at 390 (R4), centered at 1440;
Escape and backdrop layering (picker closes first, panel modal
second when stacked on mobile); search filters; mutually exclusive
slot rule holds through the picker path. Commit, push. CLEAN STOP
PERMITTED here.

### Phase 3: Images page integration

Per plan section 1.4. Desktop 1100 and up: sticky right rail
(width 24rem default, sticky top offset calc of `--topbar-h` plus
the filter line height plus `--space-4`, internal scroll), grid
drops one column while the rail is present. Under 1100: sticky
bottom-right create CTA opening the panel as a full-screen modal
at 390 (centered 700 to 1099). The mirror gets the same
composition. Law edits per plan 1.5 (blueprint 2.16 (u), 3.1 row 5
note). CSV: a row per panel control on `/studio/v2/images`,
destination "Create > Images"; update the two image-studio
slot-label rows to the live labels (plan 2.5) in the same commit.
Parity echo in the report per plan 1.1's disposition table: all 58
live creator units accounted panel / library grid / viewer
reconciliation, each named. VERIFY per the standard walk plus the
R1 five-edge and sticky measurements at both widths and both
sidebar states, every fixture state, panel open and closed.
Commit, push. CLEAN STOP PERMITTED here.

### Phase 4: review-gate deferrals

Per plan section 2, ONLY the items needing no ruling: 2.2 (account
counters gain aria-describedby wiring from each field to its
counter, counter keeps aria-hidden off in that case; verify with
an accessibility-tree read that names stay clean and descriptions
carry the cap) and any plan-2 item whose OPEN FOR BRIAN ruling has
landed in the plan since (check the plan file's git history; if
none, 2.2 alone). Do NOT touch 2.1, 2.4, 2.6, 2.7 without their
rulings. VERIFY per the standard walk on the account mirror.
Commit, push.

### Phase 5: closing sweep, handoff, report

Stop the dev server you started (only your own PID). Production
build; must exit 0. Update `docs/HANDOFF-NEXT-CHAT.md` with this
pass's state at the top (per-phase echo, contract version table,
the parity echo summary, open picks), zero em dashes, committed
and pushed as the final commit. Then produce the REPORT below.

## REPORT (end of session)

Echo this brief's manifest part by part, each part marked DONE or
STOPPED, in the established HANDOFF-NEXT-CHAT.md style:

1. Per phase: DONE with commit hash(es), or STOPPED with exact
   state and next action.
2. The verification measurements as measured: the R1 five-edge
   numbers with rail present and absent, the R4 full-screen checks
   for all three new modal surfaces, the sticky-tracking checks at
   both widths.
3. The parity echo: all 58 creator units accounted, plus the CSV
   row count added for the panel.
4. Every OPEN FOR BRIAN item: restate the plan's 30 plus anything
   new the run surfaced. Never resolve one.
5. Everything unverified, named as unverified, including "rollup
   not regenerated, script not in repo".
6. Final `git status` output confirming a clean tree and the
   branch pushed.
