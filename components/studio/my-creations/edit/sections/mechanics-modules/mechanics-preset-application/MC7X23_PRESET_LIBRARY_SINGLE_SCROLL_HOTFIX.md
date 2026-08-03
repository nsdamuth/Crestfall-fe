# MC7X.2.3 — Preset Library Single-Scroll Hotfix

## Scope

This is a frontend-only correction to the LOOM Mechanics Preset Library. It does not alter preset definitions, application modes, merge/replace behavior, validation, persistence, services-api, database, PostGraphile, or runtime execution.

## Root cause

The previous modal frame constrained the viewport, but delegated scrolling to responsive nested panes. At browser widths or zoom levels where the responsive breakpoint did not resolve as expected, the long preset list could extend beneath the fixed footer without exposing a dependable visible scrollbar. Global input styles also continued to compete with the absolutely positioned search icon.

## Correction

- The custom preset dialog now uses an explicit three-row CSS grid: header, `minmax(0, 1fr)` body, footer.
- The complete body owns one forced vertical scrollbar at every width.
- Preset navigation and selected-preset details remain responsive inside that one scroll region.
- The scrollbar receives explicit Firefox and WebKit styling so it remains visible even when application-level scrollbar rules are present.
- The search icon is no longer positioned over the input. It is a separate flex child beside a fully reset input element.
- Header and footer remain outside the scroll region.
- Background page scrolling remains locked while the dialog is open.

## Live check

1. Open the Preset Library.
2. Expand a long folder such as Command Starters.
3. Confirm a gold scrollbar is visible on the right side of the modal body.
4. Scroll to the selected-preset details and all confirmation/application controls.
5. Confirm the header and action footer remain visible.
6. Confirm the search placeholder begins after the search icon with no overlap.
