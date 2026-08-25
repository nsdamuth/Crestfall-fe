# ED1E: Advanced Editor Design Standard

Written 16 Aug 2026 on `design/ed1e-editor-design`, cut from trunk
`ad8e586`. This is the field-and-section standard for the advanced
editor family. It was produced by a design-only pass: no production
component changed, no contract bumped, no feature added. A later
propagation pass (Sonnet, per section 11) applies it.

Status: DRAFT until Brian rules on the two gates in section 9 and the
law escalations in section 10. Cells marked BLOCKED-ON-RULING do not
close with this document.

Renders for Brian: `/dev/ui-preview/ed1e-editor-design` (live route,
dev only) and the screenshots in `docs/review-artifacts/ed1e/`.
Diagnosis evidence: `ed1e-diag-*.png` in the same folder.

## 1. Scope and authority

Governs the `/studio/v2/editor` and `/studio/v2/editor/[id]` pages and
every section family they mount, including the modals reached from
them. Supersedes, for these pages, the legacy field recipes in
`components/ui/CrestfallSelect.jsx`, the `TraitModal` family trigger
recipe, and every hand-rolled panel inside section content. It does
not restyle the legacy `/studio/my-creations/[id]/edit` route.

`docs/plans/ED1B-EDITOR-PAGE-SPEC.md` remains the page architecture
law (hero, accordion, rail, contract 4.0.0). This document is the
surface-quality law layered on top of it. Where the two disagree on a
visual value, this document wins.

## 2. Defect catalogue (Phase 1 diagnosis, 16 Aug 2026)

Rendered at 390x844 (emulate, dpr 2, mobile, touch) then 1440, against
the filled ED1d fixture `mock-editor-character-template-default`.
Evidence files are `docs/review-artifacts/ed1e/ed1e-diag-<name>.png`.

