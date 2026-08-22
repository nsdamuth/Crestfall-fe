# Kit Modal Frame LOOM package

**Contract:** `KitModalFrame.contract.js` (`1.2.0`)

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
- Panel `--grad-panel-lift` (B3, 22 Aug 2026, supersedes `--surface-4`
  as the modal panel surface), `1px --line` border, `--radius-lg`,
  `--shadow-modal`.
- `variant="modal"` (default): mobile modal law (RULED 22 Aug 2026,
  supersedes R4 under 700px): `items-end p-0` veil, panel bottom-
  anchored at its own content height, capped `max-h-[92dvh]` with
  internal scroll, never maximized full-screen; centered floating
  surface at 700px and up, unchanged (corners all around, `--space-4`
  gutters).
- `variant="sheet"`: bottom-docked at every width, for sheet-only
  consumers that gate their own mounting by viewport (the dropdown
  under 700px). Gains a structural close header row (R7, 10 Aug
  2026): full-width band, close control static inside it, a fade
  divider (B1) closing the row, content renders below.
- Fade dividers (B1, 22 Aug 2026): 1px, `--line-fade`, never edge-to-
  edge. Used on the sheet header row and the unsaved-dismiss confirm
  step.
- Unsaved-dismiss confirm (mobile modal law, checkable condition 3):
  `hasUnsavedChanges` (default false) intercepts all three dismissal
  paths into an in-frame confirm step, "Keep editing" vs. "Discard"
  (B5 danger-fill recipe), instead of a silent discard.
- `variant="viewer"` (added 1.1.0, 10 Aug 2026): the chromeless image
  viewer surface (R2/R5): chrome-frost veil, transparent full-viewport
  panel. The panel is click-transparent (`pointer-events-none`, R3
  review-gate fix, 10 Aug 2026): a transparent full-viewport panel
  otherwise swallows every veil click, so ModalShell's
  target===currentTarget backdrop guard could never fire and backdrop
  dismissal was dead. Content rendered into this variant must
  re-enable pointer events (`pointer-events-auto`) on each interactive
  box and leave everything else transparent; the frame's own close
  control already does.
- Width and height stay per-surface via `panelClassName` (caps only,
  never surface/border/radius/shadow/dismissal overrides).
- Close control: circular recipe, `absolute` top-right inside the
  panel for `modal` and `viewer`; static flow content inside the
  sheet's header row for `sheet` (R7), never overlapping content.
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
