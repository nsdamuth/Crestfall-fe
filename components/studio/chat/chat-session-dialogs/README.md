# Chat Session Dialogs LOOM Package

**Contract:** `ChatSessionDialogs.contract.js` (v1.0.0)

Wave C4, `docs/plans/FABLE-GATE-PLAN.md`. New build; the legacy
`components/studio/story-rooms/story-room-transcript` and
`story-room-state-panel` trees (this repo) and
`crestfall-main/Crestfall`'s equivalents are read-only reference,
never edited or imported from here. This package is the real dialog
surfaces that wave C3's `chat-cast-panel` and `chat-state-panel`
entry-point buttons (`onPress`) open: Report, Export, Share, Delete
Story, plus a portable summary-pending composition.

## Boundary

```text
ChatSessionDialogs.jsx
  -> useChatSessionDialogsViewModel.js
  -> ChatSessionDialogs.view.jsx
```

## Dialog kinds

One dialog frame open at a time via `activeDialog.kind`; the View
also exports each dialog's inner component directly
(`ReportDialog`, `ExportDialog`, `ShareDialog`, `DeleteConfirmDialog`,
`SummaryPendingCard`) for callers that already own their own open/
close plumbing (e.g. a page shell composing more than one at once
during a transition).

- **Report** (`REPORT`): five ruled reason codes
  (`CHAT_REPORT_REASON_OPTIONS`, ported from the crestfall-main
  baseline's `REPORT_REASON_OPTIONS`) plus a 2,000-character comment
  field. Counter follows the O4 ruling: hidden at rest, appears on
  textarea focus or once past 80% of the limit, turns
  `--status-danger` with the word "limit" at the ceiling. Composed on
  `KitModalFrame variant="modal"` (R4 full-screen at 390 is superseded
  under 700px by A4, the mobile modal law RULED 22 Aug 2026,
  BUILD-BLUEPRINT 2.16(p); `KitModalFrame` implements the bottom-
  anchored A4 behavior, never a full-screen panel, below that
  boundary).
- **Export** (`EXPORT`): range preset (`CHAT_EXPORT_RANGE_PRESETS`:
  current beat, current scene, recent 25, recent 50, custom start/
  stop) and format (`CHAT_EXPORT_FORMAT_OPTIONS`: TXT, Markdown).
  Custom range reveals start/end message selects. `KitModalFrame
  variant="modal"`.
- **Share** (`SHARE`): temporary one-hour vs persistent
  Llama-Guard-reviewed link, same range presets as Export. Before a
  result exists the form renders; after, a result panel keyed on
  `result.status` (`ACTIVE`/`REJECTED`/`FAILED`/`REVOKED`) with Copy
  on an active link. Revoke is destructive-law gated: the in-dialog
  trigger is a quiet ghost with `--status-danger` text
  (`onRequestRevoke`), which opens a separate `KitModalFrame
  variant="sheet"` confirm step (`revokeConfirmOpen`) whose confirming
  button is `cf-btn--danger-filled`, never `window.confirm`.
  `KitModalFrame variant="modal"`.
- **Delete Story** (`DELETE_CONFIRM`): `KitModalFrame variant="sheet"`
  (R7 close header), carrying `CHAT_SESSION_DELETE_STORY_CONFIRMATION`,
  the same baseline copy wave C3's `chat-cast-panel` ships as
  `CHAT_CAST_PANEL_DELETE_CONFIRMATION` (identical string, two
  packages: `chat-cast-panel` wires its own Delete Story trigger
  inline; this package is the portable, standalone version for
  callers that do not compose the cast panel). Cancel is
  `cf-btn--secondary`, the confirming Delete Story button is
  `cf-btn--danger-filled`, the one legal filled-danger placement.
- **Summary pending** (not a dialog frame): a live-region
  (`role="status" aria-live="polite"`) card, the portable version of
  the "Crestfall Engine is preparing the current scene recap" state
  wave C1's `chat-transcript` already renders inline. Renders
  independent of `activeDialog`, controlled by `summaryPending.visible`.

## Fixtures

`ChatSessionDialogs.fixtures.js`, 28 states: Report (rest, near-limit
counter, at-limit danger, pending, error, longest); Export (rest,
custom range, Markdown format, pending, error, longest); Share
(temporary form, persistent form with custom range, ACTIVE temporary,
ACTIVE temporary copied, ACTIVE persistent, REJECTED, FAILED, REVOKED,
revoke confirm step, pending, error, longest); Delete Story (rest,
pending, error); no dialog open; summary-pending composition.

## Package assets

- `ChatSessionDialogs.contract.js`
- `ChatSessionDialogs.fixtures.js`
- `useChatSessionDialogsViewModel.js`
- `/dev/ui-preview/chat-session-dialogs`

## STOP items, none

Every value used resolves through an existing locked token; no new
token was needed for this package.
