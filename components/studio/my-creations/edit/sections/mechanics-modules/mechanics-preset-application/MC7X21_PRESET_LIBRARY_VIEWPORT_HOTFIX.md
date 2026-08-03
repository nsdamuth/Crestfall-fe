# MC7X.2.1 — Preset Library Viewport and Search Hotfix

## Scope

This is a bounded frontend-only correction to the existing LOOM Mechanics Preset Library View.

It does not change preset definitions, application modes, merge/replace semantics, validation, persistence, runtime execution, services-api, database, or PostGraphile behavior.

## Corrections

- Replaces the fragile `min()` height utility with an explicit `90vh` modal height and `54rem` cap so the flex frame always receives a definite height.
- Adds an explicit `minmax(0, 1fr)` desktop grid row so the library and detail panes can become real independent scroll containers.
- Gives both desktop panes full constrained height, contained overscroll, and stable scrollbar gutters.
- Keeps the smaller-screen single-column content region scrollable beneath the fixed header and above the fixed footer.
- Reserves a dedicated icon lane inside the search field and applies an important left padding so global input styles cannot overlap the placeholder with the search icon.
- Adds a hidden accessible search label and native `type="search"` semantics.

## Live check

Open the Preset Library at the same browser width shown in the reported screenshot.

1. Select **Character Advancement (Generated Curve)**.
2. Scroll through the selected preset details until the application modes, counts, warnings, and confirmation controls are reachable.
3. Confirm the footer remains fixed and does not cover unreachable content.
4. Confirm the search icon sits to the left of `Search presets...` without overlap.
5. At desktop width, confirm the library list and selected-preset details scroll independently.
