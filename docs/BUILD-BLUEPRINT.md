# Build blueprint

Written 9 Aug 2026 on branch `design/build-blueprint`. Twelve open
judgment calls RULED 9 Aug 2026 on branch `design/token-expansion`, all
option A; each ruling is folded into its chapter below rather than kept
as a separate question. Three chapters: the token expansion plan, the
shared component kit spec, and the nine-page build order. Every
proposed token enters `docs/DESIGN-TOKENS.md` at status `proposed`
first per the DESIGN-TOKENS status vocabulary; a token is written into
`app/theme.css` only once this ruling pass authorizes it (chapter 1,
section 1.10 records exactly what that authorizes). Expansion only: no
existing token, ruling, or brand style is renamed, removed, or
restyled beyond the two ratified bridge-alias migrations recorded in
1.9.

Sources read for this document, in this session: `docs/RESTYLE-RULES.md`,
`docs/CRESTFALL-PRODUCT-MODEL.md`, `docs/APP-FUNCTION-INVENTORY.md`,
`docs/APP-FUNCTION-MAP.csv`, `docs/FRONTEND-SOP.md`,
`docs/DESIGN-TOKENS.md`, `docs/SPRINT-3-PLAN.md`,
`docs/CRESTFALL-DESIGN-CONTEXT.md`, `docs/CONTRACT-REQUESTS.md`,
`docs/REDESIGN-ORDER.md`, `docs/ROADMAP.md`,
`docs/architecture/CRESTFALL_LOOM_PATTERN.md`,
`docs/_legacy-reference/design-system/proof/create-hub.html`,
`app/theme.css`, `app/token-bridge.css`, `app/design-system.css`,
`app/globals.css`, `lib/shared/presentation/terminology.js`.

Two path notes against the brief: no file named
`docs/LOOM-WORKFLOW-GUIDE.md` exists in this repo; the live LOOM
document is `docs/architecture/CRESTFALL_LOOM_PATTERN.md` (promoted 7
Aug 2026 per Sprint 3 item 1.6) and it was read in its place. No
`design-system/proof/` folder exists at the repo root; the proof's
`create-hub.html` lives at
`docs/_legacy-reference/design-system/proof/create-hub.html`
(gitignored evidence, read-only) and was read there.

---

# Chapter 1: token plan

## 1.1 Where the token layer actually is

Located by directory listing and file reads this session:

- `app/theme.css` is the only declaring token file, ruled LOCKED
  (Ruling 1, 7 Aug 2026, per `docs/DESIGN-TOKENS.md` Authority).
  Dark values in `:root`, light overrides in `[data-theme="light"]`.
- `app/design-system.css` is the selector companion (`cf-` classes).
  It consumes tokens and declares none.
- `app/token-bridge.css` is temporary scaffolding: five aliases
  (`--muted-gold`, `--muted`, `--foreground`, `--border`,
  `--font-serif`), each a `var()` onto a real token.
- `app/globals.css` additionally declares six legacy variables outside
  the token system (`--background`, `--panel`, `--panel-strong`,
  `--blood`, `--deep-green`, `--bone-white`) plus the marketing
  `sourcebook-*` family full of raw literals. All six names are already
  listed in DESIGN-TOKENS "Retired names" as pending queue items T4 and
  T2. They are part of the legacy layer but not part of the bridge
  file; their retirement rides T4/T2, not this plan.

## 1.2 Audit against the reference gaps

Each reference gap, what exists today, and the verdict. "Reference"
below means the Brian-supplied research findings; only their structure
is adopted, never their visual style.

| Reference gap | What exists today (file witness) | Verdict |
|---|---|---|
| Ten-step color ladder per family | Gold: 5 solid values (`--gold-bright/action/ornament/deep`, `--tag-fill-ink`, `app/theme.css`). Warm neutrals: 8 solid values (canvas, surfaces 1 to 4, ink triad). Status: 1 solid value each plus alpha bed/border pairs | Gap is real. Ladders built in 1.3, RULED |
| Named surface levels | `--canvas`, `--surface-1..4`, `--surface-footer`, each with a role, legal-on, never-on row (DESIGN-TOKENS Surfaces) | Already satisfied. No new surface tokens; the ramp is anchored onto the neutral ladder in 1.3 for documentation only |
| ~15-step spacing scale on one rhythm | 11 steps, `--space-1..20`, strict multiples of 4 (`app/theme.css`) | Partial. 4 in-rhythm steps built in 1.4, RULED |
| Full desktop/mobile type scale with label styles | 8-step ladder plus eyebrow/cta aliases and label tracking; no mobile pair on any step (`app/theme.css`) | Label styles exist. Mobile pairs built in 1.5, RULED |
| Six elevation levels | Exactly two floating shadows (`--shadow-modal`, `--shadow-popover`) plus `--edge-top`, by explicit ruling: "Exactly two floating tokens" (`app/theme.css` elevation comment; DESIGN-TOKENS Elevation) | RULED: ladder built in 1.6 as structure with only already-ruled values filled; the two-shadow ruling stays true at the value level |
| Six blur levels | `--blur-panel` 2px, `--blur-chrome` 12px, plus one ungoverned 4px mechanism on `.tag--meta` noted in DESIGN-TOKENS | RULED: ladder built in 1.6 documenting the three existing strengths only, bringing the stray 4px under law |
| Five interaction states on every control | States live per recipe (`cf-btn` hover and disabled, `cf-nav-link` hover/active, chip `.sel` in the proof); `--focus-ring` is the one state token; no rest/pressed/disabled tokens exist | Gap is real. State tokens built in 1.7, RULED, including the gold-filled pressed mapping |
| Input anatomy with label/hint/error slots and success/error styling | Field labels ride `FIELD_LABEL_CLASS` at raw `text-[10px]` (Sprint 3 item 4.3, blocked on T10); status triads exist but no named slot anatomy | Anatomy spec is chapter 2 work; no new tokens needed beyond the state set |
| Searchable and multi-select menu anatomy with rich rows | `.cbmenu` recipe (RESTYLE-RULES Filter panels), `cf-dropdown` (`app/design-system.css`), live pickers in the CSV (rows for RoomTemplatePickerModal, ScenarioReferencePickerModal, mechanics module picker) | Chapter 2 work; no new tokens |
| Selectable filter chips with counts | `.fchip` family fully specified, "OPEN: none" (RESTYLE-RULES Tag and filter chips) | Already satisfied; chapter 2 lifts it into a LOOM package |
| Alert tone system | Status usage law (state only, word beside it, no info color) exists; no alert component | Chapter 2 work; neutral tone bed RULED in 2.11 |
| Documented badge taxonomy | `.tag` recipe plus Ruling 3 (Canon stays gold, status badges go neutral) | Already satisfied; chapter 2 lifts it into a LOOM package |

## 1.3 Color ladders (50 tokens, RULED 9 Aug 2026)

Principle: ladders are a PRIMITIVE layer underneath the existing role
tokens, not a replacement for them. Components keep consuming role
tokens (`--gold-action`, `--surface-2`, `--status-danger`). Once a
ladder is ruled, each existing role token's declaration becomes a
`var()` onto its ladder step at the identical value, so nothing renders
differently and nothing is renamed.