| # | Defect | Evidence | Cause | Fixed by |
|---|---|---|---|---|
| D1 | Three field grammars in one box: faint 11px labels (SharedFields), gold wide-tracked labels on off-token beds (CrestfallSelect), and bordered trigger panels with the label inside the bed (TraitModal) | 390-identity-defaults-open, 1440-identity-defaults-open | Character Template sections never adopted SharedFields; legacy controls survived ED1c | Sections 4, 5 |
| D2 | Bordered boxes nested up to three deep (section box, Personality Frameworks panel, trait triggers) | 390-behavior-defaults-open-1 | Legacy panel recipe | Section 5 |
| D3 | Danger Zone renders two red-washed bordered billboards at rest, serif titles at display size, raw `red-*` classes, status color as decoration | 390-danger-zone-open, 1440-danger-zone-open | Legacy DangerSection recipe | Section 5.4 |
| D4 | Value or panel type outranks the box header: inner "Template Operations" serif header larger than the "Publishing" box header | 390-publishing-open | Legacy ActionPanel-style header stack | Sections 3, 5 |
| D5 | Folding long field clips its second line in half at rest AND stays clipped when focused; expansion on focus does not happen | 390-overview-open, 390-textarea-focused-expanded | Folding TextAreaField expands on user click focus only in some flows; collapsed height slices a line mid-glyph | Section 4.3 |
| D6 | Single-line inputs clip their value mid-letter with no ellipsis or fade | 390-overview-open, 390-template-info-open | Plain input overflow | Section 4.2 |
| D7 | Fixture value exceeds its own limit and the at-limit counter renders permanently in danger red at 11px on a mid surface (blocked contrast zone) | 390-body-defaults-open | Counter law (O4) collides with the contrast block; fixture over-limit | Sections 4.3, 10 |
| D8 | Read-only fields indistinguishable from editable fields; raw data-layer value `CHARACTER_TEMPLATE` surfaces in the UI | 390-template-info-open | ReadOnlyField uses the same bed; terminology map not applied | Section 4.6, follow-up F2 |
| D9 | Empty trait values ("Not chosen") render at the same brightness as filled values | 390-body-defaults-open | Trigger panel has no empty-state ink tier | Section 4.5 |
| D10 | Hero: active thumb duplicates the primary art beside it; three empty slots render broken-image icons in tall gray wells; the art column is dwarfed by dead space | 390-hero-rest, 1440-hero-and-page | EditorHeader slot rail renders every slot including empties, vertically | Section 6, Gate 2 |
| D11 | Hero actions are three ragged-width gold buttons stacked left-aligned | 390-hero-rest | Unseated CTA row | Section 6 |
| D12 | Rail: save block and switcher scroll away inside the rail's own scrollbar at laptop heights; the ruled always-visible save state is defeated | 1440x700-rail-inner-scroll | Rail carries `max-h` + `overflow-y-auto` | Section 7 |
| D13 | Rail: category labels and item rows differ only by letter case; hover and active are near-identical washes | 1440-hero-and-page, 390-sections-sheet | Same label recipe both tiers; hover `--fill-whisper` vs active `--fill` | Section 7 |
| D14 | Rail: dirty dot floats detached at the far rail edge, orphaned from its row | 1440-rail-dirty | Mark column right-aligned across an invisible row | Section 7 |
| D15 | Rail: save block sits on a darker bed than the boxes beside it; switcher is the page's only strong-border control | 1440-rail-dirty | Mixed surface tiers | Section 7 |
| D16 | Trait modal: hand-rolled near-black panel off the modal system, banned purple-to-cyan gradient swatch, heavy double gold border on the custom input, giant pill swatches, bottom edge clips helper and counter | 390-trait-modal-skin-tone, 1440-trait-modal | TraitModal family bypasses KitModalFrame and tokens | Sections 4, 8 |
| D17 | Featured image picker fires a live fetch in fixture mode and renders the raw error word "Unauthorized" | 390-featured-image-picker | Fixture-first law not applied to the picker load path | Follow-up F3 |
| D18 | Mobile sections sheet: titleless empty header band; save block is an inner box; category and item rows blur together | 390-sections-sheet | Sheet reuses rail internals unstyled | Section 7.3 |
| D19 | Disabled controls ("Preview Soon", "Duplicate Template Soon") read as enabled gold buttons with the word Soon baked into the label | 390-overview-open, 390-publishing-open | No composed disabled recipe exists in law | Sections 4.7, 10 |
| D20 | Off-token values across the family: `max-w-5xl` page container, 264px rail, raw `p-5`/`mt-6`, skeleton `h-64`, `bg-[#080706]`, `shadow-2xl`, raw `red-*` | grep evidence in section 11 | Legacy code predates token law | Section 11 sweep |
| D21 | Counter formats disagree: `73/600` vs `15 / 240` | 390-textarea-focused-expanded, 390-trait-modal-skin-tone | Two counter implementations | Section 4.3 |
| D22 | Native selects: 30 instances recorded in the mechanics-modules subtree (off the exemplar path, illegal on this page by ED1C 3.7). Corrected count at the ED1G review: the subtree actually carried 47 before SW4/SW5/SW6 ran; as of this ED1G burn-down (SW11), SW4 has landed the conversion and only 2 native selects remain, both in `MechanicsCommandDomainActions.view.jsx` | grep evidence | Legacy mechanics views | Section 11 audit item |

## 3. Type hierarchy

One ladder for the whole editor. Nothing may outrank its parent tier.
Weights stop at 500. All values are existing locked tokens.

| Tier | Element | Recipe |
|---|---|---|
| 1 | Page title (hero) | `font-display`, `--text-title-m` to `--text-title`, `--ink` |
| 2 | Type eyebrow (hero, above title) | `--text-eyebrow` / `--lh-eyebrow` / `--track-eyebrow`, uppercase, `--gold-ornament`, trailing `--grad-rule` mark |
| 3 | Section box header | `font-display`, `--text-lead` / `--lh-lead`, `--ink` |
| 4 | Group label (section stack and rail) | `--text-label` / `--lh-label`, uppercase, `--track-label`, `--gold-ornament`, trailing `--grad-rule` mark |
| 5 | Field label | `--text-label` / `--lh-label`, uppercase, `--track-label`, `--ink-faint` (Gate 1 variant may change the color, nothing else) |
| 6 | Field value | `--text-body` / `--lh-body`, weight 400, `--ink`; entered value never bold, never display family |
| 7 | Helper text | `--text-ui` / `--lh-ui`, `--ink-dim` (size assignment proposed to law, section 10) |
| 8 | Counter and meta | `--text-label` / `--lh-label`, `--ink-faint` on `--surface-1` and `--surface-2`, `--ink-dim` on `--surface-3` and `--surface-4`, `tabular-nums` |

