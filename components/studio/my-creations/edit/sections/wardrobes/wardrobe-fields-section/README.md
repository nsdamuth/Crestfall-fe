# Wardrobe Fields Section

## Portable LOOM boundary

```text
WardrobeFieldsSection.jsx                     Binding Shell
wardrobe-fields-section/
  WardrobeFieldsSection.view.jsx              Portable View / Skin
  useWardrobeFieldsSectionViewModel.js        ViewModel / Chassis
  WardrobeFieldsSection.contract.js
  WardrobeFieldsSection.fixtures.js
```

The portable View owns the Wardrobe overview, Outfit-entry editor, empty state,
and selection-rule presentation. It receives display-ready entries, options,
character limits, and semantic callbacks.

The View does not:

- inspect `form` or `creation.data`;
- normalize Wardrobe entries;
- map storage keys;
- open or import the Outfit catalogue;
- call APIs or persistence helpers.

## Application-owned behavior

The ViewModel normalizes and writes the existing Wardrobe fields:

- `creation.data.scope`
- `creation.data.entries`
- `creation.data.selectionRules`
- `creation.data.promptGuidance`
- `creation.data.image_prompt`
- `creation.data.negative_prompt`

The Binding Shell retains `OutfitPickerModal` because it loads and selects real
Outfit creations.

## Preview

Development only:

```text
/dev/ui-preview/wardrobe-fields-section
```
