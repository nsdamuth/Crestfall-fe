# Modal Shell LOOM package

**Status:** Loom-separated, 7 Aug 2026 (Ruling 6)

**View contract:** `1.1.0` (10 Aug 2026, kit polish 3 pass: additive
`veilClassName` full-substitution prop for the veil background/blur
treatment, default unchanged; KitModalFrame's `viewer` variant is the
first consumer)

## Purpose

The shared floating-modal frame: fixed overlay, scrim, blur, backdrop
dismiss surface, and dialog semantics. 12 callers reach it per
`docs/SHELL-INVENTORY.md`, so every downstream modal inherits its tokens
from here.

## Structure

```text
ModalShell.jsx
  Binding Shell
modal-shell/
  ModalShell.view.jsx
    Portable Skin
  useModalShellViewModel.js
    Chassis / escape-key, scroll-lock, backdrop-dismiss behavior
  ModalShell.contract.js
  ModalShell.fixtures.js
  README.md
```

## Chassis responsibilities

The ViewModel owns:

- escape-key close handling (`closeOnEscape`)
- body-scroll locking while the modal is mounted
- backdrop mousedown dismissal (`closeOnBackdrop`), guarding against a
  missing `onClose`

## Portable Skin responsibilities

The View renders only the fixed overlay, the scrim (`--scrim-strong`),
the blur (`--blur-panel`), and the panel slot (`panelClassName`,
`children`). It does not own disclosure state, escape handling, or
scroll locking.

## Mobile modal law, RULED 22 Aug 2026 (modal family close)

`docs/BUILD-BLUEPRINT.md` 2.16(p) supersedes R4 under 700px app-wide.
`KitModalFrame` is the propagation target for the ruling's bottom-anchored,
confirm-on-dismiss, 44px-floor behavior; `ModalShell` itself is
unchanged by it (it keeps centering at 700px and up per 2.5, and
carries no bottom-anchor behavior of its own). No prop was added here,
so no version bump: this section records the ruling per the plan's
README instruction even though the bump was correctly skipped.

## Public contract

Unchanged from the pre-carve component: `children`, `onClose`,
`closeOnBackdrop`, `closeOnEscape`, `className`, `panelClassName`,
`ariaLabelledBy`, `ariaDescribedBy`. Carving this package changed no
caller-visible prop.

## Preview

Development only:

```text
/dev/ui-preview/modal-shell
```
