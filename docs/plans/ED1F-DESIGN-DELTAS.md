# ED1F: Design Deltas, Modal Family Close

Capture doc for the modal-family conformance pass, in propagation-ready
language, replacing the prior contents of this file in full per
Brian's 22 Aug 2026 manifest. Sourced from `explorations/gate1/GATE-LOG.md`'s
"MODAL FAMILY, CLOSED" section (22 Aug 2026) and the two conformance
exhibits in the Crestfall Editor DS Claude Design project:
`explorations/conformance/Conformance Sheet.html` and
`explorations/conformance/Modal Family v2.html`. Every value is
checked against `app/theme.css` and `app/design-system.css` directly,
not assumed: a value that already matches a locked token is cited as
that token; a value with no match is recorded as a token candidate.
Docs-only capture pass, no component, token, or CSS files touched.

Where GATE-LOG.md's own text conflicted with the ruling manifest this
doc was written from, both readings were recorded and marked CONFLICT.
The one such conflict (A2, blur scope) was resolved by Brian at the
22 Aug 2026 law review; no CONFLICT marker remains in this file.
Section C now records that review's rulings on every candidate; the
full law-document edit list and app-wide propagation checklist live
in `docs/plans/ED1F-PROPAGATION-PLAN.md`.

## A. New laws ratified this pass

### A1, Ghost button weight is 300

Supersedes the 400 this file previously recorded. Gate 2's token-law
ratification (weight 300) governs over Gate 1's earlier ratified
grammar (weight 400); Brian's own conflict ruling settled this before
the modal-family pass, and GATE-LOG.md's MODAL FAMILY section restates
it as settled law: "Session laws applied: ghost 300."

**Checkable condition:** `.cf-btn--secondary` and any other
ghost-styled button or chip renders text at font-weight 300, never
400 or `--weight-regular`.

**Token mapping:** weight 300 is the same literal weight already added
to the font pipeline for typed field text (`--ink-typed`). No new
numeric value here, a second consumer of the same weight. Whether it
gets its own `--weight-light` alias or stays a literal 300 is a
propagation-pass naming decision, not resolved by this ruling.

### A2, Three blur tokens, no cross-borrowing

`--blur-chrome` (12px, existing locked token, sticky nav and editor
chrome, scope unchanged), `--blur-panel` (2px, existing locked token,
overlay panels, scope unchanged), and `--blur-glass` (NEW, 12px,
tooltips). The law is that none of the three borrows another's scope.

**Sourcing, conflict RESOLVED (Brian, 22 Aug 2026 law review):** the
two source texts disagreed on whether `--blur-glass` covers glass
chrome surfaces beyond tooltips. Brian's ruling closes it on the
narrower reading: three blur tokens stand as ruled, no
cross-borrowing. Nav and top-bar chrome uses `--blur-chrome`. Panels
and the viewer veil use `--blur-panel` at 2px. `--blur-glass` at 12px
is tooltips only. The prior CONFLICT marker is cleared.

The rendered exhibits agree with the ruling: every glass-chrome
surface actually built in `Modal Family v2.html`, the viewer's veil,
its two-line header, its 390 close control, and the creation card's
kebab menu, uses a shared `.glass` class at `background:
rgba(36,32,25,.85); backdrop-filter: blur(var(--blur-panel))`, i.e.
the existing 2px panel blur, not `--blur-glass`. `--blur-glass` at
12px appears nowhere in either exhibit except the tooltip
demonstration in `Conformance Sheet.html`.

**Checkable conditions:**
- `--blur-chrome` (12px) and `--blur-panel` (2px) keep their existing legal scopes, unchanged by this pass (plus the Gate 2 token-law row 10 scope extension of `--blur-chrome` to the editor sticky nav and mobile save row).
- `--blur-glass` exists as a new 12px token, legal on tooltips only, never on any other surface. No cross-borrowing between the three blur tokens.

**Token mapping:** `--blur-glass`: 12px. Genuinely new, no existing
token at this value scoped to tooltips (`--blur-chrome` is also 12px
but is documented "never a floating panel," which a tooltip is).

### A3, Gate 1 gold-ornament ring becomes the single global `--focus-ring`

The kit-focus border-brightening pattern and ED1E's quiet-field-ring
recipe both retire. Source: GATE-LOG.md's MODAL FAMILY opening line,
"Gate 1 ring global under --focus-ring (kit-focus + quiet-field-ring
retired)." This closes the four-way focus-treatment conflict this
capture doc has carried since Gate 1 (global `--focus-ring`, the
kit-focus law, ED1E's quiet-field-ring, and Gate 1's own
gold-ornament-glow recipe): the gold-ornament recipe wins, ships under
the EXISTING `--focus-ring` name (the token name does not change, only
the recipe behind it), and the other three retire.

