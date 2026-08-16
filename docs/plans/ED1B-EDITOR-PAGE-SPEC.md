# ED1B/ED1C: the advanced editor page, exact specification

Written 13 Aug 2026 (ED1B), revised 13 Aug 2026 (ED1C) after Brian's
render review of the ED1B build ruled NO with a precise experience
description. This document is the page law for `/studio/v2/editor`
and `/studio/v2/editor/[id]`; the ED1C revision supersedes the ED1B
layout sections in full. Rulings N1 (substance), N2 (substance), N5,
N6, N7 and O11 stand; Brian's 13 Aug ED1C direction governs
presentation.

## 1. What ED1B got wrong (the ED1C ruling, in shell terms)

1. The artwork was demoted to a header thumb; Brian wants it as the
   hero so switching creations immediately shows what is being
   worked on.
2. The page showed everything at once (open essentials plus
   expandable groups); Brian wants one section open at a time.
3. Save state lived in a bar that scrolls away contextually; Brian
   wants save state always visible, with per-section dirty marks.
4. Sections carried redundant internal chrome (eyebrow + title +
   description stacks, sharp rule lines) under the shell's own
   headers.
5. Native browser selects survived inside sections (Branching
   Policy and kin); fixture-mode Save fired a real mutation and
   errored; registry types rendered repeated side-by-side summary
   panels.

(The ED1/ED1B root-cause history, including the hasUsableCreation
fixture defect and its fix, is preserved in git history at the ED1B
revision of this file and in `editorSavedCreations.mock.js`'s own
comments.)

## 2. The design in one paragraph

One page, three parts. At the top, the artwork hero: the primary art
large, the other featured slots beside it, and the generate-more and
image-library actions, with the creation's type eyebrow, title, and
visibility chip beside the art. Below the hero, the sections: every
section is one distinct box with one clear header, quick-create
sections first, advanced groups after, and exactly one box open at a
time (accordion); opening happens from the box header or from the
table of contents. On desktop a sticky right rail carries the table
of contents plus the creation switcher, the Save and Discard
controls, and the save-state words, so save state is always visible
without scrolling; each ToC entry shows a subtle mark when its
section has unsaved edits and a check once saved. On mobile the rail
becomes a slim sticky bottom bar (Sections trigger + save state +
Save) opening a bottom sheet with the same contents. Every dropdown
is the branded kit dropdown, every popup composes the kit modal
frame, nothing clips, and in fixture mode Save persists to the mock
and reports success; the error state exists only for genuine live
failures.

## 3. Layout

The page renders inside StudioShell (sidebar + sticky top bar).
Content sits in a centered `max-w-5xl` container,
`px-[var(--space-4)]` at 390, `px-[var(--space-6)]` from sm. From lg
the container is a two-column grid:
`lg:grid-cols-[minmax(0,1fr)_264px]` with `gap-[var(--space-8)]`;
the left column holds the hero and the section boxes, the right
column is the rail. Below lg the rail column is absent.

### 3.1 Back link

Unchanged from ED1B: quiet ghost "Back" control, first element,
origin-aware (`?origin=` preserved, Vault fallback).

### 3.2 Artwork hero (editor-header package, contract 3.0.0)

Desktop (sm and up), one row, `gap-[var(--space-5)]`:

- Primary art: the ACTIVE featured slot's image, `w-[232px]`
  `aspect-[3/4]`, `rounded-[var(--radius-md)]`, `border
  border-[var(--line)]`, `object-cover`. No image: the same frame on
  `--surface-1` with a quiet type icon.
- Slot rail beside the art: the other featured slots as thumbs
  (`w-[64px] aspect-[3/4]`, `--radius-sm` nested-art exception),
  stacked vertically; tapping a thumb makes it the displayed
  primary (active slot); the active thumb carries the
  `--gold-action` selected border.
- Identity block, right, `min-w-0 flex-1`: type eyebrow
  (terminology map, the type identity surface), title
  (`font-display`, `--text-title` / `--text-title-m`), visibility
  chip (Canon wins), and the actions row:
  - "Replace image": opens the featured image picker (which
    composes KitModalFrame, 3.8) for the active slot.
  - "Generate more": routes to `/studio/v2/images` (the generation
    surface).
  - "Image library": routes to the existing
    `/studio/v2/editor/[id]/image-library` page.
  - The Set Default PC control (Player Character only) seats here.

