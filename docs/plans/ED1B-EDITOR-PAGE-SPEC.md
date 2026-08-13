# ED1B: the advanced editor page, exact specification

Written 13 Aug 2026, wave ED1B (dedicated design and rebuild of one
surface after Brian's NO on the ED1 render). This document is the
page law for `/studio/v2/editor` and `/studio/v2/editor/[id]` until a
later ruling supersedes it. Brian's binding experience description
(13 Aug manifest, item 3) is designed to exactly; rulings N1, N2, N5,
N6, N7 and O11 stand ratified and bind; where N1's tab presentation
conflicts with the newer binding description, the description wins on
presentation and N1's substance (type-aware schema-as-data grouping,
at most five named groups per type, type identity in the header) is
retained in full.

## 1. Why ED1 missed (diagnosis, verified in code this session)

1. **Type identity never reached the render for fixtures.**
   `hasUsableCreation` (`edit/hooks/useCreationEditViewModel.js:51`)
   accepts a seeded creation only if it carries `ownerId`,
   `createdAt`, or `updatedAt` in some spelling. No editor fixture
   carried any of those fields, so every fixture failed the check,
   the form fell back to `createFallbackForm`, and that fallback
   hardcodes `type: "CHARACTER"`. A Story fixture therefore rendered
   with the Character label, Character groups, and Character tabs.
2. **The fixture harness fired a live query with a fixture id.** The
   same failed check made the hydration effect call
   `fetchOwnedCreation("mock-editor-...")` for every fixture id. The
   call fails (no such creation, no auth in the preview), the catch
   block writes the raw `error.message` into `saveMessage` and sets
   `saveStatus` to `error`.
3. **The save bar showed at rest.** Its visibility rule was
   `hasUnsavedChanges || saveStatus !== "idle"`. The load failure
   above set `saveStatus` to `error` with the page at rest, so the
   bar appeared on load carrying the raw developer error. A
   successful save also left `saveStatus` at `saved` forever, keeping
   the bar visible at rest.
4. **Internal ids rendered.** The chrome card printed "Editing ·
   Creation ID: mock-editor-character-default"
   (`Editor.view.jsx:221`).
5. **Two competing nav rows.** Group tabs and the in-group section
   pill row stacked inside a third bordered chrome card, above two
   more bordered body cards.
6. **Stacked floating modules.** Header card, save bar card, chrome
   card, media panel card, and section content card each carried
   their own border and surface, reading as five floating panels
   rather than one page.
7. **On phone the artwork pushed fields below the fold.** At widths
   under lg the media panel column stacked before the section
   content, so the full artwork module rendered before the first
   field.

## 2. The design in one paragraph

One scrolling document per creation, on the canvas, no stacked
panels. At the top: a compact identity header carrying the featured
artwork, the type eyebrow, the title, the visibility chip, and the
creation switcher beside the art; a quiet Back link above it. When
and only when something has changed, a contextual save bar docks
directly under the top bar and stays while scrolling. Below the
header, the fields the person filled in quick create render first,
open and editable. Below those, the advanced fields sit in named
collapsible groups, per type, at most five groups total including
the open essentials group; Artwork and Media is one of the groups on
visual types, Publishing with the danger zone is always last. A
Story's page and a Character's page differ in eyebrow, group names,
and fields. Errors speak plain sentences; no internal id ever
renders; at 390 the header art is a small thumb so the first field
is on screen within one short scroll.

## 3. Layout, top to bottom

The page renders inside StudioShell (sidebar + sticky StudioTopBar).
All editor content sits in ONE centered column: `max-w-3xl`
(768px), `px-[var(--space-4)]` at 390, `px-[var(--space-6)]` from
sm. Nothing in the column is a floating panel; regions separate by
one hairline rule (`border-[var(--line)]`) and whitespace, never by
nested bordered cards.

### 3.1 Back link

A quiet ghost control, first element in the column,
`min-h-[var(--control-md)]`, `--ink-dim` text with left arrow glyph,
label "Back". Returns to the origin surface (`?origin=` preserved,
Vault fallback), exactly the ED1 wiring. Top padding
`--space-4`.

### 3.2 Identity header (editor-header package, contract 2.0.0)

At 1440 (row layout, gap `--space-5`):

- Featured artwork, left: the creation's primary featured image,
  `w-[132px]` with `aspect-[3/4]`, `rounded-[var(--radius-md)]`,
  `border border-[var(--line)]`, `object-cover`. No image: same
  frame on `--surface-1` with a quiet type icon, no text label.
- Identity block, center, `min-w-0 flex-1`:
  - Type eyebrow: the display name from the terminology map,
    `--text-eyebrow` uppercase tracked, `--gold-ornament`. This is
    the type identity surface: a Story says STORY, a Character says
    CHARACTER, a Location says LOCATION.
  - Title: `font-display`, `--text-title` desktop and
    `--text-title-m` under sm, `--ink`, wraps up to two lines then
    truncates.
  - Meta row (`--space-2` above): visibility KitBadge (Canon wins
    over Private/Unlisted/Public), and the Set Default PC control
    (Player Character only) as a quiet secondary button.
