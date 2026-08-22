# Trackers Module Config Modal LOOM package

**Contract:** `TrackersModuleConfigModal.contract.js` (`trackers-module-config-modal.view.v1`)

## Purpose

Configures a Location's abstract mechanics fields (meters), their
event-driven mutation hints/effects, and guard/gate rules. Split out
of a single 1908-line `TrackersModuleConfigModal.jsx` file (ED1G
CLEANUP finding) into the same view/viewmodel/contract/fixtures
package shape every sibling in this directory already follows (see
`../weather-module-config-modal/`).

## Boundary

```text
../TrackersModuleConfigModal.jsx (entry point)
  -> useTrackersModuleConfigModalViewModel.js
  -> TrackersModuleConfigModal.view.jsx
     -> KitModalFrame (components/kit/KitModalFrame)
     -> SharedFields (TextField, NumberField, SelectField, TextAreaField, ReadOnlyField)
     -> LocationsCheckboxField (../LocationsCheckboxField)
```

## ED1G law pass

- Ruling 3: the hand-rolled fixed-inset overlay is retired onto
  KitModalFrame (LARGE width tier, `max-w-4xl`, A4 mobile bottom-anchor
  law, B5/B8 unsaved-dismiss confirm via `hasUnsavedChanges`, B1 fade
  dividers on the header/footer).
- Native selects converted to the branded dropdown grammar via
  SharedFields.SelectField (KitFormField variant="select").
- Ruling 2 checkbox grammar applied to "Enable mechanics module" and
  "Allow repeat" via `LocationsCheckboxField`.
- Section 5 de-nesting: the outer `EditorPanel` bordered/backgrounded
  boxes are retired for the inset-hairline `Group` sub-group pattern.
  `TrackerCard` and `GuardCard` keep their own border/background
  because they are repeatable list items, the same allowance the
  mechanics-modules sibling card lists use.
- Hand-rolled field primitives replaced with SharedFields' TextField /
  NumberField / SelectField / TextAreaField / ReadOnlyField. The
  `ComboTextField` (a freeform text input with an HTML5 datalist of
  suggested targets) is not a rigid `<select>` and stays local,
  restyled onto the same token bed.

## SKIPPED, no ruling

The progress-meter bar under each tracker's "Starting Value Preview"
(`h-3 white/10 track, gold/80 fill`) is intentionally left as-is: no
meter recipe exists in law, and this lane does not invent one.

## Package assets

- `TrackersModuleConfigModal.contract.js`
- `TrackersModuleConfigModal.fixtures.js`
- `useTrackersModuleConfigModalViewModel.js`

No dedicated `/dev/ui-preview` route exists for this package (out of
this lane's scope, `app/dev/ui-preview/**`).
