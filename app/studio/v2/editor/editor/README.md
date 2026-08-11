# Editor LOOM package

**Contract:** `Editor.contract.js` (v1.0.0)

## Purpose

The advanced editor (`docs/STUDIO-SPEC.md` sections 1, 4, 6; brief S3,
section 8.3): the one full edit surface for every saved creation, not
Character alone (the ruling amendment). Build address
`/studio/v2/editor/[id]` (route law, cutover sequence per
`docs/STUDIO-SPEC.md` 4.1). Rehost then seat: this page carries the
standalone editor's full function by consuming the existing
`components/studio/my-creations/**` edit-section components and
ViewModels read-only, inside a new v2-optimized, mobile-first shell.

## Boundary

```text
Editor.jsx (Shell, ../Editor.jsx)
  -> owns Next.js router (useRouter), passes onNavigateBack
  -> owns the dev-only fixture-id harness state (preview mirror only)
  -> useEditorViewModel.js
      -> resolves [id] fixture-first via editorSavedCreations.mock.js
      -> composes the READ-ONLY useCreationEditShellViewModel
         (components/studio/my-creations/creation-edit-shell/**)
      -> owns mobile section-nav open/close (presentation-only)
  -> builds ReactNode slots from the READ-ONLY creation-edit-shell
     lineage:
       - CreationEditMediaPanel (components/studio/my-creations/)
       - CreationEditSectionContent (creation-edit-shell/)
       - CreationEditStickyActionBar (components/studio/my-creations/edit/)
       - CreationEditMechanicsRuntimeQuickNav (creation-edit-shell/)
       - CreationFeaturedImagePickerModal (my-creations/image-library/)
  -> Editor.view.jsx
      -> header (identity, Set Default PC, back action)
      -> section navigation (thumb-reachable horizontal scroll at 390)
      -> media rail + section content (single column at <lg, two
         columns at lg+)
      -> named absorption seats (bodyDetail, behaviorDetail,
         advancedPrompting), always null this pass
      -> sticky action bar, featured image picker

editor/
  Editor.view.jsx       Portable Skin
  useEditorViewModel.js Chassis / orchestration adapter
  Editor.contract.js
  Editor.fixtures.js    four saved-creation fixtures
  editorSavedCreations.mock.js  the named [id] mock resolver (item 3)
  README.md
```

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
of this exact pairing, read for precedent, not modified):
`CreationEditMediaPanel`, `CreationEditStickyActionBar`,
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

`Editor.fixtures.js` exports four full saved-creation fixtures:

- **Character (default):** a complete CHARACTER creation carrying
  every quick and advanced field the rehosted sections read.
- **Lore (non-Character):** a LORE creation with a populated
  `lore_document`, exercising the rehosted structured authoring
  surface end to end.
- **Empty sections:** a CHARACTER creation with an empty `data`
  payload, exercising every section's own empty state.
- **Longest content:** a CHARACTER creation with maximal-length text
  in every long-form field, exercising overflow containment at 390.

## Preview

Auth-free, development only:

```text
/dev/ui-preview/editor-v2-page
```

Switches among the four fixture ids above via the dev-only harness;
mounts the same `Editor.jsx` Binding Shell used at
`/studio/v2/editor/[id]`, so the preview exercises the real rehosted
sections and the real save/review/archive/delete client calls stay
live-wired (per the existing `useCreationEditViewModel` contract) if a
fixture id is cleared and a real id is entered.
