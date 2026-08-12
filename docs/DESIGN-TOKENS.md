# Design tokens: values, roles, and legal usage

Written 7 Aug 2026 by the Sprint 3 planning run. This file is the single
reference for what every token MEANS and where it is LEGAL. It is
answerable, not chronological: one question, one answer, no dated blocks
to reconcile.

## Authority

- `app/theme.css` in THIS repo (Crestfall-fe) is the law for token
  VALUES, ruled LOCKED by Brian 7 Aug 2026 (Ruling 1, closing queue
  item T1). It is the only file that declares a token. Its lineage: the
  design-system origin file (frozen 27 Jul 2026) evolved in the legacy
  Crestfall repo's `app/theme.css` through 2 Aug, was copied here in
  commit 3981a10 (3 Aug), and gained the status triad (3 Aug) and
  `--blur-panel` (4 Aug) here. Every later ruling landed here and
  nowhere else. This file formally supersedes the 27 Jul "source of
  truth" declaration; the legacy UIUX theme file is dead history.
- THIS file is the law for ROLES and legal usage. If this file and
  `app/theme.css` ever disagree on a value, that is a bug: stop and
  escalate to Brian. An execution agent never resolves it silently.
- `docs/RESTYLE-RULES.md` is a historical changelog. An execution agent
  never cites it as law; its settled content is folded in here.
- `docs/CLOSING-INVENTORY.md` is a work list. Its LINE-LEVEL findings
  are usable; its labels are not, and are never used for grouping or
  counting.
- `docs/_legacy-reference/` is evidence of original intent, gitignored,
  deleted at end of sprint. Never cited as law.
- `app/token-bridge.css` is temporary compatibility scaffolding, not a
  token file. Nothing new may reference the names it aliases.
- `app/design-system.css` is the selector-level companion (cf- classes).
  It consumes tokens; it declares none.

## Status vocabulary

- **locked**: an execution run may write this token into product code.
- **provisional**: value or role awaits Brian's eye on a render. May be
  read, never newly written by an execution run.
- **proposed**: named here so it is not lost; does not exist in
  `app/theme.css`. Never written into product code.

Only locked tokens may be written by an execution run.

## Surfaces

| Token | Dark | Light | Role | Legal on | Never on | Status |
|---|---|---|---|---|---|---|
| `--canvas` | `#090805` | `#ebe3d0` | Page background, behind all art | The page body, full-bleed backdrops | Panels, cards, controls | locked |
| `--surface-1` | `#16130f` | `#f0e9d8` | Quiet sections, inset wells, inputs | Wells, input beds, quiet chips | Floating panels | locked |
| `--surface-2` | `#1d1a15` | `#f4eee0` | Cards, list rows, icon-button fills | In-flow cards and rows, circular chrome controls | Modals | locked |
| `--surface-3` | `#24211a` | `#f8f3e7` | Topbar, sidebar, sticky chrome | Persistent chrome | Content panels | locked |
| `--surface-4` | `#2c271e` | `#fcf8ee` | Modals, menus, popovers | Every floating surface (see `.cf-modal-frame`, `.cf-dropdown` in `app/design-system.css`) | In-flow content | locked |
| `--surface-footer` | `#1a120b` | same | Marketing footer only, deliberate ramp exception | The site footer | Anything else | locked |

Surfaces are opaque and flip with the theme. Panels are never built from
translucent black fills: `bg-black/NN` panel chrome cannot flip themes
and is out of contract (see Debt map and queue items T2 and T5). Black
translucency is legal only in the wash family below, over artwork.

## Ink

| Token | Dark | Light | Role | Legal on | Never on | Status |
|---|---|---|---|---|---|---|
| `--ink` | `#ece7dc` | `#2a2418` | Primary text, and entered field VALUES | Body copy, headings, input values | Text over artwork (use `--art-ink`) | locked |
| `--ink-dim` | `#a9a294` | `#5a5243` | Secondary text, metadata | Ledes, helper copy, idle controls | Field placeholders | locked |
| `--ink-faint` | `#8d8674` | `#7c7259` | Tertiary, disabled, timestamps, counters | Counters, timestamps, disabled labels, placeholders | Primary copy | locked |

Placeholder vs value, RULED 7 Aug 2026 (Ruling 3, closes queue item
T6): placeholder text is `--ink-faint`, an entered value is `--ink`,
matching the proof (`picker.css:34`,
`.pksearch::placeholder{color:var(--ink-faint)}`) and four live
witnesses. `--ink-dim` at roughly 134 sites is the WRONG value being
converted away from (the defect where an empty field's placeholder
reads as a filled value). This is the fix for the Lilith defect.

