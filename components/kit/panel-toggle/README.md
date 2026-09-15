# KitPanelToggle

The shared panel toggle glyph (ASSET-FOLDERS plan, package AF2, 14
Sep 2026). Lifted unchanged from `components/studio/story-rooms/
story-room-chat-shell/RailPanelGlyph.jsx` (fe/chat-studio brief 2
items 5 and 11, 13 Sep 2026; the bare icon ruled 10 Sep 2026), one
drawing shared by the primary sidebar's collapse toggle, the story
chat shell's two rail edge toggles, and the composer's mobile story
list button. Contract 1.0.0.

## What it shows

- One SVG glyph, `aria-hidden`, never a button itself: a consumer
  wraps it in its own `<button>` carrying the click handler,
  `aria-label`, and `aria-expanded`.
- `BARE_ICON_BUTTON_CLASS`, co-exported: the 44px bare-icon button
  recipe (no circle, no fill, dim ink at rest, gold on hover, deep
  gold pressed, the global focus ring, `touch-manipulation`).
- A 180 degree turn between open and closed over `--dur-fast`. For a
  left-edge panel (the sidebar, a story list) open is the resting
  orientation; for a right-edge panel (a details rail) open is the
  turned one, set through `side`.

## Boundary

```text
Any panel-toggle consumer
  -> KitPanelToggle (Binding Shell, components/kit/KitPanelToggle.jsx)
       -> useKitPanelToggleViewModel   side/open normalization
       -> KitPanelToggle.view.jsx      the glyph, presentation only
```

The old path,
`components/studio/story-rooms/story-room-chat-shell/RailPanelGlyph.jsx`,
is now a re-export shim of `KitPanelToggle.view.jsx` (not the Shell,
matching the established re-export precedent, e.g.
`components/studio/ViewModeToggle.jsx`), so the story chat shell and
the sidebar's collapse toggle keep their existing import lines and
render byte-identical.

## Mounting

```jsx
<button type="button" onClick={onToggle} aria-label={label} aria-expanded={open} className={BARE_ICON_BUTTON_CLASS}>
  <KitPanelToggle side="left" open={open} />
</button>
```

## Fixtures

left-closed, left-open, right-closed, right-open.
`kitPanelToggleDiagnostics.mjs` asserts the side and open fold, the
View's stateless shape, that the lifted View is byte-identical to the
original glyph, and that the old path is a shim, not a second copy
(`node --test components/kit/panel-toggle/kitPanelToggleDiagnostics.mjs`).

## Out of scope

Rendering the wrapping button itself (aria-label text, click
handling, and aria-expanded stay with each consumer); the Folders
trigger (AF5, AF6) is the next consumer, not built here.
