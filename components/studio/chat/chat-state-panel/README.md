# Chat State Panel LOOM Package

**Contract:** `ChatStatePanel.contract.js` (v1.1.0)

Wave C3, `docs/plans/FABLE-GATE-PLAN.md`. RESHAPED 23 Aug 2026
(build-0823 pass 2, RULED): the management row (Share, Export, Delete
icon-only 38px controls) replaces the prior button-stack `actions`
rendering; World, Knowledge, and Mechanics render as quiet key-value
rows with fade-line section labels, replacing the boxed StateCards.
New build; the legacy `components/studio/story-rooms/story-room-state-panel`
tree is a stale pre-upgrade fork of this repo and is read-only
reference, never edited or imported from here.

## Boundary

```text
ChatStatePanel.jsx
  -> useChatStatePanelViewModel.js
  -> ChatStatePanel.view.jsx
```

The ViewModel now owns one real piece of behavior, moved here from
`chat-cast-panel`: the delete-confirm sheet's open/closed local state
(`onDeleteRoom` is caller-provided; the real delete is wired live once
a room is bound).

## Desktop rail, mobile sheet

Same responsive pattern as `chat-cast-panel`: desktop renders a sticky
collapsible rail (`showCloseControl` / `onClosePanel`); mobile no
longer carries its own trigger button, the composer's Menu chip opens
the mobile sheet instead (a lifted `mobileOpen` / `onMobileOpenChange`
controlled pair, additive 1.1.0 props; the View falls back to its own
local state, seeded by `initialMobileOpen`, when the caller does not
supply them).

## Management row: Share, Export, Delete

Three 38px icon-only controls with an 11px word beneath each. Delete
carries `--status-danger` ink (quiet-delete law: no fill on the
trigger); an `actions` entry with `iconKey: "delete"` routes through
this package's own confirm step (`onRequestDeleteRoom` /
`deleteConfirm`) rather than the caller's `onPress`, matching the
pattern `chat-cast-panel` used to own for Delete Story.

## World, Knowledge, Mechanics: quiet key-value rows

`sections` ships exactly these three (the prior Scenario Phase and
Memory cards fold into them, or drop): label left (`--ink-dim`), value
right (`--ink`), a fade-line (`--line-fade`) rule under each section
title. No boxed StateCards remain. Every row's `value` is display-ready
text supplied by the caller; this View never fabricates a value when
no live source exists.

## Fixtures

`ChatStatePanel.fixtures.js`: complete, the room-state fallback case,
empty sections, loading, an error/partial-data case, no entry-point
actions, the delete-confirm sheet, the mobile sheet open, and a
longest-content case.

## Package assets

- `ChatStatePanel.contract.js`
- `ChatStatePanel.fixtures.js`
- `useChatStatePanelViewModel.js`
- `/dev/ui-preview/chat-state-panel`