At 390 (stacked): art `w-[148px]` with the slot rail beside it
(total row under ~230px tall), identity block below, actions as
full-width rows. The chat-media stub the old media panel carried is
not reproduced here (it was a disabled placeholder with a known
rendering defect; ED2/N5 own its future).

### 3.3 The rail (desktop, lg and up)

`sticky top-[calc(var(--topbar-h)+var(--space-4))]`, `self-start`,
one column, `gap-[var(--space-4)]`; quiet surface treatment (no
heavy card): sections separated by whitespace.

Top to bottom:

1. **Switch creation**: the switcher trigger (full-width secondary
   control). With unsaved changes it arms the inline confirm ("You
   have unsaved changes. Switch creations anyway?" Keep editing /
   Discard and switch) in place before opening the picker.
2. **Save block**, always visible:
   - Clean: quiet check + "All changes saved" (`--ink-dim`).
   - Dirty: "Unsaved changes" + Save (primary) + Discard (quiet).
   - Saving: spinner + "Saving...", Save disabled.
   - Save error: plain copy ("Your changes could not be saved.
     Please try again.") in `--status-danger` with its words, Save
     re-enabled.
3. **Table of contents**: for each group, a quiet uppercase group
   label; under it one row per section: section label, active
   section highlighted (`--gold-bright` text on `--fill` bed), and
   a right-aligned state mark: a small `--gold-action` dot when the
   section has unsaved edits (sr-only "unsaved changes"), a
   `--status-success` check once those edits are saved (sr-only
   "saved"). Untouched sections carry no mark. Rows are
   `min-h-[var(--control-md)]` targets. Clicking a row opens that
   section, closes every other, and scrolls it under the sticky
   chrome.

### 3.4 Section boxes, one open at a time

The left column below the hero renders every section of the type's
grammar in order: quick-create groups first, advanced groups after
(the ED1C page grammar is the ED1B grammar flattened; group labels
render as quiet uppercase separators between runs of boxes).

Each section is ONE box: `rounded-[var(--radius-lg)]` (full-width
surface tier), `border border-[var(--line-whisper)]`,
`bg-[var(--surface-2)]`, no overflow clipping ever (dropdown law
3.7). The box is its own disclosure:

- Header row (the only header): `min-h-[var(--control-lg)]`,
  `px-[var(--space-5)]`, section label in `font-display
  --text-lead`, the same dirty/saved mark as the ToC, and a
  chevron. Clicking it opens the box (closing the others) or closes
  it if already open.
- Open body: `px-[var(--space-5)] pb-[var(--space-6)]`, the
  section's component mounted as-is. Exactly one box is open at a
  time (zero is legal after closing).

Inside the boxes the legacy sections drop their redundant chrome:
the shared `SectionTitle` (SharedFields) renders nothing inside
this shell (context-driven, 3.6), and the five proven types'
hand-rolled header stacks are converted to the same suppression.
No section renders an internal eyebrow + title + description stack
or a sharp rule line under this shell; sub-groups open cleanly
inline; no nested scroll box may cut off content.

### 3.5 Mobile (below lg)

No rail. A slim sticky bottom control bar (docked bottom,
`--surface-3`, top hairline): "Sections" trigger, the save-state
words (always visible), and Save when dirty. It opens the bottom
sheet (KitModalFrame `variant="sheet"`, the O11 seat): switcher
first, then the save block, then the same ToC with the same marks.
Selecting a section closes the sheet, opens that box, scrolls to
it.

### 3.6 Section chrome suppression (SharedFields 1.1.0)

`SharedFields` exports an `EditorSectionChromeContext`; when a
provider sets `{ suppressSectionTitle: true }` (the v2 editor shell
does, around every mounted section), `SectionTitle` renders
nothing. Default (no provider): unchanged, so the legacy
`/studio/my-creations/[id]/edit` route and every other consumer
render exactly as before. Hand-rolled header stacks in the five
proven types' sections route through `SectionTitle` (or check the
same context) in this wave; remaining families convert in their
sweeps.

### 3.7 Dropdown and popup law

