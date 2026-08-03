# Character Color Palette Loom Feature

## Files

- `../CharacterColorPaletteModal.jsx` — binding Shell and stable public import path.
- `CharacterColorPaletteModal.view.jsx` — portable presentation-only View.
- `useCharacterColorPaletteModalViewModel.js` — Crestfall palette selection behavior.
- `CharacterColorPaletteModal.contract.js` — versioned View contract.
- `CharacterColorPaletteModal.fixtures.js` — isolated visual states.

## Boundary

The View receives display-ready palette families, color swatches, preview colors,
and semantic callbacks. It does not import Crestfall palette constants, choose the
default palette, or know how a character stores the selected palette ID.

The ViewModel owns:

- mapping the selected value to Crestfall's default/fallback palette;
- translating palette constants into display-ready View props;
- opening and closing the selector;
- returning the selected palette ID through the existing `onChange` callback.

## Existing public contract

```jsx
<CharacterColorPaletteModal value={paletteId} onChange={setPaletteId} />
```

## Preview

Development-only route:

```text
/dev/ui-preview/character-color-palette
```

The route renders fixtures directly and must remain unavailable in production.
