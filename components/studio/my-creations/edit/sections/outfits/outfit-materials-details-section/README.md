# Outfit Materials & Details Section

This feature follows the Crestfall Loom boundary.

## Files

- `OutfitMaterialsDetailsSection.jsx` — public Binding Shell
- `OutfitMaterialsDetailsSection.view.jsx` — portable presentation
- `useOutfitMaterialsDetailsSectionViewModel.js` — application/form adapter
- `OutfitMaterialsDetailsSection.contract.js` — versioned View contract
- `OutfitMaterialsDetailsSection.fixtures.js` — isolated UI states

## Application boundary

The ViewModel reads the Outfit creation form and maps current and legacy fields
into display-ready values. Current edits continue writing to:

- `main_colors`
- `accent_colors`
- `materials`
- `accessories`
- `details`
- `armor_notes`

Legacy read compatibility is preserved for:

- `colors` as a fallback for `main_colors`
- `trim_details` as a fallback for `details`

The portable View does not know these storage names and does not save data.

## Preview

Development-only route:

```text
/dev/ui-preview/outfit-materials-details-section
```

The route returns `notFound()` in production.
