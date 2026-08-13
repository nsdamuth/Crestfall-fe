# Editor LOOM package

**Contract:** `Editor.contract.js` (v2.0.0, BREAKING, ED1,
docs/plans/FABLE-GATE-2-STUDIO.md, rulings N1/N2/N5/N6/N7 and
standing O11, ratified option A: the editor shell redesign. See the
contract file's own version note for the full breaking/additive
list. Summary: the `stickyActionBar` slot is replaced by `header`
(new `editor-header` package) and `saveBar` (new `editor-save-bar`
package, N2); section nav is grouped
(`activeSectionGroups`/`activeGroupId`/`onSelectGroup`, ruling N1);
`isLoreDocumentSection` dead field removed; `creationPicker` slot,
`isLoading`, `overviewDescription`/`overviewContentRating` added; the
mobile bottom-sheet section picker (standing O11) is wired for real.)

## Purpose

The advanced editor (`docs/STUDIO-SPEC.md` sections 1, 4, 6; brief S3,
section 8.3): the one full edit surface for every saved creation, not
Character alone (the ruling amendment). Build address
`/studio/v2/editor/[id]` (route law, cutover sequence per
`docs/STUDIO-SPEC.md` 4.1). Rehost then seat: this page carries the
standalone editor's full function by consuming the existing
`components/studio/my-creations/**` edit-section components and
ViewModels read-only, inside a new v2-optimized, mobile-first shell.
New this wave (ED1): `/studio/v2/editor` (no `[id]`) is the index,
rendering "Select a creation to edit" with the SW1 picker call to
action (`app/studio/v2/editor/EditorIndexClient.jsx`); `[id]` stays
the deep-linkable address this README otherwise documents.

## Boundary

```text
Editor.jsx (Shell, ../Editor.jsx)
  -> outer: owns discardKey (remount-driven Discard, see below)
  -> inner (EditorInner): owns Next.js router, the switcher/picker
     open state, the dev-only fixture-id harness state (preview only)
  -> useEditorViewModel.js
      -> resolves [id] fixture-first via editorSavedCreations.mock.js
      -> composes the READ-ONLY useCreationEditShellViewModel
         (components/studio/my-creations/creation-edit-shell/**),
         which itself now resolves both the flat section list AND
         the group grammar as data (ED1, see that file's own
         comments) instead of a nested ternary
      -> derives header identity (art, title, type eyebrow via
         terminology.js, visibility/canon chip) from the same form
         data the shell already returns
      -> owns mobile section-nav open/close (presentation-only)
  -> builds ReactNode slots from the READ-ONLY creation-edit-shell
     lineage:
       - CreationEditMediaPanel (components/studio/my-creations/)
       - CreationEditSectionContent (creation-edit-shell/, now a
         registry-as-data dispatch, see creationEditSectionComponentMap.js)
       - CreationEditMechanicsRuntimeQuickNav (creation-edit-shell/)
       - CreationFeaturedImagePickerModal (my-creations/image-library/)
     plus two new ED1 packages, composed the same way:
       - EditorHeader (components/studio/my-creations/editor-header/)
       - EditorSaveBar (components/studio/my-creations/editor-save-bar/)
     and the SW1 creation picker when the switcher opens:
       - CreationPicker (components/studio/creation-picker/)
  -> Editor.view.jsx
      -> header slot, save bar slot (top-docked, directly under header)
      -> Set Default PC / Sections (mobile) / Back utility row
      -> group tabs + in-group section flow (thumb-reachable
         horizontal scroll at 390), plus the O11 bottom-sheet section
         picker on phone
      -> media rail + section content (single column at <lg, two
         columns at lg+), led by the overview summary card on the
         first group's overview section
      -> named absorption seats (bodyDetail, behaviorDetail,
         advancedPrompting), always null this pass
      -> featured image picker, creation picker (switcher)

editor/
  Editor.view.jsx       Portable Skin
  useEditorViewModel.js Chassis / orchestration adapter
  Editor.contract.js
  Editor.fixtures.js    seven saved-creation fixtures
  editorSavedCreations.mock.js  the named [id] mock resolver (item 3)
  README.md
```

## Discard, ED1

`useCreationEditViewModel` (the existing hydration authority, not
touched by this brief) exposes no "revert form" capability. `../Editor.jsx`
splits into an outer component holding a `discardKey` counter and an
inner component keyed on it (`key={creationId-discardKey}`); Discard
increments the counter, remounting the inner component and every hook
inside it, which re-runs hydration from the same `creationId`/`creation`
snapshot. This is the only way to discard unsaved edits without
editing the read-only hook.

## Section navigation, ED1: registry-as-data

Two files changed inside the read-only `creation-edit-shell` lineage,
both authorized by this wave's escalation:

- `useCreationEditShellViewModel.js`: `resolveCreationEditSections`
  (a nested ternary) now looks up `CREATION_TYPE_SECTIONS`
  (`creationEditConstants.js`), byte-for-byte the same resolution.
  `resolveCreationEditSectionGroups` (new) resolves each type's group
  grammar the same way from `CREATION_TYPE_SECTION_GROUPS`.
