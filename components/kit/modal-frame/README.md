# Kit Modal Frame LOOM package

**Contract:** `KitModalFrame.contract.js` (`1.0.0`)

## Purpose

The ruled PANEL from `docs/BUILD-BLUEPRINT.md` section 2.5, standing on
top of the existing `ModalShell` behavioral primitive
(`components/ui/modal-shell/`). ModalShell already owns the veil, the
backdrop-dismiss guard, Escape, and the body scroll lock; before this
package, every caller hand-rolled its own panel surface, border,
radius, shadow, and close control through `panelClassName`. This
package standardizes that panel once.

## Boundary

```text
KitModalFrame.jsx
  -> useKitModalFrameViewModel.js
     -> useModalShellViewModel (components/ui/modal-shell/)
  -> KitModalFrame.view.jsx
     -> ModalShellView (components/ui/modal-shell/)
```

`components/ui/ModalShell.jsx` and its LOOM folder are untouched by
this package; every one of its current callers stays exactly as it
was (`docs/SPRINT-A-PLAN.md` section 2.3).

## Anatomy

- Veil `--scrim-strong` with `blur(var(--blur-panel))`.
- Panel `--surface-4`, `1px --line` border, `--radius-lg`,
  `--shadow-modal`.
- `variant="modal"` (default): bottom-docked sheet under 700px (top
  corners only, safe-area bottom padding), centered floating surface
  at 700px and up (corners all around).
- `variant="sheet"`: bottom-docked at every width, for sheet-only
  consumers that gate their own mounting by viewport (the dropdown
  under 700px, phase 4 of this sprint).
- Width and height stay per-surface via `panelClassName` (caps only,
  never surface/border/radius/shadow/dismissal overrides).
- Circular close control, fixed frame anatomy, `absolute` top-right
  inside the panel. Content that must not sit under it clears it with
  its own top or right padding.
- Portaled to `document.body`: a `backdrop-filter` ancestor (the
  sticky filter bar, the frosted top bar) becomes the containing block
  for `fixed` descendants, so the frame must escape it.

## Dismissal

Backdrop click, Escape, and the close control all close, inherited
from the composed ModalShell ViewModel. All three are null-safe
no-ops when `onClose` is absent (the `noClose` fixture).

## Accessible name

`ariaLabelledBy` is forwarded to the composed `ModalShellView`
directly. `ariaLabel` is a fallback for surfaces with no heading id:
when supplied with no `ariaLabelledBy`, the View renders a
visually-hidden span carrying the label and forwards its generated id
as `ariaLabelledBy` to `ModalShellView` (which accepts `ariaLabelledBy`
only, and is not modified by this package). The rendered accessible
name is identical to a raw `aria-label` attribute.

## Known gap

No focus trap exists in `ModalShell` today and none is invented here;
consistent with current behavior across every caller.

## Package assets

- `KitModalFrame.contract.js`
- `KitModalFrame.fixtures.js`
- `useKitModalFrameViewModel.js`
- `/dev/ui-preview/modal-frame`

Fixture-only; no query, persistence, or navigation is wired.