## Gold

| Token | Dark | Light | Role | Legal on | Never on | Status |
|---|---|---|---|---|---|---|
| `--gold-action` | `#e0ab5e` | `#7a5717` | Interactive gold: buttons, links, active and selected states, focus borders | Primary button fills, selected-state borders and rings, interactive text | Decorative rules, eyebrows | locked |
| `--gold-ornament` | `#C9A86A` | `#8a6524` | Ornament gold: eyebrows, rules, decorative marks, quiet gold labels | Eyebrows, rule marks, decorative borders, non-interactive gold text | Text over artwork (use `--art-gold`) | locked |
| `--gold-bright` | `#f2d194` | `#6b4d15` | Highest-contrast gold text; the line/fill base at low alpha | Selected-state text, tag text on canvas, hover lift | Fills at full strength, ever | locked |
| `--gold-deep` | `#9a7434` | `#4a3812` | Pressed states; borders on light theme | Pressed, done-connector lines | Body text | locked |
| `--tag-fill-ink` | `#1c1408` | `#f7f2e4` | Text sitting on a gold fill | Gold-filled buttons and avatars only | As a surface; canon tags (R11) | locked |

The split is by JOB, not by hue preference: ornament is decoration,
action is interaction. The bridge maps the legacy `--muted-gold` onto
`--gold-ornament` (`app/token-bridge.css:19`), and interactive uses
graduate to `--gold-action` per package during conversion. The fleet
already reflects this (1,643 `--gold-ornament` vs 47 `--gold-action`
references under `components/`, counted 7 Aug). Whether any bulk
re-audit of ornament-vs-action assignment is wanted is queue item T3;
no mass gold swap is authorized.

## Status colors

| Token | Value (both themes) | Role | Status |
|---|---|---|---|
| `--status-success` | `#7D9B6A` | Success state text/icon | locked |
| `--status-warning` | `#C97B35` | Warning state text/icon, reserved, kept away from gold | locked |
| `--status-danger` | `#C2634D` | Danger state text/icon; the ONE red, including the danger button | locked |
| `--status-success-bed` / `-border` | `rgba(125,155,106,.14)` / `rgba(125,155,106,.40)` | Quiet chip bed / border | locked |
| `--status-warning-bed` / `-border` | `rgba(201,123,53,.14)` / `rgba(201,123,53,.40)` | Quiet chip bed / border | locked |
| `--status-danger-bed` / `-border` | `rgba(194,99,77,.14)` / `rgba(194,99,77,.40)` | Quiet chip bed / border | locked |

Usage law: state only, never decoration. Every use ships with a word
beside it. There is deliberately NO info color: informational copy uses
the ink family, and any sky-blue info state is removed, not converted.
Destructive controls: the in-page trigger is a quiet ghost with
`--status-danger` TEXT; the filled `--status-danger` button appears in
exactly one place, the confirming button inside a confirm step
(`cf-btn--danger` / `cf-btn--danger-filled` in `app/design-system.css`).

## Lines, fills, scrims