- Switcher, right, beside the artwork block per the binding
  description: a bordered secondary control, `--control-md` height,
  label "Switch creation" with an up-down chevron glyph. When
  unsaved changes exist, activating it arms the inline confirm step
  (3.7) instead of opening the picker.

At 390 (stacked):

- Row one: artwork thumb `w-[72px] aspect-[3/4]` left, identity
  block right (eyebrow, title at `--text-title-m`, meta row).
  Header art is deliberately compact: total header height stays
  under ~200px so the first editable field is reachable within one
  short scroll.
- Row two (`--space-3` above, gap `--space-2`): "Switch creation"
  and "Sections" side by side, each `--control-md`, filling the row.
  "Sections" opens the O11 bottom sheet (3.8) and renders only
  below lg.

A single hairline rule (`border-b border-[var(--line)]`,
`--space-5` below the header content) closes the header band. The
header sits on the canvas: no card, no own surface.

### 3.3 Contextual save bar (editor-save-bar package, contract 2.0.0)

Visible when and only when there is something to act on or to read:
`hasUnsavedChanges` is true, or a save is in flight, or the last
save failed. It is HIDDEN at rest and hidden again after a
successful save (the bar disappearing is the confirmation; no
persistent "Saved" chrome). Docked `sticky top-[var(--topbar-h)]`
so it rides directly under the sticky top bar while scrolling,
z-above content. It is the one elevated surface on the page:
`--surface-3`, `border border-[var(--line)]`,
`rounded-[var(--radius-md)]`, `shadow-[var(--shadow-popover)]`.
Contents: status words left ("Unsaved changes", "Saving...", or the
plain-language save error), Discard (quiet secondary) and Save
(primary, gold) right. All copy is plain language supplied by the
ViewModel; the raw client `error.message` never reaches this
surface.

### 3.4 Essentials region (quick-create fields first)

Directly under the header rule. The first group of the type's ED1B
grammar (section 5) renders OPEN, without accordion chrome:

- Region heading: the group label (for example "Identity" on a
  Character, "Story" on a Story), `font-display --text-subhead`
  (`--text-subhead-m` under sm), `--ink`.
- Each section in the group renders in order: a section subhead row
  (section icon at `--icon-sm`, section label, `--text-ui` uppercase
  tracked `--track-label`, `--gold-ornament`), then the section's
  existing component, full width. Sections are separated by
  `--space-8`; the subhead row carries `--space-3` below itself.

These are the sections carrying the fields quick create collected
(name, concept, appearance for a Character; name and premise for a
Story; name, setting, and visual description for a Location), so
couch-created work is immediately refinable here without opening
anything.

### 3.5 Advanced groups (collapsible)

After the essentials region, each remaining group in the type's
grammar renders as a disclosure row on the page surface:

- Toggle row: full-width button, `min-h-[var(--control-lg)]`,
  separated from the previous region by `border-t
  border-[var(--line)]`. Left: group label in `font-display
  --text-lead` `--ink`, with a quiet count word beside it in
  `--text-label` `--ink-dim` ("3 sections"). Right: a chevron that
  rotates when open. `aria-expanded` set; the whole row is the hit
  target.
- Collapsed by default on every load. Open body: `pt-[var(--space-4)]
  pb-[var(--space-8)]`, sections rendered exactly as in 3.4 (subhead
  row + component, `--space-8` apart).
- The Artwork and Media group hosts the media panel component and
  the "Manage image library" link above any of its sections. It
  exists only on media-legal types (section 5, ruling N5).
- Publishing is always the last group and contains the publishing
  section (visibility, review, canon, with their existing confirm
  steps) and the danger zone. The danger zone renders nothing
  louder than its quiet ghost triggers until a confirm step is
  armed, per the destructive law.
- Wide section content (registry tables, module grids) wraps in its
  own `overflow-x-auto` container; the page never scrolls
  horizontally.

Each group anchors an element id (`editor-group-<id>`) so the O11
sheet can jump to it.

### 3.6 Spacing rhythm

Vertical rhythm in the column, top to bottom: `--space-4` page top
to Back; `--space-3` Back to header; `--space-5` header content to
its closing rule; `--space-5` rule to the essentials heading;
`--space-4` heading to first subhead; `--space-8` between sections;
`--space-6` essentials end to the first group toggle row; group
toggle rows abut (shared hairline); `--space-16` after the last
group to page end. The save bar, when present, carries
`--space-4` below itself. Horizontal: everything aligns to the one
column; nothing indents except section content's own internals.

### 3.7 Unsaved-changes switch confirm

Inline in the header, below the header rows, on `--surface-1` with
`--radius-md`: "You have unsaved changes. Switch creations anyway?"
with "Keep editing" (secondary) and "Discard and switch" (primary).
Arming it never opens the picker; confirming opens the picker.
Escape or Keep editing disarms.

### 3.8 O11 mobile sections sheet

Below lg only. "Sections" (header row two) opens a KitModalFrame
`variant="sheet"` listing every group with its sections. Tapping a
group or section closes the sheet, expands that group if collapsed,
and scrolls its anchor under the sticky chrome. This is navigation
only; it never changes what is mounted.