- `CreationEditSectionContent.jsx`: the 42-guard if-chain is now a
  lookup into `SECTION_COMPONENT_REGISTRY`
  (`creationEditSectionComponentMap.js`), one entry per
  (creationType, sectionId) pair, mechanically transcribed from the
  old chain (same Component, same props, same condition). "publishing"
  and "danger" stay explicit (universal across every type; publishing
  carries the one real branch, Lore's rehosted readiness surface).

`Editor.view.jsx` imports nothing from `components/studio/my-creations/**`,
`next/navigation`, or any Creation client. Every functional surface
arrives pre-composed as a `ReactNode` slot from the Shell.

## The rehost: what item 1 actually reuses

`useEditorViewModel` calls the existing, unmodified
`useCreationEditShellViewModel`
(`components/studio/my-creations/creation-edit-shell/useCreationEditShellViewModel.js`),
which itself composes `useCreationEditViewModel`
(`components/studio/my-creations/edit/hooks/useCreationEditViewModel.js`,
the Creation hydration/save/review/archive/delete authority) and
resolves the active section list per creation type via
`resolveCreationEditSections` (reading `creationEditConstants.js`,
including `CHARACTER_EDIT_SECTIONS` for Character/Player Character,
Nick's real order: Overview, Identity, Appearance, Visual References,
Body, Behavior, Mechanics Profile, Runtime Modules, Advanced,
Publishing, Danger Zone). Neither file is edited by this brief.

The Shell (`../Editor.jsx`) instantiates the same combined,
already-production-wired components the legacy
`/studio/my-creations/[id]/edit` page uses today
(`components/studio/my-creations/CreationEditShell.jsx` is the proof
of this exact pairing, read for precedent, not modified), EXCEPT the
sticky action bar: ED1 retires `CreationEditStickyActionBar` for this
route (recorded in its own README), replaced by `EditorHeader` +
`EditorSaveBar`. Still consumed unmodified: `CreationEditMediaPanel`,
`CreationEditMechanicsRuntimeQuickNav`,
`CreationFeaturedImagePickerModal`, and `CreationEditSectionContent`
(which itself composes every type's edit-section package: Character,
Outfit, Location, Pose, Image Preset, Scenario, Narrator, Room
Template, Storyline, registries, Mechanics Module, Rules Codex, Lore,
Actor Mechanics/Stats-Pools/Progression Profiles). Consuming this one
file gives every creation type a working editor, not Character alone,
matching the ruling amendment's "single edit destination for EVERY
creation type."

None of these files, nor their contracts, are changed by this brief.
An apparent need to change one would stop that unit; none arose.

## The Lore rehost ruling, item by item

The ruling requires the standalone Lore chapters/sections/blocks
editor (`components/studio/create/lore/lore-editor/`, contract
`lore_document_contract_v4`) to be the advanced Lore editing surface
inside this shell, not rebuilt.

**Finding: it already is, for free.** `CreationEditSectionContent.jsx`
(part of the creation-edit-shell lineage this brief consumes
read-only) already renders `LoreEditor`
(`components/studio/create/lore/LoreEditor.jsx`) for
`isLore && activeSection === "document"`. `LoreEditor.jsx` is itself
the combined Binding Shell for the `lore-editor/` package
(`useLoreEditorViewModel` + `LoreEditor.view.jsx`), and it also
injects the application-owned `LoreJsonEditorModal` internally. It
takes only `value`, `onChange`, and `contentRating`: no navigation,
share control, or other Binding Shell context beyond what it already
carries itself. Consuming `CreationEditSectionContent` read-only,
exactly as item 1 already requires, therefore rehosts the full
structured Lore authoring surface (chapters, sections, blocks,
references, image selection, JSON round-trip) with zero additional
binding work in this brief's own file set.

**LORE_EDIT_SECTIONS** (`creationEditConstants.js`) resolves for
`isLore`: Overview, Lore Document (the rehosted authoring surface),
Public Preview (`LoreDocumentRenderer`, also rehosted for free via the
same file), Publishing (routes to `LorePublicationReadiness`, not the
generic Publishing section, also already wired), Danger Zone.

**390-readiness.** The ruling requires the SAME optimized treatment as
the rest of the shell, not a lower-quality afterthought. This page's
content panel (`Editor.view.jsx`) wraps every section, Lore's
included, in one `overflow-x-auto` container inside the single-column
mobile layout, the sticky action bar, and the thumb-reachable section
nav uniformly; no Lore-specific exception exists. Per
`docs/STUDIO-SPEC.md` section 9 item 5, field-level kit conversion of
the rehosted sections (Lore's own internal recipe included) is
deliberately out of scope for this brief and is a later mechanical
sweep; this page does not make Lore worse than any other rehosted
section, and does not attempt that sweep either.

**Observed, not fixed (read-only territory):** `useLoreEditorViewModel`
calls `fetchCommunityCreations`, `fetchOwnedCreations`, and
`fetchCreationReactions` internally for character/location reference
loading. This is inherited, existing behavior identical to production
`/studio/my-creations/[id]/edit` today; this brief does not add, stub,
or change it.

## Named absorption seats (brief S3 item 5)

Three named `ReactNode` slots on `EditorViewProps.seats`, always
`null` this pass, no placeholder UI:

| Seat prop | Mounts under section | For (a future brief, S4) |
|---|---|---|
| `seats.bodyDetail` | `body` | Kibbe-Inspired Body Identity, Body Type, Height, Build, Proportions |
| `seats.behaviorDetail` | `behavior` | Outward/Internal Personality, Speech Style, Movement Style, Interests, MBTI, Western zodiac, East Asian zodiac, Voice Modules |
| `seats.advancedPrompting` | `advanced` | Enable toggle, nine guidance sections, per-section counters, 32,000-character combined budget |

Each seat renders immediately after the existing rehosted section
content for that tab, inside the same content panel. The Shell
(`../Editor.jsx`) currently passes `seats={{}}` (every key undefined);
`Editor.view.jsx` renders nothing when a seat is absent.

## Two composed-in closures (vault-edit-tree pass, 11 Aug 2026)

`docs/VAULT-EDIT-TREE-CLASSIFICATION.md` found two CR-007/CR-008 held
rows buildable inside this package's own file boundary, without
editing the forbidden `creation-edit-shell` lineage:

- **Owner-only draft preview badge** (CSV row 839). `Editor.jsx`
  derives `isLoreDraftPreview` from `sectionContentProps.isLore` and
  `sectionContentProps.activeSection === "preview"` (both already
  returned by the read-only shell hook) and passes it to
  `Editor.view.jsx`, which renders a small badge above the section
  content panel. No forbidden file touched.
- **"Manage image library" link** (CSV rows 409-421, 430). `Editor.jsx`
  builds `imageLibraryHref` pointing at the new
  `/studio/v2/editor/[id]/image-library` page (see
  `../image-library/README.md`) and passes it to `Editor.view.jsx`,
  which renders it beside the media panel. The existing `CreationEditMediaPanel`'s
  own "Go to Library" link is unchanged (its route is hardcoded inside
  the forbidden `creation-edit-media-panel` package); this link is an
  addition beside it, not a replacement.

## Fixture-first [id] resolution (brief S3 item 3)

`editorSavedCreations.mock.js` is the one named mock module (header
comment: mock, pending CR-031). It resolves four known ids to the full
saved-creation fixtures in `Editor.fixtures.js`; any other id falls
through unmodified to `useCreationEditViewModel`'s existing
`fetchOwnedCreation` live client call. Save, review, archive, delete,
unlist, and default-PC all continue through the same existing client
functions regardless of how the initial read resolved: live
persistence "where it already works," per the brief.

Generation (character rendering, image generation) is not wired by
any consumed package this page touches and stays an honest stub
wherever the rehosted sections themselves already stub it; this brief
adds no new generation surface.

## Fixture states

`Editor.fixtures.js` exports seven full saved-creation fixtures, five
of them the "per-type nav" set (ED1, at least Character and Story):

- **Character (default):** a complete CHARACTER creation, the
  Identity / Body & Behavior / Systems / Publishing group grammar.
- **Lore (non-Character):** a LORE creation with a populated
  `lore_document`, exercising the rehosted structured authoring
  surface end to end, the default Content / Systems / Publishing
  grammar.
- **Story:** a ROOM_TEMPLATE creation, the Story / Cast & World /
  Runtime / Publishing group grammar.
- **Location:** a LOCATION creation, the Place / Runtime / Publishing
  group grammar.
- **NPC Registry:** an NPC_REGISTRY creation, the Entries / Rules &
  Prompt / Publishing group grammar.
- **Empty sections:** a CHARACTER creation with an empty `data`
  payload, exercising every section's own empty state.
- **Longest content:** a CHARACTER creation with maximal-length text
  in every long-form field, exercising overflow containment at 390.

Loading and load-error are demonstrated by a preview-only harness
override on `Editor.jsx` (`previewLoadingOverride`/
`previewLoadErrorOverride`, same precedent as `originOverride`): the
fixture-first mock resolver is synchronous and never produces a real
async gap on its own. Dirty-switch confirm and the mobile sections
sheet are live-interactive states, not fixture objects: edit any
field then open the switcher for the former; resize under 1024px and
tap Sections for the latter.

## Preview

Auth-free, development only:

```text
/dev/ui-preview/editor-v2-page
```

Switches among the seven fixture ids above, plus origin and load-state
harnesses, via the dev-only harness;
mounts the same `Editor.jsx` Binding Shell used at
`/studio/v2/editor/[id]`, so the preview exercises the real rehosted
sections and the real save/review/archive/delete client calls stay
live-wired (per the existing `useCreationEditViewModel` contract) if a
fixture id is cleared and a real id is entered.