| Token | Dark | Light | Role | Legal on | Never on | Status |
|---|---|---|---|---|---|---|
| `--line-whisper` | `rgba(242,209,148,.03)` | `rgba(96,74,34,.07)` | Card edges, input borders, inset hairline dividers | Quiet borders | n/a | locked |
| `--line` | `rgba(242,209,148,.10)` | `rgba(96,74,34,.17)` | Art frames, panel borders, hover borders | Modal frames, art frames | n/a | locked |
| `--line-strong` | `rgba(242,209,148,.20)` | `rgba(96,74,34,.36)` | Dividers, active borders, scrollbar thumbs | Ghost-button borders, dividers | n/a | locked |
| `--fill-whisper` | `rgba(242,209,148,.06)` | `rgba(96,74,34,.05)` | Quietest gold wash | Nav hover, panel gradients | Whole large surfaces | locked |
| `--fill` | `rgba(242,209,148,.12)` | `rgba(96,74,34,.10)` | Standard gold wash; the canvas tag bed | Nav active, tag beds on canvas | Paired with a line-family border (they collide) | locked |
| `--fill-strong` | `rgba(242,209,148,.20)` | `rgba(96,74,34,.16)` | Strongest gold wash | Small accents | Large surfaces | locked |
| `--scrim` | `rgba(0,0,0,.40)` | same | The lighter wash over artwork UNDER a tag that carries its own bed | Artwork under tag beds | Panel chrome | locked (Ruling 7, 7 Aug 2026, closes queue item T7: .40 is settled, not provisional. Brian may adjust the value after viewing it live; that option survives only if code references the token, never the literal) |
| `--scrim-strong` | `rgba(0,0,0,.70)` | same | The heavy screen: floating-panel scrims, full banner covers | Modal/picker/sheet veils, banner treatment (a) | Panel fills | locked |
| `--tag-bed-art` | `var(--scrim-strong)` | follows referent | Tag bed over artwork, with 1px `--line` border and `--ink` text | Tags over art | Tags on canvas | locked |
| `--tag-bed-canvas` | `var(--fill)` | follows referent | Tag bed on canvas, no border, `--gold-bright` text | Tags on surfaces | Tags over art | locked |
| `--blur-panel` | `2px` | same | Floating panels only, paired with `--scrim-strong` | Modal/sheet/picker veils | Tile art, banners, tag beds, persistent chrome | locked |
| `--blur-chrome` | `12px` | same | Persistent chrome frost, minted 8 Aug 2026 at the proof's create-hub `.topbar` value; the image viewer veil (R2, 10 Aug 2026, Brian's ruling; the one floating surface that carries chrome frost instead of the scrim-plus-`--blur-panel` pair) | Sticky top bars and other persistent (non-floating) chrome; the image viewer veil (`KitModalFrame` `variant="viewer"`) | Other floating panels (use `--blur-panel`), tile art, banners, tag beds | locked |

Scrims do not flip with the theme because the artwork under them does
not flip. `--blur-panel` and `--blur-chrome` are separate strengths by
role, not by preference: `--blur-panel` is always paired with
`--scrim-strong` on a floating veil; `--blur-chrome` never pairs with a
scrim and applies only to chrome that stays in the document flow, with
the one named exception of the image viewer veil (R2, 10 Aug 2026): a
floating surface ruled to carry the chrome-frost treatment
(`bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)]` plus
`backdrop-blur-[var(--blur-chrome)]`, the same recipe as
`StudioTopBar` and `KitStudioFilterBar`) instead of `--scrim-strong`
plus `--blur-panel`. No token value changes; no new token is minted.
A meta tag's `blur(4px)` is a third, unrelated mechanism and is not
governed by either token.

## Over-art ink

| Token | Value (both themes) | Role | Status |
|---|---|---|---|
| `--art-ink` | `#ece7dc` | Titles on artwork | locked |
| `--art-ink-dim` | `#b3aa99` | Metadata on artwork | locked |
| `--art-gold` | `#C9A86A` | Eyebrows and kickers on artwork | locked |

These three are constants and are the only colors allowed for text over
artwork. The flipping ink family is illegal there.

## Elevation

| Token | Dark | Light | Role | Status |
|---|---|---|---|---|
| `--shadow-modal` | `0 10px 28px rgba(0,0,0,.62), 0 2px 6px rgba(0,0,0,.44)` | warm brown variant | Modals, sheets, pickers, drawers | locked |
| `--shadow-popover` | `0 4px 12px rgba(0,0,0,.52), 0 1px 3px rgba(0,0,0,.38)` | warm brown variant | Menus, dropdowns, small floats | locked |
| `--edge-top` | `inset 0 1px 0 rgba(255,240,210,.02)` | `inset 0 1px 0 rgba(255,255,255,.60)` | Inset top-edge highlight on elevated surfaces | locked |

In-flow surfaces separate by border, never by shadow. Floating surfaces
separate by scrim plus shadow. Exactly two floating shadow tokens exist;
Tailwind default shadows are out of contract (see below).

## Type

Families: `--font-logo` (Cinzel, logo only), `--font-display`
(Cormorant Garamond), `--font-sans` (Inter), `--font-mono`. All locked.
`app/theme.css` is the only declaring authority; `layout.js` loads faces
under loader-private names only.

Scale (all locked; ratio 1.2 from 16px, leadings on the 4px grid):

