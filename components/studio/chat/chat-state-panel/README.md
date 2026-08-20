# Chat State Panel LOOM Package

**Contract:** `ChatStatePanel.contract.js` (v1.1.0)

Wave C3, `docs/plans/FABLE-GATE-PLAN.md`. New build; the legacy
`components/studio/story-rooms/story-room-state-panel` tree is a
stale pre-upgrade fork of this repo and is read-only reference, never
edited or imported from here. Scoped to this wave: the four state
cards plus export/share entry points only. The behavioral baseline
this package's cards are a designed superset of is
`crestfall-main/Crestfall`'s `story-room-state-panel` package,
contract 1.0.0; its full Export Chat and Share Snapshot dialogs are
NOT ported here, deliberately out of scope. `actions` are the buttons
that will open them, wired to a caller-supplied `onPress`; the dialogs
themselves are wave C4's `chat-session-dialogs` package.

## Boundary

```text
ChatStatePanel.jsx
  -> useChatStatePanelViewModel.js
  -> ChatStatePanel.view.jsx
```

## Desktop rail, mobile sheet

Same responsive pattern as `chat-cast-panel`: desktop renders a sticky
collapsible rail (`showCloseControl` / `onClosePanel`); mobile renders
a "Chronicle State" trigger opening a `KitModalFrame`
`variant="sheet"` (R7 structural close header, R4-safe), gated by
local disclosure state (`initialMobileOpen` seeds it for isolated
preview).

## The four cards, honest static placeholders kept honest

Scenario Phase (Current/Objective/Scenario), World State
(Location/Time+source/Weather+source, engine-module aware per the
baseline's Room-state-fallback fixture), Knowledge Boundaries, Memory.
Every row's `value` is display-ready text supplied by the caller; this
View never fabricates a value when no live source exists, matching the
crestfall-main inventory's "static placeholders KEPT honest"
requirement.

## Fixtures

`ChatStatePanel.fixtures.js`: complete (engine-sourced), the
room-state fallback case (empty phase, Room State source labels), empty
sections, loading, an error/partial-data case, no entry-point actions,
the mobile sheet open, and a longest-content case.

## Package assets

- `ChatStatePanel.contract.js`
- `ChatStatePanel.fixtures.js`
- `useChatStatePanelViewModel.js`
- `/dev/ui-preview/chat-state-panel`


## W40 live Story Room extension

The optional `supplementalContent` slot preserves caller-owned live Runtime Mechanics content beneath the C4 Export/Share actions. The slot is presentation-only; Runtime Mechanics loading, mutation, and API behavior remain outside the chat package.

`mobileOpen` / `onMobileOpenChange` additionally allow the top-level Chat Shell to open the mobile Chronicle State sheet from the composer's State action while preserving uncontrolled preview behavior.
