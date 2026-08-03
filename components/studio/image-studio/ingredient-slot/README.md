# Ingredient Slot

## Purpose

`IngredientSlot` displays one Image Studio ingredient category, its current
selection, and the actions used to open or clear that slot.

The public import path remains:

```text
components/studio/image-studio/IngredientSlot.jsx
```

That file is the Binding Shell. It preserves the current `slot`, `value`,
`onOpen`, and `onClear` API while translating raw Image Studio records into
portable View props.

## Current consumer

```text
components/studio/image-studio/ImageStudioComposer.jsx
```

## Ownership boundary

The View owns:

- ingredient-card layout and styling;
- empty, selected, and custom visual states;
- required, optional, and custom helper-label rendering;
- icon and fallback-icon presentation;
- clear-button event propagation and accessibility.

The ViewModel owns:

- reading the raw slot definition;
- reading the raw selected ingredient record;
- determining whether the selection is custom;
- normalizing labels, title, subtitle, and clear text;
- mapping semantic open and clear callbacks to the existing caller.

The feature does not own ingredient searching, picker state, selected-ingredient
storage, prompt composition, API calls, image generation, or persistence.

## Public API

```jsx
<IngredientSlot
  slot={slot}
  value={selectedIngredients[slot.id]}
  onOpen={() => onOpenIngredient(slot)}
  onClear={() => onClearIngredient(slot.id)}
/>
```

## View contract

```text
INGREDIENT_SLOT_VIEW_CONTRACT_VERSION = "1.0.0"
```

The portable View receives display-ready labels, selection state, an optional
visual icon, and semantic `onOpenSlot` / `onClearSlot` callbacks. It does not
receive the raw slot definition or selected ingredient object.

## Development preview

```text
/dev/ui-preview/ingredient-slot
```

The preview renders direct View-contract fixtures and must return `notFound()`
in production.

## Live regression target

```text
Image Studio
→ ingredient grid
→ open a required or optional slot
→ select a built-in ingredient
→ select a custom ingredient
→ clear the selection
```