## 4. States, each with a fixture or preview override

| State | Behavior |
|---|---|
| Loaded, clean | Header + essentials + collapsed groups. No save bar. No internal ids anywhere on the page. |
| Dirty | Save bar visible with "Unsaved changes", Save enabled, Discard visible. Switcher arms the confirm step. |
| Saving | Save bar with spinner and "Saving...", Save disabled. |
| Saved | Save bar disappears (form clean again). |
| Save error | Save bar stays with plain copy: "Your changes could not be saved. Please try again." Save re-enabled. |
| Load error | No header, no fields. A quiet centered state in the column: "This creation could not be loaded." lede "It may have been removed, or you may not have access to it." Actions: "Try again" and "Pick another creation" (opens the picker). Raw client messages never render. |
| Loading | Skeleton: header block + three field-block pulses on `--surface-2`. |
| Empty index (`/studio/v2/editor`) | Existing "Select a creation to edit" state with the picker CTA, unchanged. |
| Switch confirm | Section 3.7. |
| Mobile 390 | Compact header (3.2), Sections button, O11 sheet, single column, no horizontal overflow, first field within one short scroll. |

Per-type fixtures: Character, Story (ROOM_TEMPLATE), Location, NPC
Registry (the registry representative), plus Lore, empty sections,
and longest content carried forward. Every fixture now carries
`ownerId` and `updatedAt` so the seeded creation passes
`hasUsableCreation` and NO live query ever fires for a fixture id.
Unmatched real ids keep the existing live path unchanged.

## 5. Group grammar per type (ED1B data, at most five groups)

The first group is the open essentials group; the rest are
collapsible in order. `media` marks the group hosting the media
panel (ruling N5: registries, profiles, mechanics modules, and the
rules codex carry no media group). Section ids are the existing
per-type section arrays; every section of every type appears in
exactly one group.

Representative types, in full:

- **CHARACTER** (and PLAYER_CHARACTER): Identity (open): overview,
  identity, appearance. Body & Behavior: body, behavior. Artwork &
  Media (media): visualReferences. Systems: mechanicsProfile,
  runtimeModules, advanced. Publishing: publishing, danger.
- **ROOM_TEMPLATE (Story)**: Story (open): overview, room, opening.
  Cast & World: package, multiplayer. Runtime: runtime, narrative,
  runtimeModules. Artwork & Media (media). Publishing: publishing,
  danger.
- **LOCATION**: Place (open): overview, location, visual. Scene &
  Guidance: atmosphere, prompt. Runtime: runtimeModules. Artwork &
  Media (media). Publishing: publishing, danger.
- **NPC_REGISTRY**: Entries (open): overview, entries. Rules &
  Prompt: relationships, knowledge, aliases. Publishing: publishing,
  danger. No media group.

Remaining types follow the same transform of the ratified N1
grammar: the former first group becomes the open essentials group,
an Artwork & Media group is inserted before Publishing on
media-legal types, and Publishing closes. The full table is data in
`creationEditConstants.js` (`CREATION_TYPE_EDITOR_PAGE_GROUPS`);
unlisted types fall back to the Character grammar, matching the
section resolver's own default.

## 6. Contracts and composition boundaries

- Editor page contract 2.0.0 -> 3.0.0 (breaking): tab-model props
  (`activeSectionGroups` as tab data, `activeGroupId`,
  `onSelectGroup`, `activeSection` nav, overview summary card
  props, `creationId` display) leave; grouped-document props enter
  (`groups` with per-section rendered nodes, `openGroupIds`,
  `onToggleGroup`, `onJumpToSection`, load error object, dirty
  flag). The View stays portable: every functional surface still
  arrives as a composed ReactNode slot.
- editor-header 1.0.0 -> 2.0.0 (breaking): featured artwork frame
  replaces the 56px thumb; Sections trigger and actions seat added;
  compact 390 posture specified above.
- editor-save-bar 1.0.0 -> 2.0.0 (breaking behavior): visibility
  law becomes dirty-or-saving-or-save-error; `saved` no longer pins
  the bar; message copy is ViewModel-supplied plain language.
- `useCreationEditShellViewModel`, `useCreationEditViewModel`,
  `CreationEditSectionContent`, every section component, and the
  legacy `/studio/my-creations/[id]/edit` page are UNTOUCHED.
  Multi-section rendering mounts `CreationEditSectionContent` once
  per section with `activeSection` overridden per instance.
  `creationEditConstants.js` gains the ED1B grammar as a new
  additive export.
- All five entry callers (Vault Edit CTA, four quick-create "Keep
  editing" paths) keep working; the route shapes and `?origin=`
  behavior do not change.

## 7. Verification

Rendered at 390 (R3 emulate) then 1440 in every fixture state; zero
horizontal overflow, zero clipped UI, zero console errors; no
network request fires for any fixture id; no internal id string
appears in the rendered page; production build exit 0; every
DESIGN-TOKENS out-of-contract grep returns no new hits for touched
files; function-map rows updated in the closing commit.