**Checkable conditions:**
- Every focusable control app-wide, not only field beds, resolves through `--focus-ring`.
- No kit-focus border-brightening treatment renders anywhere.
- No ED1E quiet-field-ring (`cf-field`, 1px `--gold-action`) renders anywhere.

**Token mapping:** `--focus-ring`'s literal value changes from its
prior two-ring box-shadow recipe (`0 0 0 2px var(--canvas), 0 0 0 4px
var(--gold-ornament)`) to the gold-ornament-border-plus-glow recipe
ratified across Gate 1 and Gate 2 (border `--gold-ornament`, glow `0 0
0 3px rgba(224,171,94,.10)`, that rgba triplet being `--gold-action`'s,
not `--gold-ornament`'s, two different golds layered together). This
is a revision to an existing locked token's value, the same category
as this pass's `--status-success` and prior `--focus-ring`
discussions, not a new candidate name.

**Propagation requirement carried forward:** the ring must be verified
legible on every surface depth it can land on, not only field beds.
Buttons, chips, nav rows, and cards, at their real rendered surfaces
(`--surface-1` through `--surface-4`, plus the gradient card/rail
surfaces), all need a contrast check during propagation, not an
assumption that the field-bed check covers every case.

**Distinct from `--focus-ring-ongold` (see B10):** the global ring
above is the default focus treatment everywhere. `--focus-ring-ongold`
is a separate, narrower recipe layered specifically on gold-filled
surfaces (confirmed in the exhibit as applied only to
`.cf-btn--primary` via a `.goldring` class), not a replacement for the
global ring and not in conflict with it.

### A4, Mobile modal law, supersedes R4 under 700px

**Sourcing:** GATE-LOG.md's MODAL FAMILY section: "MOBILE MODAL LAW
(comment rulings, supersedes R4 under 700px): blurred context strip
stays above; panels bottom-anchored at CONTENT height; unsaved-dismiss
routes through confirm; 44px floors; drawer inherits all six sidebar
deviations." R4 itself is `docs/BUILD-BLUEPRINT.md` section (p),
"Mobile modal law (R4), RULED 10 Aug 2026": "On mobile, popup modals
maximize the screen vertically and horizontally with thumb scrolling
inside; never anchored to the bottom edge, never small floating
cards." This new ruling directly reverses R4's own "never anchored to
the bottom edge" clause for widths under 700px: panels now ARE
bottom-anchored, sized to content height, not maximized full-screen.

**Checkable conditions:**
- Under 700px, a modal's context (the page behind it) stays visible through a blur, not fully obscured.
- Under 700px, a modal panel is sized to its content's height and anchored to the bottom, not maximized to fill the screen.
- Dismissing a modal with unsaved state under 700px routes through a confirm step, never a silent discard.
- Every touch target inside a mobile modal holds the 44px floor.
- The mobile modal drawer inherits all six sidebar deviations already ruled (ink lift, top-bar wash, Legacy hidden, Community Links removed, footer re-order; economy fixture still pending its own scope decision).

**Token mapping:** none new; this is a layout/behavior law, not a
token-level change.

**Contract and propagation flag:** `KitModalFrame` is the named
propagation target. R4's own text in `docs/BUILD-BLUEPRINT.md` needs an
amendment noting this supersession for widths under 700px; R4's
original wording carries no explicit breakpoint number ("on mobile"
generally), while this ruling is scoped explicitly to under 700px.
Propagation should confirm both rules mean the same breakpoint before
treating R4 as fully superseded rather than partially.

## B. Modal family rulings, all closed

All ten items below are GO, per GATE-LOG.md's "MODAL FAMILY, CLOSED
(GO all, 22 Aug 2026)" heading, and cross-checked against the two
conformance exhibits.

### B1, Fade dividers in all modal variants, never edge-to-edge

Used across the whole modal family: the trait modal's own divider, the
picker's "fade dividers all variants" ruling, the sort modal's compact
variant, and the creation card's kebab menu divider before its danger
zone.

**Exact recipe, from `Modal Family v2.html`'s own stylesheet:**
```
.fdiv{height:1px;background:linear-gradient(90deg,transparent,rgba(242,209,148,.13) 12%,rgba(242,209,148,.13) 88%,transparent);margin:var(--space-5) 0}
```
A `.fdiv.tight` variant (smaller margin) is used in compact contexts
(the picker and sort modals).

**Token mapping:** this is the existing `--line-fade` device (1px,
fading to a 13% gold peak) already ratified for sidebar groups,
card-header rules, and rail progress rules, now with its legal scope
extended to modal dividers as well. Same value, broadened usage, not a
new token.

### B2, Desktop sheet retired for the SORT modal; centered modal on desktop, sheet on mobile

**Scope note:** this item names the SORT modal specifically in
GATE-LOG.md ("sort: desktop sheet RETIRED, centered modal, mobile
keeps sheet"), not every modal in the family; the trait, picker, and
viewer modals each have their own distinct treatment recorded
separately in this section.

**Exact sizing, from `Modal Family v2.html`:** the desktop sort modal
is now `.mpanel{width:360px;padding:var(--space-5) var(--space-4)}`, a
compact centered modal, not the prior full-height sheet. Mobile keeps
the sheet form factor.

### B3, Panel lift gradient, `#332d22` to `#2a251d`

**Token mapping:** **TOKEN CANDIDATE**, genuinely new: neither hex
matches any existing surface or gradient token in `app/theme.css`
(the closest named gradient family, `--grad-card`, runs `#1a1610` to
`#14110c`, a different pair). See Section C.

### B4, Trait modal: darker unselected option-card fills, warm selected fill, no footer

**Confirmed in the exhibit markup:** `#v2-trait-1440` in `Modal Family
v2.html` has no `.mfoot` element anywhere in its section; the
exhibit's own annotation states explicitly "Kept: ... no footer."
GATE-LOG.md's own RULED(1) line names "lift-gradient panel, fade
divider, darker unselected card fills" but does not spell out "warm
selected fill" or "no footer" in that shorthand sentence; both are
confirmed directly in the exhibit, not a conflict, just a terser log
line than the full ruling.

**Exact fills, from the exhibit:**
```
.ocard{background:rgba(0,0,0,.22)}
.ocard.on{background:rgba(242,209,148,.06)}
```

**Token mapping, a genuine find worth flagging:** the SELECTED fill,
`rgba(242,209,148,.06)`, is an EXACT match to the existing locked
token `--fill-whisper` (`rgba(242, 209, 148, .06)`). This is not a new
candidate; cite `--fill-whisper` directly. The UNSELECTED (rest) fill,
`rgba(0,0,0,.22)`, matches no existing token: it is a pure-black
overlay distinct from `--scrim` (`.40`), `--scrim-strong` (`.70`), and
every gold-based `--line-*`/`--fill-*` step. **TOKEN CANDIDATE** for
the rest state only.

### B5, Delete confirmation

Danger-button recipe ratified (`--status-danger` border and ink, 6
percent fill), type-aware copy ("Delete this image" / "story" /
"character" / "adventure" / "video"), Cancel and CTA aligned to the
ends of the fade line, compact and bottom-anchored at 390.

**Token mapping:** `--status-danger` (`#C2634D`) is an existing locked
token, confirmed usage for both border and ink. The 6 percent fill
does NOT match the existing `--status-danger-bed` (`rgba(194, 99, 77,
.14)`, i.e. 14 percent); it is a distinct, lighter step, the same
category of candidate the field-grammar error treatment raised
earlier in this project's history for a quieter danger fill.
**TOKEN CANDIDATE.**

**Contract note:** the shipped `.cf-btn--danger` in
`app/design-system.css` has no border and no fill at rest today
(`background: none; border-color: transparent; color:
var(--status-danger)`). This ratified recipe (border AND fill AND ink,
all from `--status-danger`) is a new, modal-scoped danger CTA recipe,
not a restyle of the existing class as it stands; propagation needs to
decide whether it becomes a new variant or replaces
`.cf-btn--danger`'s own rest state.

### B6, Creation cards

Lighter gradient, on-card Save toggle, glass kebab menu with a fade
divider before the danger zone.

**Exact gradient, from GATE-LOG.md's RULED(7) line:** `#241f16` to
`#1b1711`. Distinct from the panel-lift gradient in B3 and from
`--grad-card`; **TOKEN CANDIDATE**, no existing match.

**Save toggle, confirmed from the exhibit:** sits inline in the
card's `.crmeta` metadata row at the bottom of the card, next to
"Draft, Private," always visible, not a corner-positioned or
hover-only control as the phrase "on-card" might otherwise suggest.

**Kebab menu, confirmed from the exhibit:** top-right, absolute
positioned (`.kebab`), opens `.kmenu.glass` with items Share, Archive,
then the `.fdiv` fade divider, then the danger "Delete..." item. The
glass treatment is `background: rgba(36,32,25,.85); backdrop-filter:
blur(var(--blur-panel))`, i.e. 2px, not `--blur-glass` (consistent
with A2's resolved ruling). **Corrected at the 22 Aug 2026 law
review: `rgba(36,32,25,.85)` is NOT a new candidate. It is an exact
match to `--panel-glass`, ratified in the Gate 2 token law (row 11)
at exactly this value with the 2px `--blur-panel` pairing. Cite
`--panel-glass` directly, the same class of correction as B4's
`--fill-whisper` find.**

### B7, Viewer final

Two-line glass header, title centered, icon row delete, report,
details, download, bookmark, like; close control outside top-right on
desktop and a floating thumb-zone glass control at 390; bottom bar
Generate Variant, Reassign Asset, Share in gold ink with a
brighter-gold hover; veil at the lawful 2px.

**Confirmed from the exhibit, all four of the viewer's glass surfaces
use `--blur-panel` (2px), none use `--blur-glass`:** the veil itself
(`.veil.frost{background:rgba(6,4,2,.62)}`, inheriting the base
`.veil`'s `blur(var(--blur-panel))`), the two-line header
(`.vwbar.glass`), and the 390 close control (`.mclose.glass`) all
resolve through the same 2px `.glass` class. GATE-LOG.md's own text
confirms the veil specifically: "lawful 2px veil (no glass
extension)."

**Bottom bar hover note:** the bottom bar's "brighter-gold hover" is a
distinct, simpler ink-color hover than B9's primary-hover recipe
(these buttons are gold-ink text links, not filled `.cf-btn--primary`
surfaces); no exact CSS for this specific hover was found in either
exhibit beyond the described ink brightening. Flag for the propagation
pass to pin an exact value, it is not yet a named candidate.

**Token mapping:** the icon row and bottom bar text color are
described as "quiet ink" and "gold ink" respectively in GATE-LOG.md,
consistent with existing `--ink-dim`/`--gold-action` usage; no new
token implied.

### B8, Confirm buttons span the fade line

General modal-footer button-layout law: a two-button footer (Cancel
plus a primary CTA) aligns to the two ends of the modal's own fade
divider (B1), spanning its width. Sourced from GATE-LOG.md's RULED(3)
"buttons/chips GO as rendered, LOCKED" together with RULED(6)'s
specific instance for delete confirmation ("Cancel/CTA at fade-line
ends"). No exact CSS beyond this layout description was found in
either exhibit for footers outside the delete-confirmation and sort
modals; propagation should confirm the same alignment law applies
anywhere else a two-button footer appears.

**Token mapping:** none new; a layout rule.

### B9, Primary hover: brightness lift plus glow

**Exact recipe, confirmed from the exhibit, exact match to
GATE-LOG.md's own candidate line:**
```
.cf-btn--primary:hover{filter:brightness(1.08);box-shadow:var(--glow-hover)}
```

**Status note, not a conflict:** GATE-LOG.md lists this SAME recipe in
both its RULED section (behavior is closed, GO) and its "NEW
TOKEN/RECIPE CANDIDATES" list (the exact numeric recipe is not yet a
named token in `app/theme.css`). Both are true at once: the design
decision is closed, its entry into the token file is still pending
the Fable law review (Section C).

**Token mapping:** `--glow-hover` is an existing locked token,
confirmed usage. `filter: brightness(1.08)` is a literal, not
currently expressed as any token; **CANDIDATE** for the propagation
pass to name if it should be reusable beyond this one recipe.

### B10, Ring on gold, `--focus-ring-ongold`

`0 0 0 2px var(--canvas), 0 0 0 3px var(--gold-ornament), 0 0 0 6px
rgba(224,171,94,.10)`. Gold-fill scope only.

**Confirmed from the exhibit:** applied only to `.cf-btn--primary`
(the only gold-filled surface demonstrated) via a `.goldring` class,
across canvas, `--grad-card`, and small/mobile sizes, confirming the
"gold-fill scope only" restriction. Note: the exhibit's own annotation
prose miscounts this recipe as "1px ornament" in one place; the
literal CSS and GATE-LOG.md's own text both say 3px. **Ruled at the
22 Aug 2026 law review (Brian, pre-resolved): the "1px ornament"
annotation is a documentation typo, not a competing value. The law
value is 3px ornament. The exhibit annotation is flagged for
correction; nobody codes off the wrong number.**

**Status note, same as B9:** GATE-LOG.md and this pass both treat the
design as closed (GO) while listing the token itself as a propagation
candidate (Section C); not a conflict, both statements are consistent.

**Token mapping:** border and outer ring reuse `--gold-ornament` and
`--canvas` respectively, existing locked tokens. The 6px 10-percent
gold ring is `rgba(224,171,94,.10)`, `--gold-action`'s rgb triplet at
10 percent, the same glow color used in A3's global `--focus-ring`
recipe. **CANDIDATE** name, not yet in `app/theme.css`.

## C. Token and recipe candidates, RULED at the Fable law review (22 Aug 2026)

Cross-checked against GATE-LOG.md's own "NEW TOKEN/RECIPE CANDIDATES
for propagation" line, which names SEVEN items, one more than the six
named directly in the ruling manifest this doc was written from. Every
ruling below is recorded in full, with the law-document edit list and
the app-wide checklist, in `docs/plans/ED1F-PROPAGATION-PLAN.md`.

1. `--focus-ring-ongold` (B10): **RATIFIED.** Recipe as written, gold-fill scope only. DESIGN-TOKENS' "ONLY focus token" clause is amended to admit it.
2. `--blur-glass` (A2): **RATIFIED, tooltips only** (conflict resolved by Brian, see A2). No consumer exists until the tooltip component (CR-047) is designed; the token lands so the law is complete.
3. `cf-btn--danger` recipe (B5): **RATIFIED** as a new modal-confirm CTA recipe (`--status-danger` border and ink, new 6 percent danger-fill token). The in-page quiet-ghost danger trigger law is untouched; `.cf-btn--danger-filled` is superseded by this recipe.
4. Panel lift gradient, `#332d22` to `#2a251d` (B3): **RATIFIED** as a new surface-gradient token for modal panels, propagated through `KitModalFrame`; supersedes `--surface-4` as the modal panel surface. Name minted at propagation, avoiding the existing `--grad-panel`.
5. Primary hover recipe (B9): **RATIFIED.** `filter: brightness(1.08)` plus `--glow-hover`; the brightness literal stays a recipe literal unless propagation finds a second consumer.
6. Fade-divider modal scope (B1): **RATIFIED.** `--line-fade` (Gate 2 token law row 9, not yet minted in `app/theme.css`) enters with its full scope including modal dividers; B8's footer-alignment law rides with it.
7. Option-card fills (B4): **PARTIAL RATIFY.** The selected fill is an exact duplicate of locked `--fill-whisper`; cite that token, no candidate. Only the REST fill `rgba(0,0,0,.22)` is ratified as a new token, a ruled scoped exception to the translucent-black-fill ban, legal on option-card rest state only.

Two further values surfaced during cross-checking, both ruled inline
above: the creation card's own gradient (`#241f16` to `#1b1711`, B6)
is **RATIFIED as a token value** with its application scope still
needing a Brian ruling (it conflicts with card law 2.16(a)/(v); see
the propagation plan's item F2); the kebab menu's glass-panel
background is **not a candidate**, it is the ratified `--panel-glass`
(corrected in B6 above).

Still needing a Brian ruling, held out of propagation (full detail in
the propagation plan's section F): light-theme values for the new
dark-only tokens; the creation-card ruling's scope plus its Archive
action (no contract or endpoint exists); glass-menu scope beyond the
kebab menus.

## D. Open and parked items

### CR-054, soft-delete recovery window (renumbered 22 Aug 2026)

Parked. Window is 7 to 30 days, not yet ruled to a single number;
confirm copy carries a "[X] days" placeholder until it is. Nick's
lane, per GATE-LOG.md: "CR-052 FILED: soft-delete recovery window 7 to
30 days; confirm copy carries [X] days."

**Numbering collision RESOLVED (Brian, 22 Aug 2026 law review):**
GATE-LOG.md's use of "CR-052" for this item collided with the
existing CR-052 sidebar deviations bundle (filed 21 Aug 2026 in
`docs/CONTRACT-REQUESTS.md`). Per Brian's ruling the soft-delete item
takes the next free number in that ledger, which is **CR-054**
(CR-053 is the Gate 1 token-candidates entry). The G1 propagation
pass files CR-054 into `docs/CONTRACT-REQUESTS.md` under that number;
the sidebar bundle keeps CR-052 unchanged.

### Captures still wanted, non-blocking

Quick-create step indicators, live viewer chrome, story modals. Named
directly in GATE-LOG.md's "CAPTURES STILL WANTED" line; none of these
are designed or ruled yet, nothing to capture until they are.

### Repo-side DS-check items

The Tailwind `.space-y-*` scan-exclusion fix and the 33 `@kind`
comment additions stay in the `/design-sync` HANDOFF note, not this
file, per the manifest's own instruction. Count discrepancy noted at
the ED1G review, 22 Aug 2026: this document records 33 pending
`@kind` additions, `.design-sync/NOTES.md` records 38. Neither figure
is corrected here; a source-of-truth recount against the live token
files is needed before either number is treated as authoritative.
