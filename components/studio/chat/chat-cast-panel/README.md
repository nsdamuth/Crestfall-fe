# Chat Cast Panel LOOM Package

**Contract:** `ChatCastPanel.contract.js` (v1.1.0)

Wave C3, `docs/plans/FABLE-GATE-PLAN.md`. New build; the legacy
`components/studio/story-rooms/story-room-cast-panel` tree is a stale
pre-upgrade fork of this repo and is read-only reference, never edited
or imported from here. The behavioral baseline this package is a
designed superset of is `crestfall-main/Crestfall`'s
`story-room-cast-panel` package, contract 1.0.0.

## Boundary

```text
ChatCastPanel.jsx
  -> useChatCastPanelViewModel.js
  -> ChatCastPanel.view.jsx
```

The ViewModel is a defensive pass-through plus one real piece of
behavior: the delete-confirm sheet's open/closed local state. The View
composes `chat-npc-manager`'s already portable View directly
(`npcParticipantManager` is a full `ChatNpcManagerViewProps` object),
same View-level composition as the crestfall-main baseline.

## Desktop rail, mobile sheet

Desktop renders a sticky, collapsible rail (`canClose` / `onClosePanel`,
same as the baseline). Mobile does not clone a drawer: a "Room & Cast"
trigger opens a `KitModalFrame` `variant="sheet"` (R7 structural close
header, R4-safe) carrying the identical content, gated by local
disclosure state (`initialMobileOpen` seeds it for isolated preview,
same pattern as `chat-composer`'s tools sheet).

## Delete Story: a real kit confirm step, never window.confirm

`CHAT_CAST_PANEL_DELETE_CONFIRMATION` ports the baseline's exact
seven-line copy (`useStoryRoomChatShellViewModel.js` in
crestfall-main) unchanged. `onRequestDeleteRoom` opens a
`KitModalFrame` `variant="sheet"` confirm step; the sheet's Cancel is
`cf-btn--secondary`, its Delete Story is `cf-btn--danger-filled`, the
one place in this repo's design law a filled danger button is legal
(`docs/DESIGN-TOKENS.md` status colors usage law). The in-page Delete
Story trigger itself stays a quiet ghost with `--status-danger` text
only, per the same law; only the confirm step's own button is filled.

## Cast cards

Avatar (`--radius-sm`, the small-nested-art-thumbnail exception),
selection chip, role, state (`Arriving`/`Present`/`Inactive`, free
string beyond those three per the baseline's flexibility), and an
optional note. Selectable cards report the chosen participant through
`onSelectCastMember`; non-selectable cards (the player-controlled
member) render as a plain article, matching contract law (presentation
changes, the same selection still reports to the same handler).

## Set Player Character, Random Liked, Delete Story

`playerCharacterAction` is visible only when `turnCount === 0`
(caller-owned gate, matching the crestfall-main inventory); its picker
overlay is an opaque `playerCharacterPickerContent` slot supplied by
the Binding Shell, same as the baseline (the picker itself is out of
this wave's scope). `randomLikedAction` and `deleteAction` are
straightforward visible/disabled/busy states.

## Fixtures

`ChatCastPanel.fixtures.js`: complete, empty cast, many cast (with the
NPC manager open), loading, error, setting-player-character busy,
locked (actions hidden), the delete confirm sheet at rest and pending,
the mobile sheet open, and a longest-content case.

## Package assets

- `ChatCastPanel.contract.js`
- `ChatCastPanel.fixtures.js`
- `useChatCastPanelViewModel.js`
- `/dev/ui-preview/chat-cast-panel`


## W40 live mobile coordination

`mobileOpen` / `onMobileOpenChange` optionally let the top-level Chat Shell coordinate this package's mobile sheet with the composer's Cast action. Uncontrolled fixture/preview behavior remains unchanged.
