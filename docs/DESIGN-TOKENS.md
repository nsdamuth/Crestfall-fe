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
| `--surface-4` | `#2c271e` | `#fcf8ee` | Superseded on floating chrome 22 Aug 2026: modal panels moved off this token to `--grad-panel-lift` (B3), menus and popovers moved off it to `--panel-glass` (NEW LAW B, F3 closed GO 2B, Final Ruling Render). No floating-surface consumer remains | Reserved, no current floating-surface legal-on | Menus, popovers, `.cf-dropdown`, modal panels | locked |
| `--surface-footer` | `#1a120b` | same | Marketing footer only, deliberate ramp exception | The site footer | Anything else | locked |

Surfaces are opaque and flip with the theme. Panels are never built from
translucent black fills: `bg-black/NN` panel chrome cannot flip themes
and is out of contract (see Debt map and queue items T2 and T5). Black
translucency is legal only in the wash family below, over artwork, and
in one scoped exception ratified 22 Aug 2026 (B4, Fable law review):
`--fill-option-rest` (`rgba(0,0,0,.22)`), legal on the rest state of an
option card only, never any other surface. The selected fill is an
exact match to the already-locked `--fill-whisper` and carries no new
token.

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
| `--status-success` | `oklch(.76 .08 135)` | Success state text/icon; revised 22 Aug 2026 (Gate 2 token law row 6, closes CR-051), prior value `#7D9B6A` struck for lineage | locked |
| `--status-warning` | `#C97B35` | Warning state text/icon, reserved, kept away from gold | locked |
| `--status-danger` | `#C2634D` | Danger state text/icon; the ONE red, including the danger button | locked |
| `--status-success-bed` / `-border` | `rgba(155,189,138,.14)` / `rgba(155,189,138,.40)` | Quiet chip bed / border; re-derived 22 Aug 2026 from the revised `--status-success` sage, prior derivative `rgba(125,155,106,*)` (from struck `#7D9B6A`) retired | locked |
| `--status-warning-bed` / `-border` | `rgba(201,123,53,.14)` / `rgba(201,123,53,.40)` | Quiet chip bed / border | locked |
| `--status-danger-bed` / `-border` | `rgba(194,99,77,.14)` / `rgba(194,99,77,.40)` | Quiet chip bed / border | locked |
| `--status-danger-fill` | `rgba(194,99,77,.06)` | Modal-confirm danger CTA fill (B5, 22 Aug 2026), distinct from the 14 percent `-bed` chip step | locked |
| `--status-success-text` | `oklch(.86 .09 135)` | Brian ruling 1, 22 Aug 2026 (ED1G burn-down, closes ED1E section 10 item 1): brighter text-tier variant for status-colored RUNNING TEXT on dark panels only | locked |
| `--status-warning-text` | `oklch(.80 .13 60)` | Same ruling, warning running text | locked |
| `--status-danger-text` | `oklch(.78 .12 32)` | Same ruling, danger running text; used by the at-limit field counter and editor save-error words | locked |

Ruling 1 usage law: the `-text` tier is for status-colored running text
at normal size on dark panels only (field counters, inline error and
warning lines). Chips and badges keep the base `--status-*` colors
above; never swap a chip or badge to a `-text` token.

Usage law: state only, never decoration. Every use ships with a word
beside it. There is deliberately NO info color: informational copy uses
the ink family, and any sky-blue info state is removed, not converted.
Destructive controls: the in-page trigger is a quiet ghost with
`--status-danger` TEXT (`cf-btn--danger` in `app/design-system.css`,
untouched by this pass); the confirming button inside a confirm step
(`cf-btn--danger-filled`) is now the B5 recipe, RULED 22 Aug 2026
(Fable law review): border AND ink AND fill, all `--status-danger`,
the fill at the new `--status-danger-fill` step (6 percent, distinct
from the 14 percent `--status-danger-bed` chip step). This supersedes
the prior solid-`--status-danger`-fill-with-`--ink`-text recipe.

## Contrast law

RULED 12 Aug 2026 (Ruling N6, `docs/plans/FABLE-GATE-2-STUDIO.md`,
ratified option A, wave X1). Checkable, dark-theme baseline (the
theme the matrix below is computed against); WCAG 2.2 numbers,
1.4.3 and 1.4.11.

- Normal-size meaningful text meets 4.5:1 against its surface; large
  text (>=24px, or >=18.66px bold) meets 3:1. Placeholder text is
  NOT exempt from this; disabled/inactive text is.
