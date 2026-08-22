# ED1F: Design Deltas, Gate 1 (Field Grammar)

Capture doc for patterns ruled inside the Crestfall Editor DS Claude
Design project, in propagation-ready language, per the design sprint
plan's Phase 4 capture format. Each entry: DD-NN, title, family, ruling
basis, the change as checkable conditions, token mapping, contract
impact, propagation targets. Every value is checked against
`app/theme.css` directly, not assumed: a value that already matches a
locked token is cited as that token; a value with no match is recorded
as a token candidate per the token-first directive (`docs/FRONTEND-SOP.md`
section 17), never written as a silent literal.

## Gate 1 ruling

Brian ruled a direct pick: **1b, "Tall Rail."** 1a and 1c rejected. No
reasons recorded for the rejected options beyond the pick itself.

## DD-01, Gate 1 architecture: Tall Rail

**Family:** editor page architecture (`app/studio/v2/editor/editor/Editor.view.jsx`).

**Ruling basis:** Brian, direct pick, 21 Aug 2026, Gate 1 three-way ("Tall Rail" / 1a / 1c).

**The change:** the sticky sections rail rises to the top of the hero
(previously the rail began level with the first section box; the
hero occupied the full-width top of the main column with no rail
alongside it). The hero itself is boxed into the form column as a
floating panel (a bordered/surfaced card matching the section-box
family), rather than an unboxed full-bleed block.

**Checkable conditions:**
- The rail's top edge aligns with the hero's top edge, not the first section box's top edge.
- The hero renders inside a bordered panel using the same surface/radius recipe as a section box (see DD-08), not as a bare, unbordered block.

**Token mapping:** architecture-only change; no new color/type/spacing values introduced by this entry itself (the hero panel's surface treatment is DD-08).

**Contract impact:** `EDITOR_VIEW_CONTRACT_VERSION` (currently `4.0.0`) needs a version review: the `hero` slot's relationship to the rail changes (rail now spans the hero's height), which may be presentation-only (compatible) or may require the View to know the hero's rendered height for rail alignment. Flag for the propagation pass to determine additive vs. breaking.

**Propagation targets:** `Editor.view.jsx` (rail/hero layout), `Editor.contract.js` (version note), `editor-header/` (hero panel treatment, see DD-08).

## DD-02, Label anatomy

**Family:** field grammar (`SharedFields.jsx`, `KitFormField`).

**Ruling basis:** Brian, ratified Gate 1 spec list, 21 Aug 2026.

**The change:** label is an uppercase micro-label, Inter regular weight (not medium), in the faintest ink step. A required field shows a small asterisk inside a fixed 9px flex-centered box, with a +0.5px optical position nudge. A recommended (not required) field shows a tiny "RECOMMENDED" micro-tag instead. No bare glyph ornaments render anywhere in the label row (every mark is either the asterisk-in-a-box or the micro-tag, never a lone symbol with no container).

**Checkable conditions:**
- Every field label renders `text-transform: uppercase`.
- Label weight is `--weight-regular` (400), never `--weight-medium` (500).
- Label ink is `--ink-faint` (`#8d8674`).
- A required field's marker sits in a fixed 9px by 9px flex-centered box.
- A recommended field shows the word "RECOMMENDED" as a micro-tag, not an icon alone.
- No field row ships a bare glyph (icon or symbol) outside one of the two marker treatments above.

**Token mapping:**
- Label type: `--text-label` (11/16) plus `--track-label`, `--weight-regular`, `--ink-faint`: all four already locked tokens, confirms existing usage, no new token.
- Required-marker box, 9px fixed size: **TOKEN CANDIDATE**, no existing size token matches (spacing scale is 4px multiples: `--space-1` = 4, and so on; icon tokens are `--icon-sm/md/lg`, none confirmed at 9px). Record as a candidate, e.g. `--marker-box` = 9px, pending Brian's naming.
- The +0.5px optical nudge is an implementation detail (a relative position adjustment), not a token.

