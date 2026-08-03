# Location Sensory Environment Fields LOOM package

## Portable LOOM boundary

`LocationSensoryEnvironmentFields.view.jsx` is the portable Skin. It renders display-ready Vision, Hearing, and Scent controls and emits semantic callbacks. It does not inspect a Creation form, interpret the nested sensory profile, normalize legacy keys, parse tag drafts, or persist data.

`useLocationSensoryEnvironmentFieldsViewModel.js` is the Chassis. It preserves the existing nested payload contract under:

- `sensoryProfile.environment.VISION`
- `sensoryProfile.environment.HEARING`
- `sensoryProfile.environment.SCENT`

The ViewModel also preserves:

- lowercase legacy reads from `vision`, `hearing`, and `scent`;
- blank scale values as inherited/unset values;
- 1–10 clamping and integer rounding;
- legacy scent-note `name` fallback;
- scent tag JSON-array and comma-list parsing;
- case-insensitive tag deduplication;
- add, edit, and remove behavior for scent notes.

`LocationSensoryEnvironmentFields.jsx` remains the stable thin Binding Shell used by both Location Create and Location Edit.

## Development preview

Open:

`/dev/ui-preview/location-sensory-environment-fields`

The route is unavailable in production and renders complete, inherited, and sparse fixture states without hydrating or saving a Creation.

## Focused diagnostics

Run:

`npm run diagnostics:loom:location-sensory-environment-fields`