| Token | px / leading | Use |
|---|---|---|
| `--text-label` / `--lh-label` | 11 / 16 | Tags, meta, counters. THE FLOOR: no product type below 11px |
| `--text-ui` / `--lh-ui` | 13 / 20 | Buttons, labels, chips, ledes |
| `--text-body` / `--lh-body` | 16 / 24 | Paragraphs, input values |
| `--text-lead` / `--lh-lead` | 19 / 28 | Intros, card titles |
| `--text-subhead` / `--lh-subhead` | 23 / 32 | Section subheads, sheet titles |
| `--text-heading` / `--lh-heading` | 28 / 36 | Section headings, the modal grand field |
| `--text-title` / `--lh-title` | 33 / 40 | Page titles, modal headlines |
| `--text-display` / `--lh-display` | 40 / 48 | Hero |
| `--text-eyebrow` / `--lh-eyebrow` / `--track-eyebrow` | 13 / 20 / .16em | Eyebrows (aliases of the ui step) |
| `--text-cta` / `--lh-cta` | 16 / 24 | Button text (aliases of the body step) |
| `--text-hero` / `--lh-hero` | fluid | Hero only, never product UI |

Weights `--weight-regular/medium/bold` (400/500/700; 800 and 900 are
banned). Tracking `--track-label` (.18em, uppercase labels),
`--track-tight` (-.01em, 28px and up), `--track-normal`. All locked.

Tailwind default text sizes (`text-xs` 12, `text-sm` 14, `text-lg` 18,
`text-3xl` 30, and the rest) are NOT on this scale. They are widespread
in live code, including the creator modal. Whether they convert
wholesale to scale steps is queue item T12: log occurrences, do not
convert without that ruling. New code uses scale tokens only.

## Spacing, radius, sizing

`--space-1..20` (strict multiples of 4, from 4px to 80px), locked.

| Token | Value | Tier (corners final ruling) | Status |
|---|---|---|---|
| `--radius-xs` | 4px | Tags, inline pills, focus-ring corner | locked |
| `--radius-sm` | 8px | Small nested art thumbnails ONLY (the one exception) | locked |
| `--radius-md` | 12px | STANDARD: every control, every grid-sibling card, everything nested inside a large panel | locked |
| `--radius-lg` | 20px | LARGE: every full-content-width surface and every floating surface | locked |
| `--radius-full` | 999px | PILL: tags and icon buttons ONLY, never a button | locked |

Tier is decided by where a surface sits, not how big it is. `rounded-xl`
(16px) and `rounded-2xl` (16px+) are off scale and resolve DOWN to
`--radius-md` unless the surface floats or spans full width.

Sizing: `--control-sm` 32 (desktop-dense only), `--control-filter` 38
(RULED 9 Aug 2026, kit polish 2 pass: the unified filter-line control
height, splitting the difference between `--control-sm` and
`--control-md`; legal on search, dropdown, sort, and view-toggle
controls on the sticky filter line, desktop widths only, always
paired with a `[@media(pointer:coarse)]:min-h-[var(--control-md)]`
override so touch keeps the 44px floor; never on any other control),
`--control-md` 44 (the default and the touch floor), `--control-lg`
48, `--icon-sm/md/lg` 16/20/24, `--container` 1200, `--measure` 68ch.
All locked.

