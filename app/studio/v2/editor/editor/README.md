# Editor LOOM package

**Contract:** `Editor.contract.js` (v4.0.0, BREAKING, ED1C,
`docs/plans/ED1B-EDITOR-PAGE-SPEC.md` as revised 13 Aug 2026 to
Brian's direction: artwork hero, one-section-at-a-time accordion of
section boxes, sticky right ToC rail carrying the switcher, the
always-visible save block, and per-section dirty/saved marks; mobile
bottom control bar + bottom sheet. See the contract's version note
for the full breaking list.)

## Purpose

The advanced editor: the one full edit surface for every saved
creation. Build addresses `/studio/v2/editor/[id]` (deep-linkable)
and `/studio/v2/editor` (index, "Select a creation to edit").
Rehost then seat: the page carries the standalone editor's full
function by consuming the existing `components/studio/my-creations/**`
edit-section components read-only inside the ED1C shell. Internal
ids never render; every error renders as plain language.

## Boundary

```text
Editor.jsx (Shell, ../Editor.jsx)
  -> outer: owns discardKey (remount Discard + load-error Try again)
  -> inner: Next.js router, switcher/picker open state
  -> useEditorViewModel.js
      -> resolves [id] fixture-first via editorSavedCreations.mock.js
        (the mock overlay wins, so a fixture save survives switches)
      -> composes the READ-ONLY useCreationEditShellViewModel
      -> ED1C page grammar: resolveEditorPageGroups minus media
         hosting (artwork lives in the hero), empty groups dropped
      -> accordion state (single open section, first section open by
         default), per-section dirty/saved marks (update callbacks
         wrapped per section via sectionContentPropsFor),
         fixture-mode save (saveMockCreation, NO live mutation for a
         fixture id), live-path load-vs-action disambiguation, hero
         props (active slot large, slot rail, actions)
  -> mounts one CreationEditSectionContent per section id, each
     under EditorSectionChromeContext {suppressSectionTitle: true}
     (SharedFields 1.1.0) so sections drop their internal eyebrow +
     title + description stacks; the section box carries the one
     header
  -> EditorHeader (3.0.0, the artwork hero), CreationPicker (SW1),
     CreationFeaturedImagePickerModal (now on KitModalFrame)
  -> Editor.view.jsx
      -> Back -> hero -> section boxes (quick-create groups first,
         quiet group separators, ONE box open at a time, opened from
         the box header or the ToC)
      -> desktop rail (sticky): Switch creation (+ inline
         unsaved-changes confirm), save block (All changes saved /
         Unsaved changes + Save + Discard / Saving / plain error),
         ToC with per-section marks (gold dot = unsaved edits,
         success check = saved)
      -> mobile: sticky bottom bar (Sections + save words + Save)
         opening the bottom sheet (KitModalFrame sheet, the O11
         seat: switcher + save block + ToC)
      -> friendly load-error state, loading skeleton, overlays

editor/
  Editor.view.jsx       Portable Skin
  useEditorViewModel.js Chassis / orchestration adapter
  Editor.contract.js
  Editor.fixtures.js    eight saved-creation fixtures
  editorSavedCreations.mock.js  [id] resolver + fixture save overlay
  README.md
```

## Fixture save (ED1C)

Save on any id the mock resolver answers persists the edited form
into the mock overlay (`saveMockCreation`) and never fires a live
mutation; the form reads clean, per-section dirty dots flip to saved
checks, and the rail shows "All changes saved". Discard, remount,
and switch-away-and-back rehydrate the saved edits. The live path
for real ids is unchanged and is the only place the save error state
can appear. The read-only hook cannot reset its own dirty flag
without a live round trip, so mock mode masks it by
reference-comparing the form against the last saved snapshot.

## What stays read-only

`useCreationEditViewModel`, `useCreationEditShellViewModel`,
`CreationEditSectionContent` (dispatch), the section components'
data flow, and the legacy `/studio/my-creations/[id]/edit` route.
ED1C's authorized legacy touches (all presentation, no prop-shape
changes): SharedFields 1.1.0 (chrome context; SelectField renders
the kit dropdown grammar), the five proven types' hand-rolled header
stacks routed through the same suppression, their in-flow native
selects converted to SelectField, and the featured image picker onto
KitModalFrame. editor-save-bar is retired for this route (its
README records it).

## Fixture states

Eight full saved-creation fixtures (Character default, Lore, Story,
Location, NPC Registry, Character Template, empty sections, longest
content) plus the
picker-owned id set, each exercising its own grammar and identity.
Loading / load-error / dirty are preview overrides on `Editor.jsx`
(`previewLoadingOverride`, `previewLoadErrorOverride`,
`previewDirtyOverride`; dirty also marks the first section so the
per-section dot shows). Accordion, ToC, sheet, switch confirm, and
the save flow are live-interactive in the preview mirror; the
fixture save is real (mock persistence).

## Preview

Auth-free, development only:

```text
/dev/ui-preview/editor-v2-page
```