- `--ink-faint` is ILLEGAL for normal-size meaningful text on
  `--surface-3` (computed 4.43:1, FAILS 4.5) AND `--surface-4`
  (computed 4.09:1, FAILS 4.5). Extended 12 Aug 2026, same session as
  N6, closing the `--surface-3` gap the matrix surfaced and N6's text
  did not name. Counters, placeholders, and timestamps on either
  surface (topbar/sidebar/sticky chrome for `--surface-3`; modals,
  menus, and popovers for `--surface-4`) use `--ink-dim` instead
  (`--neutral-3`, already-locked ladder step: computed 6.33:1 on
  `--surface-3`, 5.85:1 on `--surface-4`, both PASS). `--ink-faint`
  remains legal on `--surface-1` (5.11:1) and `--surface-2` (4.79:1),
  and remains legal at any surface for large text (it clears 3:1
  everywhere). Zero token value changes; this is a pairing law only,
  nothing here mints or edits a token.
- `--gold-deep` is legal for ornament and large display text (>=24px
  / >=18.66px bold) on any surface; it is ILLEGAL for normal-size
  meaningful text on every surface but `--canvas` (the only surface
  where it clears 4.5:1: computed 4.69:1, PASS; `--surface-1` 4.34:1,
  `--surface-2` 4.06:1, `--surface-3` 3.76:1, `--surface-4` 3.48:1,
  all FAIL). Ruled 12 Aug 2026, same session as N6. `--gold-deep`'s
  own role ("pressed states; borders") already excludes ordinary body
  text; this closes the gap for the rare case of `--gold-deep`
  rendered AS text (e.g. a pressed-state label) at normal size off
  `--canvas`. Zero token value changes.
