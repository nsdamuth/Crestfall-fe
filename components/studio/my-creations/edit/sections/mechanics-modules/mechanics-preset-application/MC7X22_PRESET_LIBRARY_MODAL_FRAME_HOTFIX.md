# MC7X.2.2 — Preset Library Dedicated Modal Frame Hotfix

## Scope

This is a frontend-only correction to the LOOM Mechanics Preset Library. It does not alter preset data, merge/replace behavior, validation, persistence, services-api, database, PostGraphile, or runtime execution.

## Root cause

The Preset Library View was still nested inside the shared `ModalShell` content scroller. That outer scroller could control the real height and scroll behavior before the View's internal fixed-header/fixed-footer frame was reached. The result was a very tall stacked modal whose header and footer could scroll away.

## Correction

- The Preset Library now owns a dedicated local dialog frame instead of nesting its complete frame inside `ModalShell`.
- The dialog is capped to `min(88dvh, 48rem)` and never exceeds the dynamic viewport minus one rem.
- Background page scrolling is locked while the dialog is open.
- Escape closes the dialog; backdrop clicks remain non-dismissing.
- The header and footer remain outside the content scroll region.
- The two-pane layout begins at the `md` breakpoint, covering the reported browser width.
- The library and detail panes use forced independent `overflow-y-scroll` behavior with stable scrollbar gutters.
- Narrow screens use one forced vertical content scroller.
- The corrected search-icon spacing remains unchanged.

## Runtime note

The new `/progress` readout is functioning, but a readout of XP `4300`, level `1`, proficiency `+2`, and zero level-ups proves that `PROGRESSION_RECONCILE` has not yet updated rank-derived state. That runtime correction remains a separate focused patch.