Rules:
- The section box header is the ONLY header inside a box. No section
  renders an internal eyebrow, title, or description stack (ED1C 3.6
  chrome suppression stands; internal panels lose their headers too).
- Sub-group headers inside a box use tier 4, never a display size.
- No `text-lg` or larger inside section content for values or entry
  titles. Registry and mechanics entry titles use tier 6 with `--ink`
  and, where a title must stand out, `--text-lead` maximum (tier 3),
  never `text-2xl` and up.
- The middot is the house separator in meta rows, used sparingly.

## 4. Field standard

Every field is: label row, bed, helper line, in that order, spaced
`--space-1` label to bed and `--space-2` bed to helper. Fields stack
at `--space-4`; two-column pairing from `sm:` uses the existing
`FieldPair` grid recipe. All beds: `--radius-md`, `min-h` `--control-md`,
`bg-[var(--surface-1)]`, border `--line-whisper`, hover border `--line`,
focus per the global `--focus-ring`, text `--text-body` `--ink`,
placeholder `--ink-faint`. Never a heavy or doubled border in any
state. Superseded 22 Aug 2026 (A3): the quiet field ring (1px
`--gold-action`, the `cf-field` recipe) named above is RETIRED; the
global `--focus-ring` is the only focus mechanism, including inside
dense modal field grids.

### 4.1 Label row
Label left (tier 5). Counter right (tier 8), same baseline, present
only per 4.3. Required marker: the word "Required" in tier 8 ink, not
an asterisk alone.

### 4.2 Short text and number
Single line. Overflowing value fades out at the right edge (mask or
ellipsis); never a mid-letter hard clip (D6). Number fields align
right, `tabular-nums`, and carry unit words in helper text, not inside
the bed.

### 4.3 Long prose (folding)
- Rest, filled: exactly ONE line of preview at `--control-md` height,
  ellipsized. Never a partial second line (D5). A fold glyph sits at
  the right edge of the bed.
- Rest, empty: same height, placeholder in `--ink-faint`.
- Focus or tap: expands to fit content up to 320px, then scrolls
  internally. Expansion happens on focus from ANY path (pointer,
  keyboard, programmatic).
- Counter: hidden at rest; appears on focus and whenever value length
  is at or past 80% of the limit (ruling O4). Format is `{n}/{max}`
  with no spaces (D21). At the limit it turns `--status-danger` plus
  the word "limit". BLOCKED-ON-RULING: danger at counter size sits in
  the blocked contrast zone on `--surface-2`; see section 10.
- A value seeded over its limit renders the over-limit counter and
  blocks save with plain words; it never truncates silently (D7).
- JSON document textareas stay exempt from folding (CC1), render mono,
  and are the only fields allowed taller resting heights.

### 4.4 Select (branded dropdown)
`SharedFields.SelectField` grammar everywhere: label row + `--control-md`
trigger bed with chevron; popover at 700px and up, sheet below
(KitDropdown). Selected row: leading check, `--gold-bright` text.
Disabled rows read "Soon". Native selects are illegal on this page.
The legacy CrestfallSelect recipe is retired on this page (D1).