- Status colors (`--status-success`, `--status-warning`,
  `--status-danger`) used as normal-size text on `--surface-2`,
  `--surface-3`, or `--surface-4` are BLOCKED, not ruled, pending a
  named ladder step: Brian's 12 Aug ruling calls for "their brighter
  primitive ladder step," but the status ladders
  (`--success-1..10`, `--warning-1..10`, `--danger-1..10`) fill only
  step 5 (each family's existing base value); every other step in
  all three families is unset/proposed in `app/theme.css`, not a
  locked value an execution run may consume
  ("Ladder and state primitives" section below). No brighter step
  exists to name. STOP: this piece of the pairing law is NOT landed;
  status-color-as-normal-text on the three deeper surfaces stays
  exactly as documented in the matrix (`--status-warning` FAILS on
  `--surface-4` at 4.497:1 unrounded; `--status-danger` FAILS on
  `--surface-2`/`--surface-3`/`--surface-4`) until Brian names which
  step (or a new one) to fill at a render sitting. Status text
  continues to ship with its word beside it per standing law
  regardless.
- A UI-component boundary that is its SOLE identifier meets 3:1
  (1.4.11) and uses `--line-strong` or a redundant cue (fill delta
  plus label, icon, or state mark). `--line` and `--line-whisper` are
  legal only as decorative or redundant edges, including input beds,
  where label, placeholder, and focus ring jointly identify the
  field; a sweep never "fixes" an input bed's `--line-whisper` edge
  on boundary-contrast grounds.
- The focus indicator (`--focus-ring`, `--gold-ornament` border plus
  a `--gold-action`-rgb 10 percent glow, revised 22 Aug 2026, A3)
  passes 3:1 and is the one sanctioned focus mechanism, alongside its
  narrower gold-fill-scope sibling `--focus-ring-ongold` (B10); 1.4.11
  exempts disabled controls from all of the above. Propagation
  requirement carried by A3: the ring must be verified legible on
  every surface depth it can land on, not only field beds, buttons,
  chips, nav rows, and cards at their real rendered surfaces
  (`--surface-1` through `--surface-4`, plus the gradient card and
  rail surfaces), each needing a contrast check during propagation,
  not an assumption that the field-bed check covers every case.
- The full generated matrix, every locked ink/gold/status token over
  every locked surface with computed ratio and PASS/FAIL at 4.5 and
  at 3, lives at `docs/review-artifacts/contrast-matrix-x1.md`. It is
  a generated artifact, not hand-maintained; regenerate it if a
  locked surface, ink, gold, or status value ever changes, INCLUDING
  this pass's `--focus-ring` recipe revision and `--status-success`
  value revision, both regeneration triggers. The
  `--ink-faint` and `--gold-deep` FAILs the matrix surfaced are now
  resolved by the pairing rules above (zero token changes); the
  status-color FAILs on the deeper surfaces remain open, blocked on a
  ladder step that does not yet exist (see the status-color bullet
  above), not a license for a sweep to invent a mapping.
  Check: `grep -rn 'ink-faint' components/ --include='*.view.jsx'`
  hits reviewed for normal-size text rendered on a `--surface-3` or
  `--surface-4` consumer; any such hit is out of contract.
  `grep -rn 'gold-deep' components/ --include='*.view.jsx'` hits
  reviewed for normal-size text off `--canvas`; any such hit is out
  of contract.

## Lines, fills, scrims

| Token | Dark | Light | Role | Legal on | Never on | Status |
|---|---|---|---|---|---|---|
| `--line-whisper` | `rgba(242,209,148,.03)` | `rgba(96,74,34,.07)` | Card edges, input borders, inset hairline dividers | Quiet borders | n/a | locked |
| `--line` | `rgba(242,209,148,.10)` | `rgba(96,74,34,.17)` | Art frames, panel borders, hover borders | Modal frames, art frames | n/a | locked |
| `--line-strong` | `rgba(242,209,148,.20)` | `rgba(96,74,34,.36)` | Dividers, active borders, scrollbar thumbs | Ghost-button borders, dividers | n/a | locked |
| `--fill-whisper` | `rgba(242,209,148,.06)` | `rgba(96,74,34,.05)` | Quietest gold wash | Nav hover, panel gradients, option-card SELECTED fill (B4, 22 Aug 2026, exact match) | Whole large surfaces | locked |
| `--fill` | `rgba(242,209,148,.12)` | `rgba(96,74,34,.10)` | Standard gold wash; the canvas tag bed | Nav active, tag beds on canvas | Paired with a line-family border (they collide) | locked |
| `--fill-strong` | `rgba(242,209,148,.20)` | `rgba(96,74,34,.16)` | Strongest gold wash | Small accents | Large surfaces | locked |
| `--scrim` | `rgba(0,0,0,.40)` | same | The lighter wash over artwork UNDER a tag that carries its own bed | Artwork under tag beds | Panel chrome | locked (Ruling 7, 7 Aug 2026, closes queue item T7: .40 is settled, not provisional. Brian may adjust the value after viewing it live; that option survives only if code references the token, never the literal) |
| `--scrim-strong` | `rgba(0,0,0,.70)` | same | The heavy screen: floating-panel scrims, full banner covers | Modal/picker/sheet veils, banner treatment (a) | Panel fills | locked |
| `--tag-bed-art` | `var(--scrim-strong)` | follows referent | Tag bed over artwork, with 1px `--line` border and `--ink` text | Tags over art | Tags on canvas | locked |
| `--tag-bed-canvas` | `var(--fill)` | follows referent | Tag bed on canvas, no border, `--gold-bright` text | Tags on surfaces | Tags over art | locked |
| `--blur-panel` | `2px` | same | Floating panels only, paired with `--scrim-strong`; ALSO the image viewer veil, at the `--chrome-wash` color (B7, reverses R2 below) | Modal/sheet/picker veils, the image viewer veil | Tile art, banners, tag beds, persistent chrome | locked |
| `--blur-chrome` | `12px` | same | Persistent chrome frost, minted 8 Aug 2026 at the proof's create-hub `.topbar` value; scope extended 22 Aug 2026 (Gate 2 token law row 10) to the editor sticky nav and the mobile save row | Sticky top bars and other persistent (non-floating) chrome, the editor sticky nav, the mobile save row | Any floating panel (use `--blur-panel`), the image viewer veil, tile art, banners, tag beds | locked |
| `--blur-glass` | `12px` | same | Tooltip glass only. Third blur token, no cross-borrowing with the two above (A2, ratified narrow, 22 Aug 2026): every glass-chrome surface actually built (kebab menus, the viewer header, the viewer's 390 close control) resolves through `--panel-glass` at `--blur-panel` (2px), not this token | Tooltips (pending the CR-047 component) | Any other surface, including glass-chrome menus and headers | locked |
| `--chrome-wash` | `rgba(6,4,2,.62)` | same, interim (F1) | The near-black wash paired with `--blur-chrome`; ALSO the image viewer veil color, paired with `--blur-panel` per B7 | Sticky chrome, editor sticky nav, mobile save row, image viewer veil | Any surface not paired with `--blur-chrome` or the viewer's `--blur-panel` veil | locked |
| `--panel-glass` | `rgba(36,32,25,.85)` | same, interim (F1) | Glass-panel background, paired with `--blur-panel` (2px), never `--blur-glass`. Scope widened 22 Aug 2026 (NEW LAW B, F3 closed GO 2B, Final Ruling Render): every menu and popover app-wide, not only kebab menus | Kebab menus (B6), the `KitCreationCard` viewer-owned kebab menu (NEW LAW A), `KitDropdown` and every other menu/popover surface app-wide, the viewer's two-line header (B7); selection modals (picker, sort) keep their own panel-lift-gradient modal surface, unchanged by this widening | Tooltip surfaces (use `--blur-glass`) | locked |

Scrims do not flip with the theme because the artwork under them does
not flip. `--blur-panel`, `--blur-chrome`, and `--blur-glass` are
three separate strengths by role, none borrowing another's scope
(A2, ratified 22 Aug 2026, Fable law review, resolved narrow):
`--blur-panel` is always paired with `--scrim-strong` on a floating
veil, or with `--chrome-wash` on the image viewer veil specifically
(below); `--blur-chrome` never pairs with a scrim and applies only to
persistent, non-floating chrome (sticky top bars, the editor sticky
nav, the mobile save row); `--blur-glass` is tooltips only, never a
floating panel, menu, or header.

**R2 REVERSED, 22 Aug 2026 (B7, Fable law review):** the image viewer
veil no longer carries the chrome-frost treatment. It is now a
lawful 2px veil at the `--chrome-wash` color, paired with
`--blur-panel`, the same 2px strength every other floating veil
uses ("lawful 2px veil, no glass extension"). The prior R2 exception
recipe (`bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)]` plus
`backdrop-blur-[var(--blur-chrome)]`) is superseded; `KitModalFrame`
`variant="viewer"` no longer carries chrome frost. A meta tag's
`blur(4px)` is a fourth, unrelated mechanism and is not governed by
any of these tokens.

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
| `--shadow-popover` | `0 4px 12px rgba(0,0,0,.52), 0 1px 3px rgba(0,0,0,.38)` | warm brown variant | Small floats not on the glass recipe. Menus and dropdowns moved 22 Aug 2026 (NEW LAW B) to the borderless `--panel-glass` recipe (background plus `--blur-panel`, no box-shadow, matching the ratified exhibit), so this token is reserved rather than paired with them going forward | locked |
| `--edge-top` | `inset 0 1px 0 rgba(255,240,210,.02)` | `inset 0 1px 0 rgba(255,255,255,.60)` | Inset top-edge highlight on elevated surfaces | locked |

In-flow surfaces separate by border, never by shadow. Floating surfaces
separate by scrim plus shadow. Exactly two floating shadow tokens exist;
Tailwind default shadows are out of contract (see below). `--shadow-bed`
(new, 22 Aug 2026, Gate 2 token law row 8) is an INSET bed shadow, a
distinct third case from the two floating tokens: it separates a field
bed from the surface it sits in, never a floating panel from the page
behind it. The exactly-two-floating-shadows ruling is untouched.

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
banned), joined 22 Aug 2026 by `--weight-light` (300, A1, Fable law
review): ghost buttons (`.cf-btn--secondary` and any other
ghost-styled button or chip) render text at this weight, never 400 or
`--weight-regular`; also the weight of `--ink-typed` field values.
Tracking `--track-label` (.18em, uppercase labels),
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
`--focus-ring` (`0 0 0 1px var(--gold-ornament), 0 0 0 3px
rgba(224,171,94,.10)`, revised 22 Aug 2026, A3, Fable law review):
locked, wired globally in `app/design-system.css:167-170`. It admits
exactly one sibling, `--focus-ring-ongold` (`0 0 0 2px var(--canvas),
0 0 0 3px var(--gold-ornament), 0 0 0 6px rgba(224,171,94,.10)`),
locked, gold-fill scope only (B10): a narrower recipe layered on
gold-filled surfaces, not a replacement for the global ring and not
in conflict with it. The `cf-field` quieter 1px variant is RETIRED
by this same ruling: every focusable control app-wide, not only
field beds, now resolves through the one global ring.

Known gap: the global `prefers-reduced-motion` kill-switch that existed
in both ancestor theme files is absent from this repo; only three
per-feature rules exist in `app/design-system.css`. Restoring it is a
Sprint 3 Phase 1 task.

## Gradients, glows, atmosphere

Sanctioned gradients, all locked, nothing outside this list is legal:
`--grad-gold`, `--grad-gold-deep`, `--grad-track`, `--grad-sheen`,
`--grad-panel`, `--grad-nav-active`, `--grad-rule`, `--grad-rule-soft`,
`--cat-canon`, `--cat-compatible`, `--cat-sandbox`. Joined 22 Aug 2026
(Gate 2 token law row 7 and the modal-family close, Fable law review):
`--grad-card` (`#1a1610` to `#14110c`, section cards, hero plate,
rail panel), `--grad-rail` (`#16130d` to `#100d09`, rail panel),
`--grad-panel-lift` (`#332d22` to `#2a251d`, B3, modal panel surface,
interim in both themes per F1), `--grad-creation-card` (`#241f16` to
`#1b1711`, B6, value only, application scope held for F2).
Glows: `--glow-ambient`, `--glow-hover`, locked.
Atmosphere: `--atm-hearth`, `--atm-vault`, `--atm-veil`,
`--atm-constellation`, locked, applied as positioned layers, never baked
into a surface color.

## New tokens, ED1F propagation, RULED 22 Aug 2026

Gate 2 twelve-row token law (`explorations/gate1/GATE-LOG.md`, Crestfall
Editor DS Claude Design project) plus the modal-family close candidates,
ratified at the Fable law review on branch `design/ds1-claude-design-sync`.
Row 12 of the token law, `--focus-ring-editor`, is not a row here: its
recipe is ABSORBED into the global `--focus-ring` above under the
existing name, the editor-scoped name is never minted. Tokens already
given a row elsewhere in this document (`--status-success` revision,
`--status-danger-fill`, `--grad-card`, `--grad-rail`,
`--grad-panel-lift`, `--grad-creation-card`, `--chrome-wash`,
`--panel-glass`, `--blur-glass`, `--focus-ring-ongold`,
`--fill-option-rest`, the `--fill-whisper` legal-on addition) are not
repeated here.

| Token | Dark | Light | Role | Legal on | Never on | Status |
|---|---|---|---|---|---|---|
| `--text-input` | `0.875rem` (14) | same | Field bed type size, typed and placeholder | Every field bed | n/a | locked |
| `--lh-input` | `1.375rem` (22) | same | Field bed line height, pairs with `--text-input` | Every field bed | n/a | locked |
| `--ink-typed` | `#d9d3c6` | same, interim (F1) | Field VALUE text at `--weight-light` (Inter 300); distinct from the flipping `--ink` role token | Typed field values | Placeholders (use `--ink-faint`), body copy | locked |
| `--fill-ghost` | `rgba(242,209,148,.05)` | same, interim (F1) | Ghost-button and quiet-interactive-surface bed | `.cf-btn--secondary`, trait chips, quiet interactive surfaces | Whole large surfaces | locked |
| `--control-editor-md` | `var(--control-filter)` (38) | same | Editor CTA height, desktop only; aliases `--control-filter` rather than re-minting the same literal (CR-053) | Editor CTAs, desktop widths | Any control needing the 44px touch floor | locked |
| `--control-editor-sm` | `1.75rem` (28) | same | Editor CTA height, desktop only, genuinely new value | Editor CTAs, desktop widths | Any control needing the 44px touch floor | locked |
| `--bed-deep` | `#0d0b08` | same, interim (F1) | Deepest field-bed fill | Field beds | Any surface already on the `--surface-1..4` ramp | locked |
| `--shadow-bed` | `inset 0 1px 2px rgba(0,0,0,.25)` | same | Inset field-bed shadow, paired with `--bed-deep` | Field beds | Floating surfaces (use `--shadow-modal` / `--shadow-popover`) | locked |
| `--line-fade` | `linear-gradient(90deg,transparent,rgba(242,209,148,.13) 12%,rgba(242,209,148,.13) 88%,transparent)` | same | 1px fade-out-ends divider, never edge-to-edge | Sidebar groups, card-header rules, rail progress rules; scope broadened 22 Aug 2026 (B1) to every modal-family divider, with a `.tight` compact-margin variant in dense contexts (picker, sort) | Edge-to-edge dividers | locked |
| `--weight-light` | `300` | same | Ghost-button and typed-field-value weight | `.cf-btn--secondary` and other ghost-styled buttons/chips, `--ink-typed` field values | Body copy, headings | locked |

F1, held for a Brian ruling: every row above marked "interim (F1)"
declares the same value in both themes today; real light-theme values
need a render sitting (the panel-lift gradient, creation-card
gradient, `--fill-option-rest`, `--panel-glass`, `--bed-deep`,
`--grad-card`, `--grad-rail`, `--chrome-wash`, `--ink-typed`,
`--fill-ghost`).

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