Migration note (applies to every ladder): zero renames, zero removals.
Existing role tokens keep their names and values forever; only their
right-hand side changes from a literal to a `var(--<family>-N)` whose
step holds the same literal. Steps marked "unset" carry no value in
this proposal; per the token-first directive (FRONTEND-SOP section 17)
no value is invented here. Unset steps are filled only at a Brian
render sitting.

Step naming runs 1 (lightest) to 10 (darkest) in both themes; the
light theme re-anchors the same step names onto the light values, the
same way the role tokens flip today. Naming scheme RULED 9 Aug 2026:
numbered steps 1 to 10, lightest to darkest (`--gold-4`), not a
hundreds scale and not an extension of role names. Reason: shortest
names, reads in one glance, matches how the surfaces already count
upward.

### Gold ladder, 10 tokens

| Step | Dark anchor | Light anchor | Existing role token that lands here |
|---|---|---|---|
| `--gold-1` | unset | unset | none (reserved palest step) |
| `--gold-2` | `#f2d194` | `#6b4d15` | `--gold-bright` |
| `--gold-3` | unset | unset | none |
| `--gold-4` | `#e0ab5e` | `#7a5717` | `--gold-action` |
| `--gold-5` | `#C9A86A` | `#8a6524` | `--gold-ornament`, `--art-gold` (art constant does not flip; it references the dark value only) |
| `--gold-6` | unset | unset | none |
| `--gold-7` | `#9a7434` | `#4a3812` | `--gold-deep` |
| `--gold-8` | unset | unset | none |
| `--gold-9` | unset | unset | none |
| `--gold-10` | `#1c1408` | `#f7f2e4` | `--tag-fill-ink` (the gold family's own ink; light value is paper per `app/theme.css`) |

The line/fill families (`--line-*`, `--fill-*`) stay alpha derivatives
of `--gold-bright` exactly as built today; a ladder step never replaces
an alpha wash (that construction is load-bearing per the theme.css
"fills share the line base" comment).

### Warm neutral ladder, 10 tokens

Every existing neutral already lands on a step; only two steps are
unset. This ladder is mostly documentation of the ramp that exists.

| Step | Dark anchor | Existing token |
|---|---|---|
| `--neutral-1` | `#ece7dc` | `--ink`, `--art-ink` |
| `--neutral-2` | unset | none (reserved) |
| `--neutral-3` | `#a9a294` | `--ink-dim` (`--art-ink-dim` `#b3aa99` sits between 2 and 3; it stays a constant, not forced onto a step) |
| `--neutral-4` | `#8d8674` | `--ink-faint` |
| `--neutral-5` | unset | none (reserved mid gap) |
| `--neutral-6` | `#2c271e` | `--surface-4` |
| `--neutral-7` | `#24211a` | `--surface-3` |
| `--neutral-8` | `#1d1a15` | `--surface-2` |
| `--neutral-9` | `#16130f` | `--surface-1` |
| `--neutral-10` | `#090805` | `--canvas` |

Light theme anchors flip per the existing `[data-theme="light"]` block
(`#2a2418` ink through `#ebe3d0` canvas). `--surface-footer` stays a
deliberate off-ramp exception (its own comment in `app/theme.css`) and
is not forced onto a step.

### Status ladders, 30 tokens (10 per family)

Success, warning, danger. Base value anchors step 5; every other step
unset pending a render sitting. The bed/border alpha pairs stay exactly
as minted (they follow the fill/line alpha pattern, not the ladder).
The ladder's purpose: hover and pressed values for the filled danger
confirm button, text-on-bed contrast steps, and future dark/light
tuning without new ad hoc literals.

| Family | Step 5 anchor | Steps 1 to 4, 6 to 10 |
|---|---|---|
| `--success-1..10` | `#7D9B6A` at `--success-5` (= `--status-success`) | unset |
| `--warning-1..10` | `#C97B35` at `--warning-5` (= `--status-warning`) | unset |
| `--danger-1..10` | `#C2634D` at `--danger-5` (= `--status-danger`) | unset |

Usage law is untouched: state only, never decoration, a word beside
every use, no info color, one red. The ladder adds shades of the three
ruled hues, never a fourth hue.

## 1.4 Spacing ladder (4 tokens, RULED 9 Aug 2026, 15 steps total)

Existing: `--space-1,2,3,4,5,6,8,10,12,16,20` (11 steps, multiples of
4, suffix times 4 = pixels). Proposed additions on the same rhythm and
the same suffix rule:

| Token | Value | Fills the gap |
|---|---|---|
| `--space-7` | 28px | between 24 and 32, dense builder layouts |
| `--space-9` | 36px | between 32 and 40 |
| `--space-14` | 56px | between 48 and 64, section rhythm |
| `--space-24` | 96px | above 80, page-end banner clearance |

Migration note: pure addition. No existing step moves. RULED 9 Aug
2026: all four steps are added, reaching 15 steps on the one 4px
rhythm. Reason: fills every observed gap once, matching the
reference's roughly 15-step shape; fewer steps leaves the
section-rhythm and page-end gaps above 48px unfillable without
literals, which the token-first directive would then have to reject
one at a time.

## 1.5 Type ladder mobile pairs (16 tokens, RULED 9 Aug 2026)

The desktop ladder stands untouched. Every step gains a named mobile
pair: `--text-<step>-m` and `--lh-<step>-m`, consumed at the 390-width
breakpoint. 8 steps times 2 tokens = 16.

Fill rule, RULED 9 Aug 2026: steps `label`, `ui`, `body`, `lead`
alias their desktop values unchanged (small type does not compress);
steps `subhead`, `heading`, `title`, `display` take the value one
ladder step down (so `--text-title-m` = `var(--text-heading)`, and so
on). This inherits the ratio scale instead of minting new sizes, the
same absorb-without-a-rewrite property the scale was built for (the
type assignment comment in `app/theme.css`); the alternative of bespoke
mobile values per step was rejected as needing a render sitting per
step for marginal gain, and fluid clamp() per step was rejected because
the system deliberately keeps fluid type confined to `--text-hero` and
clamping product UI would break the 4px leading grid. `--text-hero`
already handles its own fluidity via clamp and gets no pair. The
eyebrow and cta aliases follow whatever their referent steps do.

Migration note: pure addition. No live style changes until a package
consumes a `-m` pair; adoption is per package under the normal render
gate.

## 1.6 Elevation and blur ladders (12 tokens, RULED 9 Aug 2026)

Both ladders touch standing rulings (exactly two floating shadows;
exactly one blur strength) and are RULED to be built as structure with
only already-ruled values filled, levels with no ruled value staying
empty. Reason: reference structure gained, zero new visible depth or
blur strength invented, and each standing ruling stays true at the
value level. The alternative of skipping the ladders was rejected
because the reference gap would stay open and every future depth
question would reopen ad hoc; the alternative of minting new real
values for every level was rejected as directly contradicting the
standing rulings without a render sitting.

Design intent for a near-black canvas, from the theme's own physics:
depth on `#090805` cannot come from gray drop shadows (a dark object
behind an element vanishes against near-black; the theme.css glow
comment makes exactly this argument). Elevation here reads as LIGHT and
FROST: a lit top edge (`--edge-top`), a warm umbra that darkens what is
behind the panel (the existing shadow pairs are already warm-tinted on
light theme), and scrim-plus-blur separation for floats. The ladder
formalizes that recipe per level instead of minting six gray shadows.

### Elevation, 6 tokens

| Token | Value | Status |
|---|---|---|
| `--elev-1` | `none` (in-flow surfaces separate by border, per the elevation ruling) | filled, restates law |
| `--elev-2` | `var(--edge-top)` (lit top edge only, raised-in-flow) | filled from existing token |
| `--elev-3` | `var(--shadow-popover), var(--edge-top)` | filled from existing tokens |
| `--elev-4` | `var(--shadow-modal), var(--edge-top)` | filled from existing tokens |
| `--elev-5` | unset (reserved; no surface class needs it today) | needs ruling before any value |
| `--elev-6` | unset (reserved) | needs ruling before any value |

Migration note: `--shadow-modal` and `--shadow-popover` keep their
names and values; the ladder composes them, it does not replace them.
The "exactly two floating shadow tokens" ruling stays true at the value
level: levels 5 and 6 hold no value unless Brian rules new ones.

### Blur, 6 tokens

| Token | Value | Status |
|---|---|---|
| `--blur-1` | `0` | filled, the no-blur floor |
| `--blur-2` | `var(--blur-panel)` (2px, floating veils with `--scrim-strong`) | filled from existing token |
| `--blur-3` | `4px` | filled from the `.tag--meta` legibility mechanism that DESIGN-TOKENS already names as a third, ungoverned strength; naming it brings it under law |
| `--blur-4` | unset (reserved) | needs ruling |
| `--blur-5` | `var(--blur-chrome)` (12px, persistent chrome frost) | filled from existing token |
| `--blur-6` | unset (reserved) | needs ruling |

Migration note: `--blur-panel` and `--blur-chrome` keep their names;
role pairing law (panel blur always with `--scrim-strong`, chrome frost
never with a scrim) is untouched.

## 1.7 Five-state tokens (6 tokens, RULED 9 Aug 2026)

The five states every control must define: rest, hover, focus,
pressed, disabled. Today each recipe hand-writes its own (witnesses:
`cf-btn` hover/disabled and `cf-nav-link` hover/active in
`app/design-system.css`; chip `.sel` in RESTYLE-RULES). Proposed: one
state token set that every kit control consumes, so a state reads the
same everywhere and can be tuned in one line.

| Token | Proposed value | Covers |
|---|---|---|
| `--state-hover-fill` | `var(--fill-whisper)` | hover bed on quiet surfaces (matches `cf-nav-link:hover`) |
| `--state-hover-line` | `var(--line)` | hover border lift (matches chip hover) |
| `--state-pressed-fill` | `var(--fill)` | pressed bed (matches `cf-nav-link:active`) |
| `--state-pressed-gold` | `var(--gold-deep)` | pressed state of gold-filled controls (`--gold-deep`'s ruled role is already "pressed states") |
| `--state-disabled-opacity` | `0.5` | disabled dimming (matches `cf-btn:disabled` opacity .5) |
| `--state-focus-ring` | `var(--focus-ring)` | focus; pure alias so kit specs can name one state family. `--focus-ring` remains the law and the only declaring token |

Rest is the component's own idle recipe and needs no token. Gold-filled
pressed treatment RULED 9 Aug 2026: pressed swaps the fill to
`--gold-deep` via `--state-pressed-gold`, using the value already
minted for the job rather than a motion-only change (invisible under
reduced motion) or no distinct pressed state (touch has no hover, so a
control needs its own pressed signal). Migration note: pure addition;
existing recipes migrate to the state tokens per package, zero visual
change where values match (they are chosen to match).

## 1.8 Token count by group, RULED 9 Aug 2026

| Group | New tokens |
|---|---|
| Gold ladder | 10 |
| Warm neutral ladder | 10 |
| Status ladders (3 x 10) | 30 |
| Named surface levels | 0 (already satisfied) |
| Spacing | 4 |
| Type mobile pairs | 16 |
| Elevation | 6 |
| Blur | 6 |
| Five-state set | 6 |
| Total | 88 |

All 88 enter `docs/DESIGN-TOKENS.md` at status `proposed` in this same
ruling pass. Every unset ladder step stays exactly that: a documented
placeholder with no value, never written into `app/theme.css` until a
real value is ruled (maintenance law, FRONTEND-SOP section 4: a new
token enters theme.css only through a Brian ruling, with name, both
theme values, role, legal-on/never-on, and status in the same commit).
Section 1.10 states precisely what this 9 Aug 2026 ruling authorizes
in code.

## 1.10 What this ruling authorizes for execution

This ruling pass authorizes writing the 88 tokens above into
`app/theme.css` and `docs/DESIGN-TOKENS.md` at status `proposed`,
filled only where a value already exists in the ruled system (every
"unset" cell in 1.3 through 1.7 stays unset in code, declared as a
comment placeholder, never a literal). It authorizes no restyle: no
component migrates to consume a new token in this pass, and no
existing role token's declaration is rewritten onto a ladder `var()`
yet, that migration is separate execution work the ladders make
possible, not part of this ruling. It also authorizes bridge shrink
steps one and two (1.9): the `--border` and `--font-serif` alias
migrations, chosen because both are small, fully mapped, and produce
zero visual change. The three large bridge aliases stay untouched this
phase.

## 1.9 Shrinking app/token-bridge.css to zero

The bridge holds five aliases. Reference counts measured this session
(grep over `components/`, `app/`, `lib/`, excluding the bridge file
itself):

| Alias | Resolves to | References | Files |
|---|---|---|---|
| `--muted-gold` | `--gold-ornament` | 1,257 | 236 |
| `--muted` | `--ink-dim` | 811 | 228 |
| `--foreground` | `--ink` | 547 | 224 |
| `--border` | `--line-strong` | 10 | 6 |
| `--font-serif` | `--font-display` | 5 direct (all in `app/globals.css`), plus 42 `.font-serif` class usages in `components/` and `app/` that resolve through the `globals.css` rule |

Plan, in order, one alias at a time per the bridge's own header rule:

1. `--border` first: 6 files (`components/LoreCard.jsx`,
   `components/TimelineCard.jsx`, `components/LoreArcAccordion.jsx`,
   `app/page.js`, `app/globals.css`, plus one preview-harness file that
   is out of product scope). Textual swap to `var(--line-strong)`, zero
   visual change (the alias already resolves there), one commit, then
   delete the alias line.
2. `--font-serif` second: migrate the `.font-serif` class rule in
   `app/globals.css` to `var(--font-display)` directly, then migrate
   the 42 class consumers to `font-display` per the retired-names row
   in DESIGN-TOKENS (the alias was restored by Sprint 3 item 1.1
   precisely so this migration could happen without a broken serif in
   the meantime). Delete the alias when the count is zero.
3. The big three (`--muted-gold`, `--muted`, `--foreground`) ride the
   already-ruled Phase 3 "legacy shim vars" bucket
   (`docs/SPRINT-3-PLAN.md`: 220 findings, 97 packages, zero visual
   change, one package one commit). The counts above show the full
   fleet is larger than the inventory's bucket; the rule is the same:
   textual swap per the debt map, verified per package on its preview
   route. Interactive-gold graduation to `--gold-action` is NOT part of
   this migration; T3 governs it and candidates are logged, never
   swapped (DESIGN-TOKENS gold section).
4. Delete `app/token-bridge.css` and its `@import` in `app/globals.css`
   when the last alias goes. The file's own header already mandates
   exactly this endgame.

Progress metric per sprint: rerun the five grep counts, record them in
the sprint closing report next to the out-of-contract counts
(FRONTEND-SOP section 4 cadence). Done means five zeros and a deleted
file.

Out of scope for the bridge plan, tracked so it is not lost: the six
legacy variables and raw literals declared in `app/globals.css` are
queue items T4 and T2 (already in DESIGN-TOKENS retired names and
proposed tables). `--background` still has 24 references outside
`globals.css` (measured this session); the others measured zero
consumers outside `globals.css` itself.

---

# Chapter 2: shared component kit spec

## 2.0 Ground rules for every kit piece

- LOOM shape per `docs/architecture/CRESTFALL_LOOM_PATTERN.md` and
  FRONTEND-SOP section 1: `FeatureName.jsx` shell one level up, then
  `feature-name/FeatureName.view.jsx`, `useFeatureNameViewModel.js`,
  `FeatureName.contract.js` (version on line 1),
  `FeatureName.fixtures.js` (default, empty, error, loading where
  async exists, longest-content), `README.md`, and a preview route at
  `app/dev/ui-preview/<feature-name>/` that returns `notFound()` in
  production.
- Five states on every control: rest, hover, focus, pressed, disabled,
  consuming the chapter 1 state tokens (`--state-hover-fill`,
  `--state-hover-line`, `--state-pressed-fill`, `--state-pressed-gold`,
  `--state-disabled-opacity`, `--state-focus-ring`). Focus is never
  removed; the global rule in `app/design-system.css:167` already
  covers every interactive element and kit pieces do not opt out.
- Tokens only, mobile first at 390, touch targets resolve to
  `--control-md`, radius by the two-tier corner test, no em dashes, no
  contract or ViewModel changes inside a restyle (contract law,
  FRONTEND-SOP section 13). Where a kit piece needs data that does not
  exist, it builds the real View, ViewModel, and contract against the
  expected shape and feeds them from one named mock module per the
  CONTRACT-REQUESTS process note (CR-017 is the worked example).
- Function map: every control a kit piece ships gets its row in
  `docs/APP-FUNCTION-MAP.csv` in the same commit (definition of done,
  FRONTEND-SOP section 14).

State shorthand used below: REST / HOVER / FOCUS / PRESSED / DISABLED.
FOCUS is always `--state-focus-ring` (or the sanctioned quieter
`cf-field` variant inside dense modal field grids) and is not repeated
in every row.

## 2.1 Sticky filter bar (`studio-filter-bar`)

The five shared patterns 2.1 through 2.5 come from the ruled library
skeleton (RESTYLE-RULES Hub layouts and Ruling 8): page head, action
row, banner, sticky filter bar, grid, endcap. Live witnesses:
`ResponsiveFilterPanel` and the hub-level bars named in
`docs/SPRINT-3-PLAN.md` Phase 2.4, currently blocked on their raw
`rgba()` panel literals (T2/T8).

- Anatomy: sticky container under the topbar (`position: sticky`,
  z-index above content), canvas-tinted translucency
  (`color-mix(in srgb, var(--canvas) 88%, transparent)`) with
  `backdrop-filter: blur(var(--blur-chrome))`, full-bleed margin trick,
  containing: search input (optional), filter chip row (2.7), sort
  chip, view-mode toggle slot (the existing `ViewModeToggle` package
  slots in unchanged). On phone, the overflow menu docks to the bottom
  edge using the unified modal frame (Ruling 7 in RESTYLE-RULES).
- States: the bar itself has REST only (chrome does not hover); every
  control inside carries its own five states (chips 2.7, menus 2.9).
- LOOM: `StudioFilterBar.jsx` shell;
  `studio-filter-bar/StudioFilterBar.view.jsx`, contract (filter
  groups, selected values, counts, sort options, semantic callbacks
  `onFilterToggle`, `onSortChange`, `onSearchChange`), fixtures
  (default, empty groups, longest labels, many-chips overflow, loading
  counts), `useStudioFilterBarViewModel.js`, README, preview route.
- Note: presentation change only; each hub's existing filter wiring
  (operation names in the CSV) must remain reachable per contract law.

## 2.2 Global search (`global-search`)

Witness: the top bar Search input is STUBBED, presentation-only, with
`searchValue`/`onSearchChange` already on the StudioTopBar contract and
no endpoint to wire to (CSV row 17; CR-012).

- Anatomy: input in the sticky topbar (desktop) and a full-width row
  under the mobile header; placeholder text `--ink-faint`, entered
  value `--ink` (Ruling 3, the Lilith defect fix); results surface is a
  popover panel on `--surface-4` with `--shadow-popover`
  (`cf-dropdown` recipe), rich rows per 2.9, grouped by type using the
  display names in `lib/shared/presentation/terminology.js`.
- States: input REST (surface-1 bed, `--line-whisper` border), HOVER
  (`--state-hover-line`), FOCUS, PRESSED (n/a for text input; the
  clear affordance is an icon button with all five), DISABLED
  (`--state-disabled-opacity`). Results panel: loading, empty ("no
  matches" with the word, ink family, no info color), error
  (`--status-danger` text with a word), populated.
- LOOM: `GlobalSearch.jsx` shell; `global-search/` View, contract
  (`searchValue`, `results[]` grouped, `onSearchChange`,
  `onResultSelect`), fixtures (idle, typing, loading, results, empty,
  error, longest titles), ViewModel stub that keeps `onSearchChange` a
  safe no-op behind one named mock module until CR-012's endpoint
  lands, README, preview route.
- Blocked note: shipping real search waits on CR-012 (Nick). The kit
  piece itself is buildable now under the mock-module process note.

## 2.3 Bottom promo banner (`promo-banner`)

Witness: banner taxonomy treatment (a) (RESTYLE-RULES, corrected 4 Aug
2026): full width at page end, uniform screen `--scrim-strong`,
copy/CTA centered both axes, `--radius-lg` (full-content-width surface,
corners final ruling). The proof's `.endcap` in `create-hub.html` is
the shape: art, veil, eyebrow (in `--art-gold` over artwork), display
heading, one line, one `--lg` CTA.

- Anatomy: art layer, uniform veil layer (`var(--scrim-strong)`, token
  never literal, Ruling 7 detection law), centered body stack (eyebrow
  with ruled mark, `--font-display` heading, `--art-ink-dim` line, one
  primary CTA). Text over artwork uses the three `--art-*` constants
  only. No blur (blur never on banners).
- States: the banner surface is REST only. The CTA carries all five
  (primary button recipe `cf-btn--primary`; PRESSED via
  `--state-pressed-gold`, RULED 9 Aug 2026 per 1.7).
- LOOM: `PromoBanner.jsx` shell; `promo-banner/` View, contract
  (`eyebrow`, `title`, `line`, `ctaLabel`, `imageSrc`, `onCtaClick`),
  fixtures (default, longest copy, missing image fallback onto
  `--surface-2`, disabled CTA), ViewModel, README, preview route.
- The other two banner treatments (banner card, top banner) are the
  same package with a `treatment` prop constrained to the three ruled
  names; fade direction and copy anchor are fixed per treatment, never
  configurable per instance (banner taxonomy).

## 2.4 Load-more (`load-more`)

Witnesses in the CSV: image-studio history Load More (cursor-paged
fetch, row at line 616 area), media panel Load More (local slice),
featured picker Load More, community Load more with IntersectionObserver
auto-trigger. REDESIGN-ORDER line 565 names the target: a `--radius-md`
button, centered.

- Anatomy: one centered secondary button (`cf-btn--secondary` recipe)
  under the grid; optional auto-load on scroll proximity where the
  consuming page already does that (community); a quiet exhausted line
  ("You have seen everything here", ink-dim, no color) when the list
  ends; count text `--ink-faint` tabular-nums optional.
- States: REST, HOVER (border to `--gold-action` plus `--glow-hover`),
  FOCUS, PRESSED, DISABLED; plus the two content states loading
  (spinner plus the word "Loading", control disabled) and exhausted
  (button replaced by the quiet line).
- LOOM: `LoadMore.jsx` shell; `load-more/` View, contract
  (`isLoading`, `hasMore`, `remainingCount` nullable, `onLoadMore`),
  fixtures (default, loading, exhausted, unknown-count), ViewModel,
  README, preview route.

## 2.5 Unified modal frame (`modal-frame`)

Witnesses: Ruling 1 (one frame for modal, picker, sheet), the
`cf-modal-veil` / `cf-modal-frame` / `cf-modal-close` recipes already
in `app/design-system.css`, and the ruled ModalShell/StudioShell carve
(T9, Sprint 3 item 1.7, the first work of Phase 1).

- Anatomy: veil `--scrim-strong` with `blur(var(--blur-panel))`; frame
  `--surface-4`, `1px --line` border, `--radius-lg`, `--shadow-modal`;
  phone docks to the bottom edge (top corners only), 700px and up
  centers; circular close control (`--control-md`, `--radius-full`,
  `--surface-2` fill, `--line-whisper` border); X, veil click, and
  Escape all close in place keeping work; per-layer scroll locks stay
  separate (Ruling 1). Width/height stay per-surface, not unified.
- States: the frame is REST only; close control carries all five.
  Content states (loading, error, empty) belong to the content the
  consumer slots in.
- LOOM: this is the ModalShell carve that T9 already rules:
  `ModalShell.jsx` becomes the shell;
  `modal-shell/ModalShell.view.jsx`, contract (open state, close
  callbacks, panel slot, per Sprint 3 item 1.7), fixtures (open,
  longest content, phone dock, stacked-picker-over-modal lock case),
  ViewModel, README, preview route.
- Standing conflict, already queued, not re-decided here: the creator
  modal's phone bottom-dock vs the proof's ratified centered modal is
  T12. The kit frame docks per Ruling 1; the creator adopts the frame's
  fill and blur only (Sprint 3 item 4.1) until T12 is ruled.

## 2.6 Card anatomy (`creation-card` list and grid)

Witnesses: the four card sub-species (base, art-bleed, creator, wall)
in RESTYLE-RULES Cards; the CSV's grid/list toggle on story-rooms
(ViewModeToggle, persisted view mode); the media tile quick actions and
lightbox rows on image-studio and image-library.

- Grid card anatomy (art-bleed species): `--surface-2`, `1px --line`
  border, `--radius-md` (grid sibling), zero padding art to the edge,
  bottom seam fade to `--canvas`, body block (title `--text-lead`
  display face, meta `--ink-dim`), tag row (badges 2.10, recipes keyed
  to background: over art vs on canvas), stat row (plays, hearts,
  saves, followers order, `--space-1` gap, `--icon-sm`, tabular-nums,
  Ruling 4 values).
- List card anatomy (row species): flex row on `--surface-1` or
  `--surface-2` per context, thumbnail at `--radius-sm` (the one small
  art exception), same title/meta/tag/stat slots, actions right.
- Image actions, scoped strictly to functionality that exists in the
  inventory today:
  - image view: clicking the image opens the media lightbox
    (`MediaLightbox`, CSV image-studio and image-library rows).
  - zoom: RULED 9 Aug 2026, zoom means the existing Expand quick
    action, which opens the same lightbox (CSV: "Expand: opens the
    lightbox for that card"); nothing new. No pinch or in-lightbox
    zoom control exists in the inventory and none is specified here,
    since the inventory contains no other zoom functionality and card
    anatomy is scoped to what exists; an in-lightbox zoom control would
    be new functionality needing a CR and Nick, out of scope here.
  - share: the lightbox Share button (navigator.share, clipboard
    fallback, status word shown; CSV row notes it shares the page URL,
    not a canonical image link, which stays a logged limitation, not a
    design fix). On cards outside the lightbox, share renders only
    where a share control already exists in the inventory, always icon
    plus the word "Share" (Ruling 6), ghost small button.
  - the other quick actions that exist (Like, Bookmark, Download where
    `allowDownload`, Delete with confirm) keep their wiring; Delete
    follows the destructive law (quiet ghost, `--status-danger` word;
    filled danger only inside the confirm step, which must use the
    modal frame, not `window.confirm`, a gap REDESIGN-ORDER already
    flags on image-library).
- States, card surface: REST (border `--line`), HOVER (wall species:
  translateY(-2px) plus `--glow-hover`; row species: border to
  `--state-hover-line`), FOCUS, PRESSED (`--state-pressed-fill` flash),
  DISABLED (`--state-disabled-opacity`, non-navigable). Every quick
  action button carries its own five states.
- LOOM: `CreationCard.jsx` shell; `creation-card/` View with a
  `layout` prop constrained to `grid | list`, contract (display-ready
  fields only: title, subtitle, imageSrc, badges[], stats{}, action
  callbacks by intent), fixtures (default, no image, longest title,
  badge overflow, disabled, list and grid at both widths), ViewModel,
  README, preview route.

## 2.7 Filter chips (`filter-chip`)

Witness: the `.fchip` family, fully specified, "OPEN: none"
(RESTYLE-RULES Tag and filter chips). This kit piece is a lift, not a
redesign.

- Anatomy: `--surface-1` bed, `1px --line-whisper` border,
  `--radius-md` (chips are controls, not labels), `min-height
  --control-sm` bumping to `--control-md` at coarse pointers,
  `--text-ui` `--ink-dim` label, optional count badge (`--text-label`,
  `--ink-faint`, `--gold-ornament` when selected, tabular-nums),
  variants: sort chip (`--surface-2` bed), select-toggle (dashed
  border; armed = `--grad-gold` fill with `--tag-fill-ink` text),
  dropdown trigger chip (expanded = selected treatment).
- States: REST as above; HOVER border `--line` text `--ink`; FOCUS;
  SELECTED (the chip's own state law: border `--gold-action`, text
  `--gold-bright`, inset 1px `--gold-action` ring) with selected+hover
  keeping the selected treatment; PRESSED `--state-pressed-fill`;
  DISABLED opacity .45 per the proof recipe (kept verbatim; it
  predates the state token and is listed in the migration note as the
  one value that differs from `--state-disabled-opacity`, OQ nothing:
  the recipe is fully ruled, the state token adopts .45 for chips).
- LOOM: `FilterChip.jsx` shell; `filter-chip/` View, contract
  (`label`, `count` nullable, `isSelected`, `variant`, `onToggle`),
  fixtures (default, selected, counted, dashed toggle armed, disabled,
  longest label), ViewModel (thin), README, preview route.

## 2.8 Field anatomy (`form-field`)

Witnesses: label class today is raw `text-[10px]` tracking literal
(`FIELD_LABEL_CLASS`, Sprint 3 item 4.3, blocked on T10); placeholder
vs value is Ruling 3; counters are `--ink-faint` (DESIGN-TOKENS ink
roles); folding inputs and per-section character counters exist in the
creator's Advanced Creator Guidance and Advanced Prompting (CSV rows
281 to 283: expand/collapse sections, per-section maxLength, one
32,000-character combined budget).

- Anatomy, four slots plus the input:
  - label: `--text-label`/`--lh-label`, `--track-label`, uppercase,
    `--ink-faint` (adopting the token scale is the T10-ruled endpoint;
    until T10, new kit fields use the tokens and legacy fields stay
    logged).
  - input bed: `--surface-1`, `1px --line-whisper` border,
    `--radius-md`, `--control-md` height, value `--ink`, placeholder
    `--ink-faint` (never `--ink-dim`).
  - helper line: `--text-ui`, `--ink-dim`, below the input.
  - error line: `--text-ui`, `--status-danger`, with the word (never
    color alone); the input border moves to `--status-danger-border`
    and the bed may take `--status-danger-bed`. Success confirmation
    uses the success triad the same way. Warning stays reserved.
  - counter: `--text-label`, `--ink-faint`, tabular-nums, right-aligned
    on the label row or under the field matching current creator
    placement; at limit it takes `--status-danger` plus the word
    "limit".
- Folding inputs preserved: a fold is a disclosure header (chevron plus
  section label, full five states) revealing the field group beneath;
  the fold state is presentation-only local state per the LOOM view
  rules. Per-section counters and the combined budget line render
  exactly as the creator does today; the budget line is a counter slot
  at group level.
- States on the input: REST, HOVER (`--state-hover-line` border),
  FOCUS (global ring, or the sanctioned 1px `cf-field` variant inside
  dense modal grids), PRESSED n/a for text (applies to
  select/toggle-shaped fields), DISABLED (`--state-disabled-opacity`,
  label stays `--ink-faint`).
- LOOM: `FormField.jsx` shell; `form-field/` View, contract (`label`,
  `helper`, `error`, `success`, `value`, `placeholder`, `maxLength`,
  `count`, `isFolded`/`onToggleFold` optional, semantic `onChange`),
  fixtures (default, filled, error, success, counter at limit, folded,
  disabled, longest label), ViewModel, README, preview route.

## 2.9 Picker and menu anatomy (`picker-modal` and `menu-popover`)

Witnesses: menu box recipe `cf-dropdown` (`app/design-system.css`) and
the `.cbmenu` row recipe (RESTYLE-RULES Filter panels); searchable
multi-select pickers live in the CSV: RoomTemplatePickerModal (toggles
owned creations into `selectedCharacters`, so multi-select exists),
ScenarioReferencePickerModal (search plus type filters, empty state "No
matching creations found"), the mechanics module picker (tabs, search,
rich result cards), the featured image picker (refresh, use-as-slot,
load more). CR-009 records that no SHARED visual picker component
exists yet; this kit piece is that component.

- Menu popover anatomy: `--surface-4`, `1px --line`, `--radius-md`,
  `--shadow-popover`, `--space-2` padding, min 13rem, max 19rem
  scrolling; section label rows `--text-label` uppercase `--ink-faint`;
  rows `--control-sm` min height, `--radius-sm`.
- Menu row states: REST `--ink-dim`; HOVER `--fill-whisper` bed, ink
  text; FOCUS; SELECTED `--gold-bright` text with a check mark from
  the icon sprite (symbols-by-job ruling: functional marks come from
  the sprite, never bare glyphs); PRESSED `--state-pressed-fill`;
  DISABLED `--state-disabled-opacity`.
- Picker modal anatomy: unified modal frame (2.5) carrying: search
  field (form-field anatomy, search variant), filter chip row where
  the source picker has one, rich rows or tile grid: thumbnail at
  `--radius-sm`, title `--ink`, supporting line `--ink-dim`, badges
  quiet, trailing state mark. Multi-select: each row toggles; selected
  rows take the chip selected law (border/inset `--gold-action`, text
  `--gold-bright`); a sticky footer reports the count in words plus
  Confirm and Cancel buttons. Single-select keeps the same rows with
  immediate select-and-close, matching the live pickers.
  Load-more (2.4) slots in where the source is paged.
- Picker states: rows carry the six states above; the picker's content
  area carries loading, empty (words, ink family), and error
  (`--status-danger` with words) fixtures, matching the states the CSV
  already records for the live pickers.
- LOOM: `PickerModal.jsx` shell; `picker-modal/` View, contract
  (`items[]` with display-ready row shape, `selectedIds[]`,
  `isMultiSelect`, `searchValue`, `filters`, `onSearchChange`,
  `onToggleItem`, `onConfirm`, `onClose`), fixtures (single, multi
  with selections, searching, empty, loading, error, longest rows),
  ViewModel, README, preview route. `MenuPopover.jsx` ships the same
  way as its own smaller package.
- Contract-law note: converting an existing picker to this kit piece
  must keep reporting the same selection to the same handler; if any
  live picker's contract cannot map, that picker stops and escalates
  (FRONTEND-SOP section 13). CR-009's wizard/picker confirmation from
  Nick governs the Player Character creator's adoption.

## 2.10 Badge set (`badge`)

Witnesses: the `.tag` recipe and Ruling 3: Canon is the ONLY gold
badge; Private, Internal, Public and every other status badge are
quiet. Category never carries color (tag beds keyed to background, not
category; the word does the work). The four-state visibility enum is
the product model's; its data-model landing is CR-014.

- Anatomy: pill (`--radius-full`, badges are labels, not controls),
  `--space-6` height, `--text-label` uppercase `--track-label`
  `--weight-medium`; bed keyed to background: on canvas
  `--tag-bed-canvas` no border `--gold-bright` text; over art
  `--tag-bed-art`, `1px --line`, `--ink` text.
- Constrained set: `canon` (gold text everywhere, including the
  over-art override that keeps it gold), `status` (Private / Internal /
  Public and kin: `--ink-dim` on canvas, inherited `--ink` over art),
  `meta` (the blur(4px) legibility variant). Nothing else. No new
  badge colors, ever, without a ruling; a category needing distinction
  gets a word, not a hue.
- States: badges are non-interactive labels; REST only. A dismissible
  or clickable "badge" is not a badge, it is a chip (2.7) and uses the
  chip recipe (shape law: pill = label, rectangle = control).
- LOOM: `Badge.jsx` shell; `badge/` View, contract (`label`, `variant`
  constrained to the set, `surface` background key), fixtures (each
  variant on canvas and over art, longest label), thin ViewModel,
  README, preview route.

## 2.11 Alert tones (`alert-strip`)

Witnesses: the status usage law (three statuses, a word beside every
use, deliberately NO info color; sky-blue info states are removed, not
converted); the proof's one sanctioned explainer container, the
`.stripinfo` info strip in `create-hub.html` (gold-ornament icon,
`--fill-whisper` bed, `--line` border), which maps to the neutral tone.

- Anatomy: full-width in-flow strip, `--radius-md` (in-flow, grid
  tier), icon from the sprite at `--icon-sm`, `--text-ui` body, one
  optional inline action button; every tone ships with its words.
- Tones, exactly four:
  - success: `--status-success-bed` bed, `--status-success-border`
    border, `--status-success` icon/lead word, `--ink` body.
  - warning: warning triad, same shape; used only where no other
    signal works (warning is reserved).
  - danger: danger triad, same shape.
  - neutral: ink family text on a quiet bed with `--line` border. Bed
    RULED 9 Aug 2026: `--fill-whisper`, matching the proof's sanctioned
    info strip exactly, since it is the only neutral explainer
    container the draft ever ratified (a `--surface-1` bed was
    rejected as reading like an input well, not a notice; no bed at
    all was rejected as losing the one sanctioned home for explainer
    copy and inviting the orphan loose text the proof explicitly
    bans). No info color exists and none is minted; neutral IS the
    info tone, rendered through ink.
- States: the strip is REST only; a dismiss control or inline action
  carries all five states.
- LOOM: `AlertStrip.jsx` shell; `alert-strip/` View, contract
  (`tone` constrained to the four, `title`, `body`, `actionLabel`,
  `onAction`, `onDismiss` optional), fixtures (all four tones, with
  and without action, longest copy), ViewModel, README, preview route.

## 2.12 Kit summary

| # | Package | Five states | LOOM files |
|---|---|---|---|
| 2.1 | studio-filter-bar | on every contained control | shell, view, contract, fixtures, viewmodel, README, preview |
| 2.2 | global-search | yes (input and rows) | same |
| 2.3 | promo-banner | on CTA | same |
| 2.4 | load-more | yes | same |
| 2.5 | modal-frame (ModalShell carve, T9) | on close control | same |
| 2.6 | creation-card (list and grid) | yes, card and quick actions | same |
| 2.7 | filter-chip | yes plus selected | same |
| 2.8 | form-field | yes plus error/success | same |
| 2.9 | picker-modal and menu-popover | yes plus selected | same |
| 2.10 | badge | rest only by law (labels) | same |
| 2.11 | alert-strip | on contained actions | same |

---

# Chapter 3: build order

## 3.0 The nine pages and the sequencing logic

The nine destinations are the ruled product model's three sections
times three: Play (Home, Stories, Adventures), Create (Studio, Images,
Vault), Explore (Community, Creators, Lore). Current route mapping per
`docs/APP-FUNCTION-INVENTORY.md` destination-page pass C; Home and
Lore have no assigned route today (Home's candidate `/studio` and the
lore-archive routes are explicitly unassigned for ruling).

Sequencing rules used:

- Reuse leverage first: the page that forces the most kit pieces into
  existence goes first, so every later page consumes instead of
  builds. The library skeleton (page head, action row, banner, sticky
  filter bar, grid, endcap) is the ruled shared shape for the browse
  pages (Ruling 8), so a browse page leads.
- Merge risk second: a page whose surfaces carry open Nick-owned CRs
  that would collide with in-flight backend work waits. "Nick's merge
  lock" matched no text in any document read this session at the time
  this chapter was drafted; RULED 9 Aug 2026: a page is locked while
  any open Nick-owned CR touches its surfaces in a way that would make
  the restyle land twice (the reading already used in 3.1), not a
  literal announced code freeze (none is recorded anywhere in the
  repo) and not narrowed to only the two rename CRs (CR-026
  explicitly schedules Nick's own pass over quick-create before build,
  which is lock-shaped for the Studio page and would be missed by the
  narrower reading).
- Strangler rules: the phrase "strangler rules from the product model"
  matched no text in `docs/CRESTFALL-PRODUCT-MODEL.md` at the time
  this chapter was drafted, but Brian's reissued
  `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` (registered in CLAUDE.md 9 Aug
  2026, now the current product model for page architecture) names the
  strangler pattern explicitly in its section 6, "Migration strategy:
  build new, then retire old": each new page builds as a fresh route
  under the updated system, reads the same live data through the same
  API surface as the old page, old pages stay routable but leave the
  sidebar once the new page carries their function, and a page retires
  only after a parity check confirms every old function exists on the
  new page, rendered at 390 and 1440, retirement per page never a
  single cutover. RULED 9 Aug 2026: this chapter follows that section 6
  discipline, which also matches and confirms the repo-law-derived
  discipline drafted here: kit pieces land as shared LOOM packages
  first; each page then converts as one unit behind its Views; the
  legacy page keeps rendering until the converted page passes both the
  QA gate at 390 and 1440 and the UXUI section 6 parity check;
  presentation changes only, contracts and ViewModels untouched,
  anything needing a contract change stops and escalates (contract
  law); preview routes before product pages (new module protocol).

Kit-before-pages: chapter 2's packages 2.5 (modal frame, already ruled
first work by T9), 2.7 (chips), 2.10 (badge), 2.4 (load-more), 2.8
(form-field) have no page dependency and land before page one.

## 3.1 The order

| # | Page | Consumes | Introduces | Waits for Nick? |
|---|---|---|---|---|
| 1 | Community (`/studio/community`, `/studio/creations/[id]`) | modal-frame, filter-chip, badge, load-more | studio-filter-bar, creation-card grid, promo-banner, global-search slot | No lock. CR-023 (feed/link data model) is open but copy-level split is ruled; build presentation, log links that depend on the answer. CR-011 ("Rooms" label appears in the community hub) is copy, logged not fixed |
| 2 | Creators (`/studio/profile`, `/studio/profile/[username]`, connections) | skeleton from page 1: filter bar, cards, chips, badges, load-more | creator-card species (with the ruled 4 Aug changes: actions below the image strip, one-line header) and the Follow / View profile de-pill fix (shape law) | No lock. CR-011 label note applies (profile hero). Phone-width name truncation is already flagged to Brian in ROADMAP; its ruling rides this page |
| 3 | Vault (`/studio/my-creations`, preview) | full skeleton, creation-card list AND grid, picker-modal (featured image picker), alert-strip | list-card species, bulk/manage affordances styling | Partial hold, Brian not Nick: the standalone edit tree (`my-creations/[id]/edit`) stays out of scope until CR-007/CR-008 (one edit surface or two) is ruled; the Vault hub itself converts freely |
| 4 | Stories (`/studio/story-rooms` hub only) | full skeleton, cards, chips, load-more, banner card treatment (b) | continue-card usage of promo-banner treatment (b) | Naming lock, partial: display already reads "Story" via the terminology module; CR-024 (backend rename) is ruled non-blocking. CR-018 (Sessions vs Stories copy) and CR-011 (dock label) are Nick's; hub converts, copy that depends on them is logged. The chat room `[id]` surface is excluded (dedicated sitting, sweep-scope ruling) |
| 5 | Images (`/studio/image-studio`, `[id]/image-library`) | modal-frame, form-field, load-more, filter-chip, alert-strip | media-lightbox restyle (share/download/details per inventory), composer field anatomy, the missing page head (REDESIGN-ORDER: image-studio ships a bare eyebrow, no display title) | No lock. All lightbox wiring exists and stays; the `window.confirm` delete gap converts to the modal-frame confirm step, presentation of an existing operation |
| 6 | Studio (`/studio/create` and the 26 builders' shared chrome) | form-field, picker-modal, modal-frame, alert-strip, cards | create-hub ladder layout per the proof (levels, doors, tool cards, story bridge strip), quick-create surfaces | YES. CR-026 is exactly Nick's pass over the quick-create allocation before build, and CR-009 (one wizard/picker system) governs the Player Character creator. The hub's own restyle can start; quick-create composition waits for CR-026. T12 items (centered vs docked creator) stay queued |
| 7 | Adventures (`/studio/storylines`) | full skeleton, cards, chips | nothing new (smallest surface, 6 CSV rows) | YES. CR-025: the display layer still reads "Storyline" and the product model rules the copy retirement lands the moment the rename lands in code, so copy and backend rename are meant to land together. Restyling before that means touching the page twice; it waits |
| 8 | Home (Play > Home) | everything: skeleton, cards, banners, search | the dynamic feed composition per the UXUI doc section 4.1 (continue-playing cards, new releases, community highlights, creator activity, fresh lore, an editorial signed-out version) | RULED 9 Aug 2026: `/studio` becomes Play > Home and adopts this feed composition, since the route already plays the guidepost role for signed-in users and a new dedicated route would leave two home-shaped pages, violating one-canonical-home. Also CR-003 (character into story) shapes Home's continue rail |
| 9 | Lore (Explore > Lore) | skeleton, cards, badges, alert-strip | the public Lorebook reading and submission surface; today only the builder (`/studio/create/lore`) and unassigned archive routes (`/characters`, `/studio/official-characters`) exist | YES plus Brian. CR-015 (pipeline confirmation, and whether the new lore-validation route answers it) is Nick's. RULED 9 Aug 2026: the public archive routes (`/characters`, the lore-site pages) plus `/studio/official-characters` fold into the Lore destination when it is built, retiring duplicates, since the inventory flags exactly these as unassignable between Community and Lore and a single ruling places them all rather than leaving them homeless or folding them into Community, which the product model describes as the makers' wall, not the home of backstory reading. Most net-new contract surface of the nine, so last |

One-line reasons, in order: Community builds the whole browse kit
once; Creators reuses it wholesale and lands two ruled fixes; Vault
reuses it while its only blocker is a scoped-out edit tree; Stories
reuses it with names already display-correct; Images is self-contained
kit consumption with no external locks; Studio waits for Nick's
quick-create pass by that pass's own definition (CR-026); Adventures
waits for the rename that its copy is ruled to land with (CR-025);
Home has no ruled composition to build yet; Lore barely exists as a
destination and needs contracts before pixels.

## 3.2 Standing constraints on every page in the order

- One package, one commit; pilot the first units and stop for a
  rendered check before the remainder (parallelism law).
- Verification per FRONTEND-SOP section 8: rendered at 390 then 1440,
  every fixture state, production build exit 0, function-map row
  updated in the same commit, report echoes the manifest part by part.
- No page converts against an unsigned contract change; a redesign
  that appears to need one stops and escalates (sections 13 and 14).
- Chat surfaces stay out of every mechanical pass (dedicated sitting).
- The blocked token buckets (T2/T5/T8 opacity and hex fleets, T10 type
  floor) stay blocked; pages convert what is ruled and log the rest.

## 3.3 Route law, RULED 9 Aug 2026

The concrete addressing and cutover mechanics for the strangler
migration ratified in 3.0 (which itself follows
`docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 6). Four rules:

(a) **Build address.** All nine new pages build under
`/studio/v2/<page>` (for example `/studio/v2/community`,
`/studio/v2/home`). This is the one staging address for every page in
the build order (3.1); no page skips it.

(b) **Sidebar gate.** A `/studio/v2/<page>` route stays out of the
sidebar until it passes parity. Parity is the UXUI doc section 6 check:
every function the old page served exists on the new page, verified on
a rendered page at 390 and 1440. A page failing parity is a page still
under construction, reachable only by direct URL, never linked from
navigation.

(c) **Cutover.** Cutover happens per page, never a single cutover
across all nine (UXUI doc section 6, item 5). Cutover is exactly three
actions, together, one commit: the page moves from
`/studio/v2/<page>` to its final address (the route named in this
chapter's 3.1 table); the sidebar gains a one-line swap pointing at the
new final address in place of the old page's entry; the old address
issues a redirect to the new one, so no existing link, bookmark, or
saved URL 404s.

(d) **Deletion.** An old page's code is deleted only after the
full-inventory sweep at the deletion milestone, a single dedicated pass
across every retired old page once all nine new pages have cut over,
never as a per-page cleanup step riding a single page's cutover commit.
Until that milestone, a cut-over old page exists only as a redirect;
its component code stays in the repository, unreachable but not yet
removed, so a cutover can be reverted by removing the redirect without
reconstructing anything.

## 3.4 Parity echo law, RULED 9 Aug 2026

Every page build brief, for every one of the nine pages, ends with a
parity echo: every `docs/APP-FUNCTION-MAP.csv` row assigned to that
page's destination (per the destination-page mapping in
`docs/APP-FUNCTION-INVENTORY.md` pass C) is accounted for, marked one
of exactly three ways:

- **Present**: the row's function exists on the new page, with the
  file and line where it is implemented.
- **Deliberately excluded**: the row's function is intentionally not
  carried to the new page, with the ruling that authorizes dropping it
  cited by name (a CR, a ruling number, or a line in this document).
  Nothing is dropped silently; an exclusion with no ruling to cite is
  not deliberate, it is a flag.
- **Flagged for Brian**: the row's function has no ruling either way;
  work stops on it and it is reported, never guessed past (silence is
  never ratification, per CLAUDE.md).

A page with any open flag cannot enter the sidebar, regardless of
whether every other row on it passed parity. One unresolved flag holds
the whole page at the `/studio/v2/<page>` staging address until Brian
rules it.

---

# Rulings log, 9 Aug 2026

The twelve judgment calls this document could not settle from the
written rules were presented at a gate and ruled, all option A. Each
ruling is folded into its chapter above at the point it applies; this
log is the index, not a restatement.

1. Color ladder step naming: numbered 1 to 10, lightest to darkest.
   Folded into 1.3.
2. Elevation ladder vs the exactly-two-shadows ruling: adopt as
   structure, levels 1 to 4 filled from existing tokens, 5 and 6
   empty. Folded into 1.2 and 1.6.
3. Blur ladder vs the one-strength law: adopt documenting only the
   existing strengths (0, 2px, 4px, 12px), two levels empty. Folded
   into 1.2 and 1.6.
4. Type mobile pairs fill rule: one ladder step down for subhead and
   larger, smaller steps aliased unchanged. Folded into 1.5.
5. Pressed state of gold-filled controls: `--gold-deep` via
   `--state-pressed-gold`. Folded into 1.7, 2.3.
6. The strangler rules the brief cited: matched to
   `docs/CRESTFALL-PRODUCT-MODEL-UXUI.md` section 6, now registered as
   the current product model; this chapter's discipline follows it.
   Folded into 3.0.
7. What "Nick's merge lock" means: any open Nick-owned CR touching a
   page's surfaces in a way that would make the restyle land twice.
   Folded into 3.0.
8. Where Play > Home lives: `/studio` becomes Home and adopts the
   UXUI doc's dynamic feed composition. Folded into 3.1, row 8.
9. Which routes fold into Explore > Lore: the public archive routes
   plus `/studio/official-characters`. Folded into 3.1, row 9.
10. What "zoom" means in card anatomy: the existing Expand action
    opening the lightbox, nothing new. Folded into 2.6.
11. The neutral alert tone's bed: `--fill-whisper` with `--line`
    border, matching the proof's sanctioned info strip. Folded into
    2.11.
12. Which spacing steps are added: all four proposed
    (`--space-7/9/14/24`). Folded into 1.4.