**Contract impact:** none (presentation-only within `SharedFields.jsx`'s existing label row).

**Propagation targets:** `SharedFields.jsx` (`LabelRow`, `LABEL_CLASS`), `KitFormField.view.jsx` (label row).

## DD-03, Field bed anatomy

**Family:** field grammar (`SharedFields.jsx`, `KitFormField`).

**Ruling basis:** Brian, ratified Gate 1 spec list, 21 Aug 2026.

**The change:** the field bed is a deep inset well (`#0d0b08`) with a soft inset shadow (`0 1px 2px` at 25% opacity), 10px of vertical padding for wrapped text, and typed text in Inter light weight (300) at a softened ink value (`#d9d3c6`), lighter than `--ink-dim` but not as bright as `--ink`.

**Checkable conditions:**
- Field bed background is the new deep-inset value (below), not `--surface-1`.
- Field bed carries an inset shadow, not a border-only edge.
- Vertical padding inside a wrapped-text bed is the new 10px value (below).
- Typed (entered) field text renders at weight 300 and the new softened-ink value (below), not `--ink`.

**Token mapping, every value checked against `app/theme.css` directly:**
- `#0d0b08`: **TOKEN CANDIDATE.** Does not match `--canvas` (`#090805`), `--surface-1` (`#16130f`), or any other surface step; sits between canvas and surface-1. No existing token to cite.
- Inset shadow `0 1px 2px` at 25%: **NEW DEVICE, flag for a law update, not just a token.** The current elevation law states in-flow surfaces separate by border only, never by shadow (shadow is reserved for floating surfaces via `--shadow-modal`/`--shadow-popover`). A shadow on an in-flow field bed contradicts that law as written; this needs its own ruling, not a silent exception.
- 10px vertical padding: **TOKEN CANDIDATE.** Does not match the 4px-multiple spacing scale (`--space-2` = 8, `--space-3` = 12); sits between them.
- Inter weight 300: **TOKEN CANDIDATE.** Locked weights are `--weight-regular` (400), `--weight-medium` (500), `--weight-bold` (700, banned above); 300 has no token and has never been ruled before.
- `#d9d3c6`: **TOKEN CANDIDATE.** Does not match `--ink` (`#ece7dc`), `--ink-dim` (`#a9a294`), or `--ink-faint` (`#8d8674`); sits between `--ink` and `--ink-dim`.

**Contract impact:** none structural; a new surface/type step, once named, is additive to the token set.

**Propagation targets:** `SharedFields.jsx` (`FIELD_BED_CLASS`), `KitFormField.view.jsx` (input bed).

## DD-04, Focus treatment, CLOSED as the single global focus recipe

**Family:** field grammar, closes the standing four-way focus-law conflict.

**Ruling basis:** Brian, ratified Gate 1 spec list, 21 Aug 2026; CLOSED by Brian's conflict ruling, 22 Aug 2026.

**The change:** on focus, the field bed border becomes `--gold-ornament`
with a glow (dimmed from the full action-gold treatment), and the label
warms (shifts toward a brighter ink/gold value) on focus. Brian's 22
Aug ruling promotes this recipe from a field-grammar pattern to **the
single global focus treatment for the entire app**: it replaces the
existing `--focus-ring` token's own recipe, and retires the kit-focus
border-brightening pattern. The token NAME stays `--focus-ring`, so
every surface already wired to it inherits the new recipe with no
call-site rename; only the value behind the name changes.

**Checkable conditions:**
- `--focus-ring` resolves to the `--gold-ornament`-border-plus-glow recipe (exact value below) everywhere it is used, not the prior two-ring box-shadow recipe.
- Every focusable surface in the app (buttons, chips, nav rows, cards, field beds, not field beds alone) renders this one recipe, with no second focus treatment competing anywhere.
- The kit-focus law's `--line-strong` border-brightening pattern no longer renders on focus anywhere it previously did.
- A focused field bed's label ink still visibly warms (shifts toward a brighter ink/gold value) and returns to `--ink-faint` on blur; this label-warm behavior is field-specific and is NOT part of the global ring recipe itself (see the open gap below).

**Token mapping:**
- `--focus-ring` (revised value): border `--gold-ornament` (`#C9A86A`, existing locked token) plus a glow. DD-22's device ruling supplied a concrete glow value for the same recipe, `0 0 0 3px rgba(224,171,94,.10)` (that rgba triplet is `--gold-action`'s, not `--gold-ornament`'s: border and glow are two different golds layered together, not one color at two opacities). This is a REVISION to an existing locked token's value, same category as DD-13's `--status-success` revision, not a new candidate name.
- "Label warms" target ink value: still **not specified** beyond "warms"; DD-04's original open specification gap is NOT closed by this ruling, since the 22 Aug ruling addresses the ring/border treatment, not the label's own ink shift. Needs a named token (likely `--gold-bright` or `--ink`) before it is checkable in code.

**RESOLVED, closing the four-way conflict:** the 22 Aug ruling states
plainly "there is one focus language, not two." All three competitors
this entry originally flagged are superseded: the prior `--focus-ring`
recipe (value replaced, name kept), the kit-focus border-brightening
law (retired outright, named explicitly in the ruling), and ED1E's
quiet-field-ring recipe (`cf-field`, 1px `--gold-action`, not named
explicitly in the ruling text but covered by "the four-way conflict is
closed by this ruling" and by "one focus language, not two"). No
further escalation is open on this entry.

**Contract impact:** none structural.

**Propagation requirement, carried forward per the ruling:** the ring
must be verified legible on every surface depth it can land on, not
only field beds. The propagation pass must contrast-check the
`--gold-ornament`-plus-glow recipe against buttons, chips, nav rows,
and cards at their real rendered surfaces (which span `--surface-1`
through `--surface-4` and the new gradient card/rail surfaces from
DD-20), not assume the field-bed check covers every case.

**Propagation targets:** `app/theme.css` (`--focus-ring` value
revision), every existing consumer of `--focus-ring` app-wide (not
scoped to the editor), the kit-focus law's own component(s) (removal),
`SharedFields.jsx`, `KitFormField.view.jsx`.

## DD-05, Field-level error treatment

**Family:** field grammar.

**Ruling basis:** Brian, ratified Gate 1 spec list, 21 Aug 2026.

**The change:** an error state shows a border color change plus the error message only, with no filled bed at the existing bed-fill opacity; instead a very light danger fill at 6%.

**Checkable conditions:**
- Error field bed border is `--status-danger-border`.
- Error message text is `--status-danger`.
- Error field bed background is a 6%-opacity danger fill, not the default bed background and not the existing 14% bed fill.

**Token mapping:**
- Border `--status-danger-border` (`rgba(194,99,77,.40)`) and message ink `--status-danger` (`#C2634D`): existing locked tokens, confirmed usage.
- 6% danger fill: **TOKEN CANDIDATE.** Does not match the existing `--status-danger-bed` (`rgba(194,99,77,.14)`, i.e. 14%); this is a distinct, lighter step. Record as a candidate (e.g. `--status-danger-bed-quiet`), do not reuse `--status-danger-bed`'s name for a different value.

**Contract impact:** none.

**Propagation targets:** `SharedFields.jsx`, `KitFormField.view.jsx` (error state).

## DD-06, Unified indicator chip family

**Family:** cross-cutting (selects, accordions, rail collapse, back navigation).

**Ruling basis:** Brian, ratified Gate 1 spec list, 21 Aug 2026.

**The change:** every directional/disclosure indicator in the editor (select chevrons, accordion chevrons, the rail collapse control, and back navigation) uses ONE chip family: a 22px squircle containing a stroked SVG chevron. This replaces whatever per-component indicator treatment exists today with a single, unified recipe.

**Checkable conditions:**
- Select trigger chevron, accordion open/close chevron, rail collapse control, and back button all render the same 22px squircle chip shape.
- The glyph inside every instance is a stroked SVG chevron (not a filled icon, not a different glyph per context).

**Token mapping:** 22px: **TOKEN CANDIDATE.** Does not match `--radius-*` (a corner scale, not a size) or the spacing scale; no confirmed `--icon-*` value at 22px. Record as a candidate (e.g. `--chip-indicator-size` = 22px). The squircle corner value itself, once specified, should map to `--radius-sm` (8px) if it matches, or become its own candidate if the ratified squircle radius differs.

**Contract impact:** this is a genuine unification across multiple components: `KitDropdown` (select chevron), `Editor.view.jsx`'s `SectionBox` (accordion chevron) and rail (collapse control, not present in the current contract at all, see below), and back navigation. The rail collapse control is NEW: `EDITOR_VIEW_CONTRACT_VERSION` 4.0.0 has no rail-collapse prop today; this is an additive contract change, not just a restyle.

**Propagation targets:** `KitDropdown.view.jsx`, `Editor.view.jsx` (`SectionBox`, rail), `Editor.contract.js` (new rail-collapse affordance).

## DD-07, Button, chip fill, and control-size grammar

**Family:** cross-cutting (buttons, chips, control sizing).

**Ruling basis:** Brian, ratified Gate 1 spec list, 21 Aug 2026.

**The change:** interactive surfaces (ghost buttons, chips) use a 5%-opacity gold screen fill. Informational tags stay rounded pills. Primary CTA text weight is medium (500); ghost button text weight is regular (400). Control heights are 38 and 28 on desktop, with 44 as the mobile thumb-zone floor.

**Checkable conditions:**
- Every ghost button and interactive chip has a 5%-opacity gold fill at rest (not 0%, not a different opacity).
- Informational (non-interactive) tags render as full pills (`--radius-full`).
- Primary CTA text is `--weight-medium`; ghost button text is `--weight-regular`.
- A desktop control resolves to one of two heights: 38 or 28. Any control reachable by touch on mobile resolves to 44 regardless of its desktop height.

**Token mapping:**
- Informational pill radius `--radius-full` (999px): existing locked token, confirmed usage, consistent with its documented legal use ("tags and icon buttons ONLY").
- Primary/ghost weights `--weight-medium` / `--weight-regular`: existing locked tokens, confirmed.
- Mobile floor 44: matches `--control-md` (2.75rem = 44px) exactly, existing locked token, confirmed.
- Height 38: matches `--control-filter` (2.375rem = 38px) exactly, existing locked token, confirmed. Despite its name ("filter-line desktop height"), this ratified spec extends its legal use to the field-grammar control family generally; note the broadened usage, not a new token.
- Height 28: **TOKEN CANDIDATE.** No existing control token below `--control-sm` (32px, "desktop-only dense chrome"). This is a genuinely new, smaller control step.
- 5% gold screen fill: **TOKEN CANDIDATE.** Not confirmed against `--state-hover-fill`/`--fill-whisper` (values not verified at exactly 5% in this pass); record as a candidate pending that check, or confirm and cite if a future check matches.

**Contract impact:** none structural; a control at the new 28px step may need a `size` prop added where none exists today; flag per-component during propagation.

**Propagation targets:** button/chip recipes across the kit (`.cf-btn` family in `app/design-system.css`), `KitFilterChip.view.jsx`, `SharedFields.jsx` field-adjacent controls.

**AMENDED by Brian's conflict ruling, 22 Aug 2026:** ghost button text
weight is **300**, not `--weight-regular` (400) as ratified above.
Gate 2's token-law table (DD-18) is not a second, unresolved value; it
supersedes this entry's original 400. The checkable condition and
token-mapping lines above are superseded by this note, not deleted, to
keep the ruling history intact; DD-18 carries the resolved value
forward for propagation.

## DD-08, Zone and surface treatment

**Family:** page-level surfaces (hero, section cards, rail, sidebar).

**Ruling basis:** Brian, ratified Gate 1 spec list, 21 Aug 2026.

**The change:** canvas stays near-black. Cards, the hero, and the rail carry a slight brown gradient (not a flat fill) between two new dark values. Hairlines are a fading "whisper" treatment, 6% to 13% opacity, used specifically for fade-out sidebar separators. Shadows stay minimal everywhere. Section titles are Cormorant regular weight at the subhead type tier. All numeric meta text renders in the monospace family.

**Checkable conditions:**
- Page canvas is the existing near-black value (below).
- Card, hero, and rail surfaces render a gradient between two specific dark values (below), not a flat single-color fill.
- Sidebar separator hairlines fade from 6% to 13% opacity across their length, not a flat opacity.
- No new shadow beyond the existing floating-surface shadow tokens appears on an in-flow surface (see the DD-03 escalation, which is the one deliberate exception pending its own ruling).
- Every section-box header renders in `--font-display` at the `--text-subhead` tier, weight `--weight-regular`.
- Every numeric meta value (counters, timestamps, stats) renders in `--font-mono`.

**Token mapping:**
- Canvas `#090805`: matches `--canvas` exactly, existing locked token, confirms current usage unchanged.
- Card/hero/rail gradient `#1a1610` to `#14110c`: **TOKEN CANDIDATE, NEW DEVICE.** Neither hex matches any existing surface token; this is a genuinely new gradient surface family, explicitly permitted under the design-time-exploration ruling (gradient card surfaces named there directly). Record as a candidate pair (e.g. `--grad-card-start` / `--grad-card-end`), not a literal.
- Sidebar separator hairline, 6% to 13%: **TOKEN CANDIDATE, NEW DEVICE.** Existing `--line-whisper` (3%) and `--line` (10%) are both flat, single-value hairlines; a fading gradient between two opacity values is a new treatment, not a match to either.
- Section title `--font-display` plus `--text-subhead` plus `--weight-regular`: all existing locked tokens, confirmed.
- Numeric meta `--font-mono`: existing locked token; this entry is a new UNIVERSAL usage rule (apply to every numeric meta value, not a component-by-component choice), not a new token.

**Contract impact:** none structural.

**Propagation targets:** `app/theme.css` / `app/design-system.css` (new gradient and hairline tokens, once named and ruled), `Editor.view.jsx` (hero, section box, rail surfaces), `StudioSidebar.view.jsx` (separator hairlines).

## DD-09, Sticky, collapsible rails

**Family:** editor page architecture, depends on DD-06.

**Ruling basis:** Brian, ratified Gate 1 spec list, 21 Aug 2026.

**The change:** both rails (the desktop sticky rail described in DD-01, and by extension any equivalent mobile rail-like surface) are sticky and independently collapsible, each via a rail-collapse chip in its own top-left corner, using the DD-06 unified chip family.

**Checkable conditions:**
- The rail remains sticky through page scroll (already true per ED1E's standing "rail never scrolls inside itself" rule; this entry adds collapsibility on top of that, not a replacement of it).
- A collapse control sits at the top-left of each rail.
- The collapse control is the same 22px squircle chip specified in DD-06, not a bespoke control.
- Collapsing a rail is reversible from the same control (an expand affordance survives the collapse).

**Token mapping:** none new beyond DD-06's indicator chip candidate.

**Contract impact:** additive: `EDITOR_VIEW_CONTRACT_VERSION` needs a new collapsed/expanded state prop for the rail (does not exist in `4.0.0`). Bundle with DD-01's and DD-06's contract review rather than versioning three times for one family.

**Propagation targets:** `Editor.view.jsx` (rail), `Editor.contract.js`.

## Summary: token candidates raised (not yet named or ruled)

1. Required-marker glyph box, 9px fixed (DD-02).
2. Field bed background, `#0d0b08` (DD-03).
3. Field bed inset shadow as a NEW DEVICE, needs a law-update ruling (DD-03).
4. Field bed vertical padding, 10px (DD-03).
5. Inter weight 300 (DD-03).
6. Softened typed-text ink, `#d9d3c6` (DD-03).
7. Focus glow opacity, "10%," against `--gold-ornament`, pending verification (DD-04).
8. Focus label-warm target ink, open specification gap, not yet a candidate (DD-04).
9. Danger fill at 6% (distinct from the existing 14% `--status-danger-bed`) (DD-05).
10. Indicator chip size, 22px (DD-06).
11. Gold screen fill, 5% (pending verification against `--state-hover-fill`) (DD-07).
12. Control height, 28px (DD-07).
13. Card/hero/rail gradient pair, `#1a1610` to `#14110c` (DD-08).
14. Fading sidebar-separator hairline, 6% to 13% (DD-08).

Plus one standing law conflict this gate's ruling deepens rather than resolves: **the focus treatment (DD-04)**, now a four-way conflict across the global focus ring, the kit-focus law, ED1E's quiet-field-ring, and this gate's gold-ornament-glow recipe. Needs one reconciling ruling before any of the four ships broadly.

## Gate 2 ruling

Brian ruled a direct pick: **2a, "Boxed Plate."** 2b and 2c rejected. No
reasons recorded for the rejected options beyond the pick itself, same
as Gate 1. Source: `explorations/gate1/GATE-LOG.md`'s Gate 2 section
and `explorations/HANDOFF.md`, both read from the Crestfall Editor DS
Claude Design project. The save surface was amended during the
following device-ruling pass (DD-11), and a full device-ruling queue
and a 12-row token table were closed the same day; every entry below
is checked against `app/theme.css` directly, same discipline as Gate 1.

## DD-10, Gate 2 architecture: Boxed Plate hero

**Family:** editor page architecture, depends on DD-01.

**Ruling basis:** Brian, direct pick, 21 Aug 2026, Gate 2 three-way ("Boxed Plate" / 2b / 2c). File: `explorations/gate2/Hero Architecture.html`.

**The change:** the hero renders as a floating boxed plate inside the
form column, using DD-01's own panel treatment (bordered/surfaced card,
same recipe as a section box). This is the winning Gate 2 option; 2b
and 2c are rejected outright.

**Checkable conditions:**
- The hero renders as a bordered/surfaced panel (see DD-01, DD-08), never full-bleed or unboxed.

**Token mapping:** none new; this ratifies DD-01's own hero-panel
condition as the winning Gate 2 option rather than introducing new
values.

**Contract impact:** confirms DD-01's contract flag (`EDITOR_VIEW_CONTRACT_VERSION` rail/hero relationship) rather than adding a new one.

**Propagation targets:** `Editor.view.jsx` (hero), `editor-header/`.

## DD-11, Save surface amendment: rail-anchored block, bottom bar retired

**Family:** editor page architecture, cross-cutting with mobile. Closes CR-049.

**Ruling basis:** Brian, ruled during the chrome-blur device ruling, 21
Aug 2026 (amends the Gate 2 hero ruling). Exhibit: `explorations/gate2/Device Ruling - Chrome Blur.html`; verified at both widths in
`explorations/gate2/Device Ruling - Saved State.html` and
`explorations/gate2/Device Ruling - Mobile Save - Bloom.html`.

**The change:** the unsaved-state pill plus Discard/Save controls
anchor the bottom of the sections rail, not a separate full-width
bottom bar. The existing ED1E-era bottom control bar (Sections trigger
plus save state plus Save, per `Editor.view.jsx`) is retired. At 390
the same save block survives as a thumb-zone row (44px floor per
DD-07) rather than being dropped or redesigned separately for mobile.

**Checkable conditions:**
- The unsaved-state pill and Discard/Save controls render inside the rail's own bottom edge, not in a page-level fixed bottom bar.
- No standalone bottom control bar remains in the desktop render.
- At 390, the same rail-bottom save block renders as a thumb-reachable row, controls at the 44px mobile floor.

**Token mapping:** none new; layout/placement change only.

**Contract impact:** `EDITOR_VIEW_CONTRACT_VERSION` needs review alongside DD-01/DD-09: the save/discard affordance moves from a page-level slot to a rail-owned slot. Bundle with the DD-01/DD-06/DD-09 contract review rather than versioning separately.

**Propagation targets:** `Editor.view.jsx` (rail, retire the bottom bar), `Editor.contract.js`.

## DD-12, Chrome blur ruled in

**Family:** cross-cutting chrome (sticky nav, panels, tooltips). Closes CR-048.

**Ruling basis:** Brian, direct ruling, 21 Aug 2026, device ruling 1. Exhibit: `explorations/gate2/Device Ruling - Chrome Blur.html`.

**The change:** the editor's sticky nav and the mobile save row (DD-11)
carry a dark translucent wash with a 12px backdrop blur. Floating
panels keep the existing 2px panel blur. Tooltip glass (see CR-047)
uses the 12px chrome strength, not the 2px panel strength.

**Checkable conditions:**
- Sticky nav background is a near-black translucent wash at approximately 62% opacity, with a 12px backdrop blur behind it.
- The mobile save row (DD-11) carries the same wash and blur treatment.
- Floating panels (modals, menus, popovers) keep the existing 2px blur (`--blur-panel`), unchanged.
- Tooltip glass renders at 12px blur via its own `--blur-glass` token, never via `--blur-chrome` or `--blur-panel`.

**Token mapping:**
- 12px chrome blur: matches `--blur-chrome` exactly, existing locked token (minted 8 Aug 2026 at the create-hub topbar value). This ruling extends its documented scope ("persistent chrome only, sticky top bars") to the editor's sticky nav and, new, to the mobile save row. Broadened usage, not a new token.
- 2px panel blur: matches `--blur-panel` exactly, existing locked token, confirms current scope (floating panels).
- Dark wash at approximately 62%: **TOKEN CANDIDATE.** `rgba(6,4,2,.62)` does not match `--scrim` (`rgba(0,0,0,.40)`) or `--scrim-strong` (`rgba(0,0,0,.70)`): different base color (a near-canvas warm black, not pure black) and a distinct alpha from both. Record as a candidate, `--chrome-wash`.
- Tooltip glass at 12px: **RESOLVED by Brian's conflict ruling, 22 Aug 2026.** `--blur-chrome`'s scope is NOT extended to tooltips. A new token, `--blur-glass`, is minted at 12px with a legal scope of tooltips only. The blur law now has three tokens, three scopes, no cross-borrowing: `--blur-chrome` (sticky nav), `--blur-panel` (overlay panels, 2px), `--blur-glass` (tooltips, 12px, new). `app/theme.css`'s "never a floating panel" comment on `--blur-chrome` stays true and unmodified; tooltips get their own name instead of an exception carved into `--blur-chrome`'s law.

**Contract impact:** none structural.

**Propagation targets:** `app/theme.css` (`--chrome-wash` candidate, `--blur-glass` new token), `Editor.view.jsx` (sticky nav, mobile save row), tooltip component once built (CR-047, now with a named blur token to build against).

## DD-13, Saved state: synchronized P2 morph, sage success hue

**Family:** cross-cutting (save affordance). Closes CR-051 and the ED1E law-gap escalation (`docs/plans/ED1E-EDITOR-DESIGN-STANDARD.md` section 10).

**Ruling basis:** Brian, direct ruling, 21 Aug 2026, device ruling. Exhibit: `explorations/gate2/Device Ruling - Saved State.html` (P1 to P3 at both widths).

**The change:** on save, the pill and the Save button resolve together
in one synchronized morph beat (P2), not staggered. The success hue,
across this and every other status-success use, becomes a warm sage,
replacing the green-check-on-brown treatment the contrast law already
flagged as blocked.

**Checkable conditions:**
- The saved-state pill and the Save button's own state both change on the same animation beat, no visible lag between them.
- Every status-success use (not only the saved pill) renders the new sage value, not the prior `#7D9B6A`.

**Token mapping:**
- `--status-success` revised value: `oklch(.76 .08 135)`. This is a revision to an EXISTING locked token's literal value (`#7D9B6A` today), not a new candidate. Per the amendment law this needs the standard token-update path in `app/theme.css`, converting the OKLCH value to the project's sRGB hex convention before it enters the file.
- Synchronized-morph timing: no new duration token implied by the ruling as recorded; if a specific ms value was set in the exhibit's own animation, it is an implementation detail of `Editor.view.jsx`'s save-state component, not a token candidate here.

**Contract impact:** none structural.

**Propagation targets:** `app/theme.css` (`--status-success` value update), every consumer of `--status-success` (status chips, saved-state pill, `docs/DESIGN-TOKENS.md`'s contrast-law entry for status colors, which this ruling closes).

## DD-14, Increment bloom pattern: approved as a device, rejected for save

**Family:** cross-cutting motion device. Updates CR-050.

**Ruling basis:** Brian, direct ruling, 21 Aug 2026, device ruling. Exhibit: `explorations/gate2/Device Ruling - Mobile Save - Bloom.html`.

**The change:** the "+1" increment-bloom pattern is ratified as a
reusable device, reserved for values that genuinely increment (coins
earned, completion counts, progression). Its placement on the Save
action is rejected: a save is not a score, and save feedback stays the
saved-state treatment (DD-13) only, with no bloom.

**Checkable conditions:**
- No increment-bloom animation appears anywhere in the save flow.
- Any future use of the increment-bloom pattern is on a genuinely incrementing value (a counter, a coin balance, a completion count), never a binary or state-change action like save.

**Token mapping:** none named in the ruling as recorded (the pattern is
approved at the device level, not yet given a duration/easing token).
Flag for a follow-up sitting if and when a real incrementing surface
adopts it (e.g. the StudioEconomyWidget, itself still open per DD-15).

**Contract impact:** none; this rules out a save-flow behavior rather than adding one.

**Propagation targets:** none for this pass (no shipped surface currently has a qualifying incrementing value); CR-050 stays open, narrowed to future placement only.

## DD-15, Sidebar batch: all six kept

**Family:** cross-cutting (`StudioSidebar`). Closes five of six items in CR-052; the sixth (economy fixture) stays open.

**Ruling basis:** Brian, direct ruling, 21 Aug 2026, device ruling, batch B ("proposed") kept wholesale over batch A ("shipped"). Exhibit: `explorations/gate2/Device Ruling - Sidebar Batch.html`.

**The change:** all six sidebar deviations surfaced during Gate 1's
ground-truth review are ruled intentional and propagate as designed,
not corrected back to shipped behavior:

1. Ink lift: a brighter overall ink value across sidebar text than shipped `--ink-dim`/`--ink-faint` produce today. RULED IN.
2. Top-bar wash: a background treatment on the top bar, absent from shipped `StudioTopBar.view.jsx` today. RULED IN.
3. Legacy section hidden entirely (not merely collapsed). RULED IN; still needs the contract-level decision CR-052 named (a `StudioSidebar` prop, versus the Binding Shell simply not passing legacy data), not resolved by this ruling alone.
4. Community Links disclosure removed. RULED IN as a deliberate removal, not an omission.
5. Footer re-order: the signed-in footer's internal ordering changes from the shipped recipe. RULED IN.
6. Economy fixture: **STILL FLAGGED, not ruled by this pass.** Whether `StudioEconomyWidget` stays the honest out-of-scope stub (`.design-sync/shims/EconomySlotStub.jsx`) or gets fixture-fed real data is still pending the ground-truth scope decision noted in `explorations/HANDOFF.md`.

**Checkable conditions:**
- Sidebar text ink values match the exploration's brighter step, not shipped `--ink-dim`/`--ink-faint`, once a token exists for it (see below).
- `StudioTopBar` carries the wash treatment shown in the exploration.
- The Legacy disclosure does not render at all (not collapsed, absent).
- No Community Links disclosure renders.
- The signed-in footer's item order matches the exploration render.
- The economy widget's data source is NOT changed by this ruling; it remains open.

**Token mapping:** the "ink lift" step has no named token yet; if it is
a genuinely new ink value distinct from `--ink`/`--ink-dim`/`--ink-faint`,
it needs its own candidate, not a silent reuse of `--ink`. Flag for the
propagation pass to pin the exact exploration value against
`app/theme.css`'s ink ramp.

**Contract impact:** item 3 (Legacy hidden) is a real contract-level decision per CR-052, not propagation-only; needs its own ruling on the mechanism (prop vs. data omission) before it ships.

**Propagation targets:** `StudioSidebar.view.jsx` (ink values, Legacy removal, Community Links removal, footer order), `StudioTopBar.view.jsx` (wash treatment), `ground-truth/GROUND-TRUTH.md` (update once shipped to match).

## DD-16, Field bed sizing and deep-bed shadow ratified

**Family:** field grammar, depends on and resolves part of DD-03. Advances CR-053.

**Ruling basis:** Brian, ratified token table, 21 Aug 2026, Gate 2 close ("TOKEN LAW" rows 1 and 8).

**The change:** field bed typed and placeholder text is set at a named
size/leading pair, distinct from every existing type-scale step. The
deep bed background and its inset shadow, both flagged by DD-03 as
unresolved (the shadow explicitly as a law conflict), are now ratified
with names and exact values.

**Checkable conditions:**
- Field bed text (typed and placeholder) renders at the new `--text-input` / `--lh-input` pair, not `--text-ui` or `--text-body`.
- Field bed background is `--bed-deep`, matching DD-03's `#0d0b08` exactly.
- Field bed shadow is `--shadow-bed`, an inset shadow, not a border-only edge.

**Token mapping:**
- `--text-input`: 14px. **TOKEN CANDIDATE**, genuinely new: `--text-ui` is 13px (`0.8125rem`), `--text-body` is 16px (`1rem`); 14px sits between both and matches neither.
- `--lh-input`: 22px. **TOKEN CANDIDATE**, genuinely new: `--lh-ui` is 20px, `--lh-body` is 24px; 22px sits between both.
- `--bed-deep`: `#0d0b08`. Confirms DD-03's candidate exactly; ratified with this name.
- `--shadow-bed`: `inset 0 1px 2px rgba(0,0,0,.25)`. Confirms DD-03's candidate exactly; ratified with this name.

**Contract impact:** none structural.

**Propagation targets:** `app/theme.css` (four new tokens), `SharedFields.jsx` (`FIELD_BED_CLASS`), `KitFormField.view.jsx` (input bed).

**Escalation carried forward, resolved in part:** DD-03 flagged the
inset shadow as a NEW DEVICE contradicting the standing elevation law
("in-flow surfaces separate by border only, never by shadow"). Ratifying
`--shadow-bed` as named law is the reconciling ruling DD-03 asked for,
but the elevation law's own text in `app/theme.css` (the ELEVATION
comment block) still needs an explicit amendment noting the field-bed
exception, not just a new token sitting beside unchanged prose that
contradicts it.

## DD-17, Typed ink and weight 300 ratified

**Family:** field grammar, resolves two DD-03 candidates. Advances CR-053.

**Ruling basis:** Brian, ratified token table, 21 Aug 2026, Gate 2 close ("TOKEN LAW" row 2).

**The change:** typed field values render in Inter weight 300 at a
softened ink value, both now named and entered into the font/ink
system rather than sitting as unresolved candidates.

**Checkable conditions:**
- Typed field text renders at font-weight 300.
- Typed field text ink is `--ink-typed`, not `--ink`, `--ink-dim`, or `--ink-faint`.
- Weight 300 is available in the font pipeline wherever Inter is loaded (not only inline in one exhibit).

**Token mapping:**
- `--ink-typed`: `#d9d3c6`. Confirms DD-03's candidate exactly; ratified with this name.
- Weight 300: no locked weight below `--weight-regular` (400) existed before this ruling (DD-03 flagged it as "never ruled before"). Ratified as a real weight now added to the font pipeline. Whether this needs its own `--weight-light` token alongside `--weight-regular`/`--weight-medium`/`--weight-bold`, or stays a literal 300 used only via `--ink-typed`'s paired declaration, is a naming decision for the propagation pass; DD-18 raises a second consumer of weight 300 (ghost button text) that bears on this same naming decision.

**Contract impact:** none structural.

**Propagation targets:** wherever `next/font` loads Inter (weight 300 must be requested), `SharedFields.jsx` / `KitFormField.view.jsx` (input bed).

## DD-18, Ghost fill and button weight recipe, CONFLICT RESOLVED

**Family:** cross-cutting (buttons, chips). Advances CR-053; the conflict this entry originally flagged is closed.

**Ruling basis:** Brian, ratified token table, 21 Aug 2026, Gate 2 close ("TOKEN LAW" rows 3 and 5).

**The change:** the 5%-opacity gold screen fill DD-07 named for ghost
buttons and interactive chips is ratified with a name. Separately, the
`.cf-btn` recipe is restated as primary weight 500, ghost weight 300.

**Checkable conditions:**
- Ghost buttons, trait chips, and quiet interactive surfaces at rest use `--fill-ghost`, not `--fill-whisper` or `--fill`.
- Primary CTA text renders at `--weight-medium` (500).
- Ghost button text renders at weight **300**, not `--weight-regular` (400).

**Token mapping:**
- `--fill-ghost`: `rgba(242,209,148,.05)`. Genuinely distinct from `--fill-whisper` (`rgba(242,209,148,.06)`) despite sitting only one point of alpha apart; do not treat these as interchangeable or as the same token under two names. Confirms and names DD-07's candidate.
- Primary weight 500: matches `--weight-medium` exactly, existing locked token, confirmed.
- Ghost weight 300: shares the same literal weight DD-17 added to the font pipeline for typed field text. Whether it gets its own `--weight-light` alias or stays a literal 300 referenced from both call sites is still a naming decision for the propagation pass; the VALUE is no longer in question.

**RESOLVED by Brian's conflict ruling, 22 Aug 2026:** Gate 1's own
ratified grammar (this file's DD-07, and the Gate 1 GATE-LOG's own
summary line) stated ghost button text weight is `--weight-regular`
(400). Gate 2's TOKEN LAW table, ratified in the same 21 Aug session,
stated the `.cf-btn` ghost recipe is weight 300. Brian's ruling: **300
governs.** Gate 2's ratification supersedes Gate 1's 400 outright.
DD-07 is amended in place to record this; no further reconciliation is
open on this value.

**Contract impact:** none structural.

**Propagation targets:** `app/design-system.css` (`.cf-btn` family; its base rule reads `--weight-bold` today, itself superseded by DD-07/this entry regardless of which ghost weight wins), `KitFilterChip.view.jsx`, `SharedFields.jsx` field-adjacent controls.

## DD-19, Editor control heights ratified

**Family:** cross-cutting (control sizing). Advances CR-053.

**Ruling basis:** Brian, ratified token table, 21 Aug 2026, Gate 2 close ("TOKEN LAW" row 4).

**The change:** DD-07's two desktop control heights (38 and 28) are
named as editor-scoped tokens; the 44px mobile thumb floor is
reaffirmed unchanged.

**Checkable conditions:**
- Editor CTA controls at the larger desktop step resolve to `--control-editor-md`.
- Editor CTA controls at the smaller desktop step resolve to `--control-editor-sm`.
- Any of these controls reachable by touch on mobile still resolves to 44px (`--control-md`), unchanged.

**Token mapping:**
- `--control-editor-md`: 38px. Matches `--control-filter` (`2.375rem`) exactly. Confirms DD-07's citation; this is an editor-scoped alias name for the same locked value, not a second, competing token at the same size. Propagation should alias, not duplicate.
- `--control-editor-sm`: 28px. **TOKEN CANDIDATE**, genuinely new: no existing control token below `--control-sm` (32px) matches. Ratified with this name.

**Contract impact:** none structural; a control at the new 28px step may need a `size` prop added where none exists today, per DD-07's own flag.

**Propagation targets:** `app/design-system.css` (`.cf-btn` family), any editor-scoped control component consuming these heights.

## DD-20, Card, hero, and rail gradients, rail split out

**Family:** page-level surfaces, extends DD-08. Advances CR-053.

**Ruling basis:** Brian, ratified token table, 21 Aug 2026, Gate 2 close ("TOKEN LAW" row 7).

**The change:** DD-08's single card/hero/rail gradient pair is
confirmed exactly for cards and the hero plate, and named
`--grad-card`. The rail gets its OWN distinct gradient, `--grad-rail`,
not the same pair. This narrows DD-08's original claim that all three
surfaces shared one family.

**Checkable conditions:**
- Section cards and the hero plate (DD-10) render the `--grad-card` gradient.
- The rail panel renders the separate `--grad-rail` gradient, visibly distinct from card/hero.

**Token mapping:**
- `--grad-card`: `#1a1610` to `#14110c`. Exact match to DD-08's candidate; ratified with this name, no change in value.
- `--grad-rail`: `#16130d` to `#100d09`. **TOKEN CANDIDATE**, genuinely new: neither hex matches any existing surface or gradient token in `app/theme.css`.

**Contract impact:** none structural.

**Propagation targets:** `app/theme.css` (both gradient pairs), `Editor.view.jsx` (hero, section box, rail surfaces).

## DD-21, Fading hairline ratified, scope broadened

**Family:** page-level surfaces, resolves a DD-08 candidate.

**Ruling basis:** Brian, ratified token table, 21 Aug 2026, Gate 2 close ("TOKEN LAW" row 9).

**The change:** DD-08's fading sidebar-separator hairline is ratified
with a name and used more broadly than originally scoped: sidebar
groups, card-header rules, and rail progress rules all now carry it,
not sidebar separators alone.

**Checkable conditions:**
- Sidebar group dividers fade out along their length, not a flat opacity.
- Card headers' own rule lines use the same fading treatment.
- Rail progress rules use the same fading treatment.

**Token mapping:**
- `--line-fade`: 1px, fading to a 13% gold peak. Distinct from `--line-whisper` (flat 3%), `--line` (flat 10%), and `--line-strong` (flat 20%); none of the three flat hairline tokens are a gradient, so this remains a genuinely new device as DD-08 flagged, now named.

**Contract impact:** none structural.

**Propagation targets:** `app/theme.css` (new token), `StudioSidebar.view.jsx` (separators), `Editor.view.jsx` (card headers, rail progress rules).

## DD-22, Chrome wash and panel glass named; focus ring superseded by DD-04

**Family:** cross-cutting chrome and focus, extends DD-04 and DD-12.

**Ruling basis:** Brian, ratified token table, 21 Aug 2026, Gate 2 close ("TOKEN LAW" rows 10, 11, and 12); the focus portion (row 12) is SUPERSEDED by Brian's conflict ruling, 22 Aug 2026, see DD-04.

**The change:** the chrome-wash and glass-panel background values DD-12
left as candidates are named. The focus glow this pass originally
named `--focus-ring-editor`, scoped to the editor, is NOT shipped
under that name: Brian's 22 Aug ruling makes the same gold-ornament
recipe the single global `--focus-ring`, so a second, editor-scoped
focus token would contradict "one focus language, not two." The
recipe itself survives and propagates, under the global name; see
DD-04 for the closing ruling and the exact revised `--focus-ring`
value.

**Checkable conditions:**
- Sticky chrome and the mobile save row (DD-11, DD-12) use `--chrome-wash` as their background.
- Glass-style floating panels use `--panel-glass` as their background, paired with `--blur-panel`.
- No `--focus-ring-editor` token exists anywhere in the codebase; focused surfaces everywhere, including field beds, resolve through `--focus-ring` (see DD-04).

**Token mapping:**
- `--chrome-wash`: `rgba(6,4,2,.62)`. Confirms DD-12's candidate exactly; ratified with this name.
- `--panel-glass`: `rgba(36,32,25,.85)`. **TOKEN CANDIDATE**, genuinely new: closest existing value is `--surface-4` (`#2c271e`, i.e. `rgb(44,39,30)`), which this does not match (different rgb triplet, and this one is a translucent overlay value, not a flat surface color).
- Focus recipe (border `--gold-ornament` plus glow `0 0 0 3px rgba(224,171,94,.10)`): retired as a candidate named `--focus-ring-editor` in this entry; carried forward instead as the revised value of the global `--focus-ring` token. See DD-04's token mapping for the full note on the two different golds layered in that recipe.

**Contract impact:** none structural.

**Propagation targets:** `app/theme.css` (`--chrome-wash`, `--panel-glass`; `--focus-ring`'s value per DD-04, not a third token here), `Editor.view.jsx` (sticky nav, save row).

**Escalation CLOSED, 22 Aug 2026:** DD-04's four-way focus conflict
(global `--focus-ring`, kit-focus law, ED1E's quiet-field-ring, and
this gate's gold-ornament-glow recipe) is resolved by Brian's ruling:
the gold-ornament recipe wins, ships under the existing `--focus-ring`
name, and the other three are retired. See DD-04 for the full closing
note and the propagation-wide contrast-verification requirement that
comes with it.

## Summary: Gate 2 and device-ruling additions

Candidates from the Gate 1 summary list above now ratified with names
(DD-16 through DD-22): items 2, 3, 4, 5 (in part, see the DD-18
conflict), 9, 10, 12, 13, 14.

New token candidates raised by Gate 2 and the device rulings (not yet
in `app/theme.css`):

15. Field input text size and leading, `--text-input` 14px / `--lh-input` 22px (DD-16).
16. Editor-scoped small control height, `--control-editor-sm` 28px, alias of DD-07's candidate 12 (DD-19).
17. Rail-specific gradient, `--grad-rail`, `#16130d` to `#100d09`, split from the card/hero gradient (DD-20).
18. Chrome wash, `--chrome-wash`, `rgba(6,4,2,.62)` (DD-12, DD-22).
19. Glass panel background, `--panel-glass`, `rgba(36,32,25,.85)` (DD-22).
20. Tooltip blur, `--blur-glass` = 12px, legal scope tooltips only, RATIFIED not a candidate (DD-12, Brian's 22 Aug conflict ruling). Completes the three-token blur law: `--blur-chrome` (sticky nav), `--blur-panel` (overlay panels, 2px), `--blur-glass` (tooltips).

Two existing locked tokens flagged for a REVISED value, not a new
candidate:

- `--status-success`, from `#7D9B6A` to `oklch(.76 .08 135)` (DD-13, closes CR-051).
- `--focus-ring`, from the two-ring box-shadow recipe (`0 0 0 2px var(--canvas), 0 0 0 4px var(--gold-ornament)`) to the gold-ornament-border-plus-glow recipe (DD-04, Brian's 22 Aug conflict ruling, closes the four-way focus conflict).

One value resolved without a new token name: ghost button text weight
is **300**, not the `--weight-regular` (400) this file originally
ratified in DD-07; Gate 2's ratification supersedes Gate 1's, per
Brian's 22 Aug ruling (DD-07, DD-18).

Escalations closed by Brian's conflict ruling, 22 Aug 2026:

- **DD-04's four-way focus conflict**, CLOSED: the gold-ornament recipe becomes the single global `--focus-ring`, kit-focus and ED1E's quiet-field-ring retire. Propagation must contrast-verify the new recipe on buttons, chips, nav rows, and cards, not only field beds.
- **DD-18's ghost-button weight conflict**, CLOSED: 300 governs, DD-07 amended.
- **DD-12's tooltip-blur scope**, CLOSED: `--blur-glass` minted at 12px, tooltips only, no borrowing from `--blur-chrome`.

Escalations still open at the close of this capture pass:

- **DD-16's elevation-law text:** `--shadow-bed` is now named law, but `app/theme.css`'s ELEVATION comment block still reads as a blanket border-only rule with no stated field-bed exception.
- **DD-15 item 3 (Legacy section hidden):** still needs its own contract-level mechanism decision (prop vs. data omission), not just a keep/revert call.
- **DD-15 item 6 (economy fixture):** still open, pending the StudioEconomyWidget ground-truth scope decision.
- **CR-050 (increment bloom):** narrowed to future placement only; no shipped surface adopts it in this pass.