`--topbar-h`, minted 10 Aug 2026 (kit polish 3 pass): the sticky
`StudioTopBar` header's own rendered height, `calc(var(--control-md)
+ var(--space-3) * 2 + 1px)` (control height, its top and bottom
padding, its 1px bottom border), a derived layout constant rather
than a new primitive value. Legal use: the `top` offset of any sticky
surface that must dock directly beneath the top bar with no gap and
no overlap (the studio filter bar is the first consumer). Never used
to set an element's own height; it exists only so a second sticky
layer can measure the first. Locked.

## Motion and focus

`--ease`, `--ease-hover`, `--dur-fast/base/slow/hover/ambient`,
`--anim-galaxy`, `--anim-twinkle`: locked.
`--focus-ring` (`0 0 0 2px var(--canvas), 0 0 0 4px var(--gold-ornament)`):
locked, the ONLY focus token, wired globally in
`app/design-system.css:165-168`; `cf-field` carries the sanctioned
quieter 1px variant for dense modal field grids.

Known gap: the global `prefers-reduced-motion` kill-switch that existed
in both ancestor theme files is absent from this repo; only three
per-feature rules exist in `app/design-system.css`. Restoring it is a
Sprint 3 Phase 1 task.

## Gradients, glows, atmosphere

Sanctioned gradients, all locked, nothing outside this list is legal:
`--grad-gold`, `--grad-gold-deep`, `--grad-track`, `--grad-sheen`,
`--grad-panel`, `--grad-nav-active`, `--grad-rule`, `--grad-rule-soft`,
`--cat-canon`, `--cat-compatible`, `--cat-sandbox`.
Glows: `--glow-ambient`, `--glow-hover`, locked.
Atmosphere: `--atm-hearth`, `--atm-vault`, `--atm-veil`,
`--atm-constellation`, locked, applied as positioned layers, never baked
into a surface color.

## Ladder and state primitives, RULED 9 Aug 2026

`docs/BUILD-BLUEPRINT.md` chapter 1, sections 1.3 through 1.8, ruled
and written into `app/theme.css` in the same commit as this entry.
These 88 names are a PRIMITIVE layer under the role tokens above, not
a replacement: every existing role token above keeps its own name and
literal value, unchanged. A filled step below is declared in
`app/theme.css` as `var()` onto an already-locked role token, so its
status here is **locked**: it introduces no new value and an
execution run may consume it directly. An unset step is a commented
placeholder in `app/theme.css`, never a literal, and its status here
is **proposed**: named so it is not lost, no value invented, never
written as a literal until a render sitting rules one.

No existing role token's own declaration has been rewritten onto a
ladder step in this pass (that migration is separate execution work
the ladders make possible, not part of this ruling), and no component
has been migrated to consume a ladder or state token yet; that is
chapter 2 and chapter 3 work, package by package, under the normal
render gate.

### Gold ladder (`--gold-1` to `--gold-10`)

| Step | Value | Status |
|---|---|---|
| `--gold-1` | unset | proposed |
| `--gold-2` | `var(--gold-bright)` | locked |
| `--gold-3` | unset | proposed |
| `--gold-4` | `var(--gold-action)` | locked |
| `--gold-5` | `var(--gold-ornament)` | locked |
| `--gold-6` | unset | proposed |
| `--gold-7` | `var(--gold-deep)` | locked |
| `--gold-8` | unset | proposed |
| `--gold-9` | unset | proposed |
| `--gold-10` | `var(--tag-fill-ink)` | locked |

### Warm neutral ladder (`--neutral-1` to `--neutral-10`)

| Step | Value | Status |
|---|---|---|
| `--neutral-1` | `var(--ink)` | locked |
| `--neutral-2` | unset | proposed |
| `--neutral-3` | `var(--ink-dim)` | locked |
| `--neutral-4` | `var(--ink-faint)` | locked |
| `--neutral-5` | unset | proposed |
| `--neutral-6` | `var(--surface-4)` | locked |
| `--neutral-7` | `var(--surface-3)` | locked |
| `--neutral-8` | `var(--surface-2)` | locked |
| `--neutral-9` | `var(--surface-1)` | locked |
| `--neutral-10` | `var(--canvas)` | locked |

### Status ladders (`--success-1..10`, `--warning-1..10`, `--danger-1..10`)

Every family fills only step 5, its existing base value; steps 1 to 4
and 6 to 10 are unset in all three families, proposed.

| Family | Step 5 | Steps 1-4, 6-10 |
|---|---|---|
| `--success-5` | `var(--status-success)`, locked | unset, proposed |
| `--warning-5` | `var(--status-warning)`, locked | unset, proposed |
| `--danger-5` | `var(--status-danger)`, locked | unset, proposed |

### Spacing, 4 added steps (`--space-7`, `--space-9`, `--space-14`, `--space-24`)

| Token | Value | Status |
|---|---|---|
| `--space-7` | 28px | locked |
| `--space-9` | 36px | locked |
| `--space-14` | 56px | locked |
| `--space-24` | 96px | locked |

### Type mobile pairs, 8 steps x 2 (16 tokens)

`label`/`ui`/`body`/`lead` alias their own desktop step unchanged;
`subhead`/`heading`/`title`/`display` each alias one ladder step down.
All locked (each aliases an already-locked step).

| Mobile token | Value |
|---|---|
| `--text-label-m` / `--lh-label-m` | `var(--text-label)` / `var(--lh-label)` |
| `--text-ui-m` / `--lh-ui-m` | `var(--text-ui)` / `var(--lh-ui)` |
| `--text-body-m` / `--lh-body-m` | `var(--text-body)` / `var(--lh-body)` |
| `--text-lead-m` / `--lh-lead-m` | `var(--text-lead)` / `var(--lh-lead)` |
| `--text-subhead-m` / `--lh-subhead-m` | `var(--text-lead)` / `var(--lh-lead)` |
| `--text-heading-m` / `--lh-heading-m` | `var(--text-subhead)` / `var(--lh-subhead)` |
| `--text-title-m` / `--lh-title-m` | `var(--text-heading)` / `var(--lh-heading)` |
| `--text-display-m` / `--lh-display-m` | `var(--text-title)` / `var(--lh-title)` |

### Elevation, 6 named levels (`--elev-1` to `--elev-6`)

Composed entirely from existing tokens; the standing "exactly two
floating shadow tokens" ruling is untouched, this only names the
composed recipe per level.

| Level | Value | Status |
|---|---|---|
| `--elev-1` | `none` | locked |
| `--elev-2` | `var(--edge-top)` | locked |
| `--elev-3` | `var(--shadow-popover), var(--edge-top)` | locked |
| `--elev-4` | `var(--shadow-modal), var(--edge-top)` | locked |
| `--elev-5` | unset | proposed |
| `--elev-6` | unset | proposed |

### Blur, 6 named levels (`--blur-1` to `--blur-6`)

Documents the strengths that already exist in law (`--blur-panel`,
`--blur-chrome`) plus the `.tag--meta` 4px mechanism DESIGN-TOKENS
already names as a third, ungoverned strength. The standing
one-blur-strength-per-role law is untouched.

| Level | Value | Status |
|---|---|---|
| `--blur-1` | `0` | locked |
| `--blur-2` | `var(--blur-panel)` | locked |
| `--blur-3` | `4px` | locked |
| `--blur-4` | unset | proposed |
| `--blur-5` | `var(--blur-chrome)` | locked |
| `--blur-6` | unset | proposed |

### Five-state set

One state token family every kit control consumes going forward
(`docs/BUILD-BLUEPRINT.md` chapter 2). Rest is each component's own
idle recipe and needs no token. Pressed on gold-filled controls maps
to `--gold-deep`, whose ruled role is already "pressed states".

| Token | Value | Status |
|---|---|---|
| `--state-hover-fill` | `var(--fill-whisper)` | locked |
| `--state-hover-line` | `var(--line)` | locked |
| `--state-pressed-fill` | `var(--fill)` | locked |
| `--state-pressed-gold` | `var(--gold-deep)` | locked |
| `--state-disabled-opacity` | `0.5` | locked |
| `--state-focus-ring` | `var(--focus-ring)` | locked |

## Proposed (do not write into product code)

| Name | Would cover | Blocked on |
|---|---|---|
| Lore green pair (`#44604b`, `#36513e` in lore-document-renderer) | Lore category signal | Queue item T4 (hex promotion, bridge proposal Ruling B) |
| `--blood` `#4b1018`, `--deep-green` `#0f1d16` (today raw in `app/globals.css`) | Marketing body atmosphere | Queue item T4 |
| Art-tile scrim (the recurring raw `rgba(6,5,4,.82)` art-label fade in the proof files) | Tile label legibility fade | Log occurrences; needs a ruling before minting |
| `--veil-screen`, `--surface-modal` | Named in legacy N14; `--veil-screen` exists only in the proof (`proof.css:431`) as an alias of `--scrim-strong` | Superseded in practice by `--scrim-strong` and `--surface-4`; mint nothing without a ruling |
| Chat-scoped palette role family: `--chat-msg-dialogue`, `--chat-msg-narration`, `--chat-msg-emphasis`, `--chat-msg-strong`, `--chat-msg-whisper`, `--chat-msg-speaker`, `--chat-msg-border` (per message, scoped CSS-variable overrides carrying a character's seasonal palette into the chat body, closing CR-016's display side) | O7 option A (`docs/plans/FABLE-GATE-PLAN.md`), wave C1's `components/studio/chat/chat-message` package. Neutral tokens (`--ink`, `--gold-ornament`, etc.) render the shipped body today; this family is the proposed override layer, wired only behind a fixture-only demo flag (never true in product code) until ratified | Brian's ruling on this family's names and values; the story-room-message golds in the Debt map above are the closest existing evidence, log only, no value invented |

