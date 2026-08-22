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

## DD-04, Focus treatment

**Family:** field grammar, intersects the standing focus-law conflict.

**Ruling basis:** Brian, ratified Gate 1 spec list, 21 Aug 2026.

**The change:** on focus, the field bed border becomes `--gold-ornament` with a 10% glow (dimmed from the full action-gold treatment), and the label warms (shifts toward a brighter ink/gold value) on focus.

**Checkable conditions:**
- Focused field bed border color is `--gold-ornament`, not `--gold-action`.
- A glow effect accompanies the border at focus, distinct from the border itself.
- The label's ink value visibly shifts (warms) when its field is focused, and returns to `--ink-faint` on blur.

**Token mapping:**
- Border color `--gold-ornament` (`#C9A86A`): existing locked token, confirmed usage.
- "10% glow": not confirmed against an existing glow token (`--glow-hover`/`--glow-ambient` values not verified at exactly 10%). **Flag for verification, candidate if unmatched.**
- "Label warms" target ink value: **not specified** in the ratified spec beyond "warms"; needs a named token (likely `--gold-bright` or `--ink`) before this is checkable in code. **Flag as an open specification gap**, not a candidate yet.

**This is NOT a standalone new pattern, it is a fourth competing focus treatment on top of three already on file:** the global `--focus-ring` (documented as "the ONLY focus token, wired globally"), the kit-focus law (subtle `--line-strong` border brightening, no gold box), and ED1E's own quiet-field-ring recipe (`cf-field`, 1px `--gold-action`). This entry does not resolve that conflict; it adds a new candidate to it. **Escalate for a single reconciling ruling before propagation**, per the standing rule that a law conflict is a bug, never resolved locally.

**Contract impact:** none structural.

**Propagation targets:** `SharedFields.jsx`, `KitFormField.view.jsx`, `app/design-system.css` (once the focus-law conflict is reconciled).

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
