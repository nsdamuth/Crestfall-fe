# Chat Party Panel LOOM Package

**Contract:** `ChatCastPanel.contract.js` (v2.0.0)

Wave C3, `docs/plans/FABLE-GATE-PLAN.md`. RESHAPED 23 Aug 2026
(build-0823 pass 2, the Party panel ruling): renamed from Cast to
Party in every user-visible string. New build; the legacy
`components/studio/story-rooms/story-room-cast-panel` tree is a stale
pre-upgrade fork of this repo and is read-only reference, never edited
or imported from here.

## Boundary

```text
ChatCastPanel.jsx
  -> useChatCastPanelViewModel.js
  -> ChatCastPanel.view.jsx
```

The ViewModel is a defensive pass-through only: the delete-confirm
local state it used to own moved to `chat-state-panel` alongside
Delete Story itself. The View composes `chat-npc-manager`'s already
portable View directly (`npcParticipantManager` is a full
`ChatNpcManagerViewProps` object).

## Desktop rail, mobile sheet

Desktop renders a sticky, collapsible rail (`canClose` / `onClosePanel`).
Mobile no longer carries its own trigger button: the composer's Menu
and Party chips open the panels' mobile sheets instead (a lifted
`mobileOpen` / `onMobileOpenChange` controlled pair, additive 2.0.0
props; the View falls back to its own local state, seeded by
`initialMobileOpen`, when the caller does not supply them).

## Fixed 5 party slots

`partyMembers` renders up to `CHAT_CAST_PANEL_MAX_PARTY_SIZE` (5)
filled rows (38px avatar tile, name, role subline); remaining slots
render dashed with "Open slot · 5 max". Double-clicking a filled row,
or tapping an open slot, calls `onOpenPartyRoster`, which opens the
new `chat-party-roster` selection surface. Set Player Character,
Random Liked, and Delete Story are REMOVED from this panel (Delete
Story now lives on `chat-state-panel`'s management row).

## Scene art: icon-only, no caption

The missing-image law (`docs/BUILD-BLUEPRINT.md` 2.16(ac)): an
icon-only well, no caption text, dead-centered. Clicking it calls
`onOpenSceneImagePicker`.

## Fixtures

`ChatCastPanel.fixtures.js`: complete (open slots remain), empty
party (5 open slots), full party (with the NPC manager open),
loading, error, locked, mobile sheet open, and a longest-content case.

## Package assets

- `ChatCastPanel.contract.js`
- `ChatCastPanel.fixtures.js`
- `useChatCastPanelViewModel.js`
- `/dev/ui-preview/chat-cast-panel`