## Debt map: raw value to token

"Exact" needs no render check. "Approximate" changes rendering and needs
its package verified at 390 and 1440.

| Raw value found in code | Converts to | Match | Authority |
|---|---|---|---|
| `rounded-xl` on in-flow panels/controls | `rounded-[var(--radius-md)]` | approximate (16 to 12) | Corners final ruling; pattern commits 0bcedce, 327300d |
| `rounded-2xl` | `--radius-md`, or `--radius-lg` only if the surface floats or spans full width | approximate | Corners final ruling |
| Floating dialog at `--radius-md` | `--radius-lg` | approximate | Corners final ruling; commits 0bcedce, 327300d |
| `bg-black/70` as a modal scrim | `bg-[var(--scrim-strong)]` | exact | Commit 0bcedce |
| `bg-black/80` as a modal scrim (`ModalShell.jsx:51`) | `bg-[var(--scrim-strong)]` | approximate (.80 to .70) | Blur/scrim ruling |
| `backdrop-blur-[2px]` on a floating veil | `backdrop-blur-[var(--blur-panel)]` | exact | Blur ruling |
| `text-red-200`, `border-red-500/30 bg-red-500/10` | `--status-danger` / `-border` / `-bed` triad | approximate | Status ruling; commits 0bcedce, 327300d |
| `emerald-*` success triads | `--status-success` triad | approximate | Status ruling; commit 327300d |
| `amber-*` warning states | `--status-warning` triad | approximate | Status ruling |
| `sky-*` info states | REMOVED, not converted | n/a | Status ruling (no info color) |
| `shadow-2xl` on floating surfaces | `shadow-[var(--shadow-modal)]` | approximate | Elevation item 1.9; `app/design-system.css:135` |
| `shadow-lg`, `shadow-xl` on small floats | `shadow-[var(--shadow-popover)]` | approximate | Elevation item 1.9; `app/design-system.css:364` |
| `text-[11px]` | `--text-label` / `--lh-label` | exact | Type scale |
| `text-[10px]` | `--text-label` | approximate (grows 1px) | Type floor; queue item T10 governs batching |
| `text-[9px]`, `text-[8px]` | `--text-label` | approximate, per-use render check | Queue item T10 |
| `--muted-gold` | `--gold-ornament` (interactive uses graduate to `--gold-action`) | approximate | Bridge, `app/token-bridge.css:19`; queue item T3 confirms |
| `--muted` | `--ink-dim` | approximate (very close) | Bridge |
| `--foreground` | `--ink` | approximate (very close) | Bridge |
| `--border` | `--line-strong` | approximate | Bridge |
| `#080706` panel fills | `--surface-1` | approximate, THE BIGGEST VISUAL CHANGE of the bridge: panels flip from darker-than-page to lighter-than-page. RULED 7 Aug 2026 (Ruling 4, closes queue item T5): the mapping is locked. Scope is gated: convert only the packages named in the Sprint 3 Phase 1 manifest, verify in LOOM preview routes, then STOP for Brian's render review before any wider batch | Ruling 4; `docs/SPRINT-3-PLAN.md` Phase 1 manifest |
| `#0b0907`, `#0b0a09`, `#0b0908`, `#100d09` | `--surface-1` | approximate, gated with T5 | Bridge proposal |
| `#090807`, `#090806` | `--canvas` | approximate (near exact) | Bridge proposal |
| `#7b5525`, `#6a481f` | `--gold-deep` | approximate | Bridge proposal |
| `#5a4732` | `--line-strong` | approximate | Bridge proposal |
| `#3b3024` | `--line` | approximate | Bridge proposal |
| story-room-message golds (`#ffd99a` `#f5e7c7` `#e2b96f` `#d6b36a` `#c89b5a` `#afa08a` `#8a6a3c`) | `--gold-bright` / `--ink` / `--gold-action` / `--gold-ornament` / `--gold-ornament` / `--ink-dim` / `--gold-deep` | approximate | Bridge proposal; chat surfaces have a dedicated sitting, log only |
| `#f2ead9` | `--ink` | approximate | Bridge proposal |
| `#44604b`, `#36513e` | log, do not guess | n/a | Queue item T4 |
| `border-white/10` and the white hairline family | `--line` / `--line-strong` per context | approximate | RULED 7 Aug 2026 (Ruling 5, closes queue item T8): warm gold shift approved, no neutral token minted. Scope gated: Sprint 3 Phase 1 manifest packages only, verified on LOOM preview routes, then STOP for the wider batch |
| `bg-black/20` through `bg-black/45` panel fills | log, do not guess | n/a | Queue items T2 and T5 (map onto the opaque surface ramp by elevation role; principle locked, per-step mapping still needs T5's render before the wider batch) |
| `white/[0.02]` to `white/[0.04]` raised washes | `--edge-top` / `--fill-whisper` per context | approximate | RULED 7 Aug 2026 (Ruling 5, closes queue item T8), same scope gate as the hairline family above |
| placeholder `--ink-dim` | `--ink-faint` | approximate | Queue item T6; convert only after the ruling |

## Retired names

Finding one of these in existing code means convert it; in new code it
means revert the change.

| Name | Retired by | Replacement |
|---|---|---|
| `--radius-pill`, `--radius-input` | item 1.3, 29 Jul | `--radius-full` (tags, icon buttons) or `--radius-md` (controls) |
| `--focus-width` | item 1.12, 31 Jul | none (component property) |
| `--glow-focus` | item 1.12, 31 Jul | `--focus-ring` |
| `--glow-panel` | item 1.9 | `--shadow-modal` |
| `--lift-inset`, `--lift-1`, `--lift-2`, `--lift-3` | item 1.9 | border (in-flow) or `--shadow-modal` / `--shadow-popover` (floating) |
| `--status-live`, `--status-live-line` | status mint, 3 Aug | status triad |
| `--tint-*` | 29 Jul | fill/line families |
| `--font-serif` as a semantic name | item 1.6 | `--font-display` (NOTE: the alias was dropped before its 32 consumer files migrated; restoring the alias then migrating is Sprint 3 Phase 1 work) |
| `--muted-gold`, `--muted`, `--foreground`, `--border` | bridge, temporary | delete each alias from `app/token-bridge.css` when its last consumer converts |
| `--background`, `--panel`, `--panel-strong`, `--bone-white` | pending T4/T2 | `--canvas`, surface ramp, `--ink` |
| `--veil-screen` | never promoted past the proof | `--scrim-strong` |

## Out of contract

Each entry: the violation, the ruled replacement or "log, do not guess",
and its detection command (run from the repo root; `app/dev/ui-preview`
and fixture files are harness, not product, and are excluded from
zero-tolerance counts).

1. Raw hex outside `app/theme.css` (and `app/globals.css` pending T4).
   Replacement: the Debt map above; unmapped hex is "log, do not guess".
   Detect: `grep -rn '#[0-9a-fA-F]\{6\}' components/ --include='*.view.jsx' --include='*.jsx' | grep -v fixtures`
2. Type below 11px. Replacement: `--text-label`; 9px and 8px need a
   per-use render check (T10).
   Detect: `grep -rnE 'text-\[(10|9|8)px\]' components/`
3. Raw opacity on panel chrome (`bg-black/NN` fills, `bg-white/NN`).
   Replacement: log, do not guess (T2, T5, T8).
   Detect: `grep -rnE 'bg-(black|white)/[0-9]+' components/ --include='*.view.jsx'`
4. Tailwind default shadows on floating surfaces. Replacement:
   `--shadow-modal` or `--shadow-popover`.
   Detect: `grep -rnE 'shadow-(2xl|xl|lg)([^-]|$)' components/`
5. `rounded-xl` / `rounded-2xl`. Replacement: `--radius-md` (or
   `--radius-lg` per the corners tier test).
   Detect: `grep -rnE 'rounded-(xl|2xl)([^-]|$)' components/`
6. Pill-shaped buttons (`rounded-full` on a button that is not an icon
   button). Replacement: `--radius-md`.
   Detect: `grep -rn 'rounded-full' components/ --include='*.view.jsx'` then rule each hit: tag or icon button is legal, text button is not.
7. Legacy bridge variables in anything NEW.
   Detect: `grep -rnE 'var\(--(muted|muted-gold|foreground|border|background|panel|panel-strong|bone-white)\)' components/ --include='*.view.jsx'`
8. White hairlines (`border-white/10` family). Replacement: `--line` /
   `--line-strong` per context (Ruling 5), scope-gated to the Sprint 3
   Phase 1 manifest until the wider batch is authorized.
   Detect: `grep -rnE 'border-white/[0-9]+' components/`
9. Wash/scrim/veil literals instead of the token (Ruling 7). Every
   wash, scrim, and veil writes `var(--scrim)` or `var(--scrim-strong)`.
   No file anywhere writes `rgba(0,0,0,.40)`, `bg-black/40`, or any
   other literal form of a wash value; a single-line change in
   `app/theme.css` must be able to move every wash in the app at once.
   Detect: `grep -rnE 'rgba\(0,\s*0,\s*0,\s*\.(4|7)0?\)|bg-black/(40|70)' components/ app/ --include='*.jsx' --include='*.js' --include='*.css' | grep -v theme.css`
10. Token-first directive (ruled 7 Aug 2026, Brian's architectural
    directive, `docs/FRONTEND-SOP.md` section 17). Every color and
    typography value pulls from a global token first; a local literal
    is legal only when Brian has explicitly requested that specific
    adjustment. No value with no matching token is invented; it is
    reported as a missing token and the work stops there.
    Detect: `grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\([0-9]' components/ app/ --include='*.jsx' --include='*.js' --include='*.css' | grep -vE 'app/theme\.css|app/globals\.css|fixtures'`