Native browser `<select>` is illegal on this page.
`SharedFields.SelectField` renders the branded kit dropdown
grammar (delegating to the KitFormField select variant, which
composes KitDropdown), so every SelectField consumer converts at
once; remaining raw `<select>` elements in the five proven types
(Branching Policy and kin) convert to `SelectField`. No ancestor of
a dropdown may clip its panel: section boxes and sub-groups never
set overflow hidden/auto around field content. Every popup and
picker reachable from this page composes KitModalFrame (the
featured image picker converts this wave).

### 3.8 Fixture save (the save defect)

In fixture mode (any id the mock resolver answers), Save NEVER
fires a live mutation. The ViewModel routes Save to the mock store:
saving state, then the current form persists into the mock overlay
(so Discard, remount, and switch-away-and-back rehydrate the saved
edits), the form reads clean, per-section dirty marks become saved
checks, and the save block shows the saved state. The live path for
real ids is unchanged, and the save error state exists only there.

### 3.9 Registry grammar

Registry-family section components render in the same single-column
section grammar as every other type inside their boxes; the
repeated per-section side-by-side summary panel collapses: the
persistent registry summary renders once (in the registry's first
section box), not once per section.

## 4. States, each with a fixture or preview override

| State | Behavior |
|---|---|
| Loaded, clean | Hero + boxes (all closed or first open, 5. below), rail shows "All changes saved". |
| Section dirty | Edited section carries the dot in ToC and on its box header; rail shows "Unsaved changes" + Save + Discard; mobile bar shows the same words. |
| Saving | Rail/bar spinner + "Saving...". |
| Saved (fixture) | Mock persisted; marks flip to checks; rail shows "All changes saved"; no live request fired. |
| Save error (live only) | Plain copy in the save block; never for fixture ids. |
| Switch confirm | Armed inline in the rail (and sheet) when dirty. |
| Load error | Unchanged from ED1B: friendly full-surface state, Try again + Pick another creation. |
| Loading | Skeleton: hero block + three box pulses. |
| Empty index | Unchanged: "Select a creation to edit" + picker CTA. |
| Accordion | Opening any box (header or ToC) closes the others. |
| Mobile 390 | Bottom bar + sheet; hero compact; single column; no horizontal overflow. |

Default open section: the first section of the first group opens on
load, so a couch-drafted creation's quick fields are immediately in
front of the person.

## 5. Proven types

Character, Story (ROOM_TEMPLATE), Location, NPC Registry, Lore,
through the picker path ids. Section CONTENT inside legacy packages
is not restyled beyond what this shell requires (chrome
suppression, dropdown law, registry collapse, no-clip); the family
sweeps own the rest.

## 6. Contracts

- Editor page 3.0.0 -> 4.0.0 (breaking): accordion single-open
  model (`openSectionId`, `onOpenSection`), ToC/rail props
  (`sectionMarks`, save-state props on the View), hero slot
  replaces `header`+`saveBar` slots, mobile bottom bar; the
  editor-save-bar slot is gone.
- editor-header 2.0.0 -> 3.0.0 (breaking): becomes the artwork
  hero (primary art + slot rail + identity + actions).
- editor-save-bar: RETIRED for this route (recorded in its README);
  save controls are rail/bar presentation owned by the page View.
- SharedFields 1.0.0 -> 1.1.0: EditorSectionChromeContext;
  SelectField renders the kit dropdown grammar. Prop shapes
  unchanged; every consumer outside the suppressing shell renders
  as before (SelectField visual change is this wave's intent).
- Touched legacy section packages: version bumps as needed, same
  commit as their fixtures.
- Read-only and untouched: `useCreationEditViewModel`,
  `useCreationEditShellViewModel`, `CreationEditSectionContent`
  dispatch, the legacy edit route.

## 7. Verification

Rendered at 390 (R3 emulate) then 1440 through the picker-path ids
for all five proven types, including a successful save (fixture
mode, no live request); no horizontal overflow, no clipped
dropdowns, zero console errors, no internal ids, no raw error
strings; production build exit 0; out-of-contract greps clean for
touched files; function-map rows in the closing commit;
`docs/ROADMAP.md`'s editor line stays unchecked (Brian's render
sitting still owed).
