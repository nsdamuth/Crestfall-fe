# Location Visual Description Section LOOM package

## Portable LOOM boundary

`LocationVisualDescriptionSection.view.jsx` is the portable Skin. It renders only display-ready field values and emits semantic field-change callbacks. It does not receive the Creation Edit `form`, inspect JSONB, resolve legacy keys, or persist data.

`useLocationVisualDescriptionSectionViewModel.js` is the Chassis. It normalizes the current Location payload and maps semantic edits to the existing Creation data keys:

- `architecture`
- `materials`
- `visual_motifs`
- `landmarks`
- `layout`
- `design_notes`

Historical payload compatibility is preserved for reads:

- `spatial_design` falls back into the displayed Layout value when `layout` is absent.
- `design_reference` falls back into the displayed Design Notes value when `design_notes` is absent.

Edits continue writing only to the established canonical fields `layout` and `design_notes`, matching the prior component behavior.

`LocationVisualDescriptionSection.jsx` remains the thin Binding Shell used by `CreationEditShell.jsx`.

## Development preview

Open:

`/dev/ui-preview/location-visual-description-section`

The route is unavailable in production and renders fixture-driven complete, legacy-fallback, sparse, and empty states without loading or saving a Creation.

## Focused diagnostics

Run:

`npm run diagnostics:loom:location-visual-description-section`