### 4.5 Picker field (modal-backed traits)
The TraitModal trigger stops being a panel and becomes a FIELD (D1,
D2, D9): label row above, standard bed, value inside the bed, and a
right-edge affordance glyph distinct from the select chevron (a small
"opens a dialog" mark). Empty state shows placeholder ink ("Not
chosen" in `--ink-faint`), filled state shows `--ink`. Multi-value
picker fields render their values as a middot-separated line, not
chips, when read back in the bed.

### 4.6 Read-only and display fields
No bed. Label row plus value as plain text in `--ink-dim` (D8). A bed
means editable; absence of a bed means read-only. Display values
always pass through the terminology map; a raw enum constant on
screen is a defect (follow-up F2).

### 4.7 Disabled
Whole control at `--state-disabled-opacity` (0.5), bed border stays
`--line-whisper`, no hover response, `cursor-not-allowed`. The word
"Soon" moves out of the button label into a tier 8 meta word beside
the control (D19). PROPOSED to law as the composed disabled recipe
(section 10).

### 4.8 Error (field-level)
BLOCKED-ON-RULING: no field-level error law exists. Proposed recipe,
rendered in the specimen sheet for the ruling: bed border
`--status-danger-border`, one plain-language line below the helper in
`--status-danger` with a leading dot mark, never a filled red bed,
never a second border. Ships only after the section 10 rulings.

### 4.9 Toggle
Pill track (`--radius-full`, the icon-control exception), thumb
`--control-sm` scale, on state `--gold-action` track with `--tag-fill-ink`
thumb, off state `--surface-1` track with `--line` border. The state
word ("On"/"Off" or the field-specific pair) always renders beside the
track in tier 7 ink. No color-only state.

## 5. Surface standard (nesting without boxes)

- ONE bordered depth inside the page column: the section box
  (`--radius-lg`, `--surface-2`, border `--line-whisper` closed,
  `--line` open). Field beds on `--surface-1` are part of the field
  anatomy, not a second panel depth.
- Inside a box, NOTHING else carries a border or its own background
  panel. Sub-grouping uses, in order of strength: field spacing
  (`--space-4`), a tier 4 group label, an inset hairline
  (`border-t border-[var(--line-whisper)]` starting `--space-4` after
  the previous run, padded `--space-4` below, inset from both box
  edges like the creator-stops rule).
- The Personality Frameworks panel (D2) becomes: inset hairline, tier
  4 label "Optional frameworks", one tier 7 helper line, then its
  three picker fields in the normal field grid.
- Publishing's "Template Operations" (D4) becomes: inset hairline,
  tier 4 label, one helper line, seated action row.
- Box body padding: `px-[var(--space-5)] pt-[var(--space-4)]
  pb-[var(--space-6)]`; the body owns its top padding (today the
  child's raw `mt-6` does).
- Action rows inside boxes are seated: buttons left-aligned in one row
  with `--space-3` gaps, wrap at 390 to full-width stacked; a
  destructive action never changes size or shape.

### 5.4 Danger Zone (D3)
At rest: two quiet rows, each a ghost button with `--status-danger`
TEXT beside a one-line tier 7 description. No red bed, no red border,
no icon parade, no serif display titles. Arming: the row swaps in
place to a confirm pair; the confirming button is the only filled
danger surface, standard button size. Raw `red-*` classes are retired
for `--status-danger` and its `-bed`/`-border` primitives, used only
inside the armed confirm state.

## 6. Hero standard

Pre-carried baseline (Gate 2 decides the architecture; these rules
hold in every variant):
- Slot rail shows FILLED slots plus exactly one add tile; empty slots
  never render broken-image wells (D10). The active slot is marked on
  the thumb; the primary art never appears twice at the same size
  ratio confusion (the thumb strip reads as a filmstrip under or
  beside the art, not a second copy column).
- Actions consolidate into one seated row (D11): Replace image,
  Generate more, Image library as equal secondary buttons; at 390 they
  become one full-width row each with equal width.
- Visibility chip: KitBadge, Canon wins. Set-default-PC action stays
  in the actions seat.
- Identity block: tier 2 eyebrow, tier 1 title, chip and meta on one
  middot row.

## 7. Sticky rail standard

- The rail never scrolls inside itself (D12). No `max-h`, no
  `overflow-y-auto`. Sticky offset stays below the top bar. Row
  heights compress on fine pointers (`--control-sm`) so a 12-item ToC
  plus blocks fits a 700px working viewport; if content still exceeds
  the viewport the tail is reached by the page scroll at the stack
  end, never by an inner scrollbar.
- Order top to bottom: save block, switcher, ToC. The save block is
  first so the ruled always-visible save state survives (D12).
- Save block: `--surface-2` bed matching the boxes (D15), border
  `--line-whisper`, `--radius-md`. Clean: quiet check + "All changes
  saved" in `--ink-dim`. Dirty: "Unsaved changes" + Save (primary) +
  Discard (secondary). Saving: spinner + "Saving". Error: plain words,
  BLOCKED-ON-RULING for the danger ink surface pairing (section 10).
- Switcher: standard secondary button recipe, not a strong-border
  outlier (D15).
- Category labels are tier 4 (gold, uppercase, grad-rule mark). Items
  are `--text-ui` `--ink-dim`, indented `--space-3` beyond the label,
  `--radius-sm` row (D13).
- States on separate channels (D13): rest `--ink-dim`, no bed; hover
  `--ink`, no bed; active `--gold-bright` on `--fill` bed. Hover never
  gets a bed; the bed means active.
- Marks sit inline `--space-2` after the item label (D14): dirty =
  6px `--gold-action` dot (sr text "unsaved changes"), saved =
  `--status-success` check (sr text "saved").

### 7.3 Mobile bar and sheet
- Bottom bar: `--surface-3`, top hairline, Sections trigger + save
  words always visible + Save when dirty (unchanged).
- Sheet (KitModalFrame sheet): gains a structural title "Sections"
  (D18); the save block and switcher follow the rail recipes; the ToC
  uses the same tiers, indents, and marks as the desktop rail.

## 8. Modal standard

- Every modal and picker composes KitModalFrame. Hand-rolled overlays
  (TraitModal family, D16) are retired on this page.
- Under 700px: maximized with internal thumb scrolling (R4). At 700px
  and up: centered, `--surface-4`, `--radius-lg`, `--line` border,
  `--shadow-modal`, max height 92dvh.
- Width tiers: STANDARD `max-w-2xl` for single-column content (trait
  pickers, confirms, option lists); LARGE `max-w-4xl` only when
  content is genuinely two-pane or media-grid (featured image picker,
  mechanics picker). Nothing wider. A modal picks the smallest tier
  that fits; "standard unless content genuinely needs more".
- Inside a modal: the same field standard as the page. Swatch grids
  use `--radius-md` tiles with the ChipRow selected recipe (border
  `--gold-action` + inset hairline + `--gold-bright` caption), not
  pills, not gradient fills. The banned purple-to-cyan gradient
  disappears; a custom-value swatch renders as a neutral
  `--surface-1` tile with the word "Custom".
- Modal content never clips its last row; the scroll region owns
  bottom padding `--space-6`.

## 9. Gates for Brian (sequenced, one at a time)

### Gate 1: field grammar (open, rule first)
Three full renders of the same editor page, same section open:
- A "Quiet" (RECOMMENDED): labels stay small, uppercase, and muted;
  gold appears only at section level and on active states. Reason:
  it matches the calm three-tier voice of the pages that already read
  correctly, it demotes values below their headers, and it is closest
  to the contracted kit, so propagation is cheapest and lowest-risk.
- B "Gilded": every field label is gold like the quick-create modals.
  Reason not: at 30 to 80 fields per editor the gold stops meaning
  anything, the page shimmers, and section landmarks drown; rework
  risk when it tires is high.
- C "Blended": muted labels, but the FOCUSED field's label turns gold.
  Reason not: labels that change color as focus moves read as state
  changes that are not there; it adds a second meaning to gold that
  collides with the selected-state law; costliest to specify.

### Gate 2: hero architecture (rule second)
Rendered in the Gate 1 recommendation:
- A "Side art, cleaned" (RECOMMENDED): art at the left, filmstrip of
  filled slots beneath it, identity and one seated action row beside
  it. Reason: keeps the working surface (sections) above the fold at
  both widths, smallest change from the ruled ED1C architecture,
  no over-art text so no contrast risk.
- B "Full-width banner": wide art band with identity overlaid at its
  base. Reason not: costs a full viewport at 390 before the first
  field, portrait art crops badly to a wide band, and over-art text
  invokes the art-ink constant rules for marginal gain.
- C "Backdrop hero": art as a blurred full-bleed backdrop behind the
  identity, sections start over it. Reason not: veils and blur layers
  push toward the glassmorphism the anti-slop list bans, and the
  backdrop competes with every field bed above it.

Everything else in this document is pre-carried per the recipes above
and visible in the exemplar render; none of it is an open choice.

## 10. Law-gap escalations (Brian rulings needed, with rendered evidence)

1. Status color at normal text size on `--surface-2/3/4` is blocked
   by the contrast matrix with no brighter ladder step to use. It
   traps: the at-limit counter (4.3), the rail save-error words (7),
   and any field-level error line (4.8). Options belong to Brian; the
   specimen sheet renders the trapped cells with captions. Until
   ruled, those cells are BLOCKED-ON-RULING.
2. Field-level error treatment has no law anywhere. Proposed recipe
   in 4.8, rendered in the specimen sheet.
3. Composed disabled recipe has no law (only the 0.5 opacity token).
   Proposed recipe in 4.7, rendered in the specimen sheet.
4. Helper text has no assigned size token. Proposed: `--text-ui` with
   `--ink-dim`, as rendered.
5. Proposed tokens: NONE. Every value in this standard resolves to an
   existing locked token. (The three proposals above are recipe
   assignments, not new tokens.)

## 11. Propagation checklist (for the Sonnet pass, after the gates close)

Order of work, one family per commit, each verified at 390 (emulate)
then 1440 with build exit 0:

1. `components/studio/my-creations/edit/sections/SharedFields.jsx`:
   fold clip fix, fade-out overflow, counter format, read-only bed
   removal, disabled recipe. (Contract 1.1.0 to 1.2.0, additive.)
2. `character-template-fields-section/` and `character-templates/`:
   retire CrestfallSelect and trigger-panel recipes for the 4.4/4.5
   grammars (D1, D2, D9).
3. `creation-overview-section/`: disabled Preview control (D19).
4. `creation-publishing-section/`: de-box panels, seat actions (D4).
5. `creation-danger-section/` (CreationDangerSection): 5.4 rewrite
   (D3).
6. Character sections (`character-identity/appearance/behavior`):
   same conversions as 2 (shared recipes).
7. `Editor.view.jsx` + `editor-header/`: rail 7, hero 6 (Gate 2
   result), container `--container`, tokened skeleton (D20). Editor
   contract 4.0.0 to 5.0.0 if slots change, else 4.1.0.
8. Trait modal family (`components/studio/create/character/trait/`
   and kin): KitModalFrame migration, swatch recipe, double-border
   removal (D16). Shared with quick-create; coordinate so the
   quick-create surfaces inherit the same fix.
9. Registry, wardrobe, location, room-template sections: type ladder
   (D20 sizes, tier 6 entry titles).
10. Mechanics subtree: native select audit (D22, 30 instances),
    display-size ladder, then the same field grammar.
11. `image-library/creation-featured-image-picker`: fixture-first
    load path (F3) with Nick if the data contract is touched.

Functional follow-ups discovered by this pass, NOT design work:
- F1: folding TextAreaField does not expand on programmatic focus
  (D5); fix in SharedFields with item 1.
- F2: terminology map not applied to read-only enum values (D8).
- F3: featured image picker fires a live fetch in fixture mode and
  surfaces a raw error string (D17).
- F4: fixture `body_notes` exceeds its own field limit (D7); either
  the limit or the fixture is wrong; decide with Nick.
- F5: SharedFields 1.1.0 and KitFormField 1.1.0 disagree on value
  size (16 vs 13px) and bed padding. This standard picks the
  SharedFields metrics for the editor; reconciling KitFormField is a
  separate contract decision outside the editor family.

## 12. Verification law for this pass

Renders checked at 390x844 via emulate (dpr 2, mobile, touch; resize
banned) then 1440. Production build exit 0 with the preview route
returning 404 in production. Zero em dashes in this document. The
finished-task report echoes the ED1e brief manifest part by part.
