# RoomTemplateMultiplayerSection Loom Feature

## Public entry point

```text
components/studio/my-creations/edit/sections/room-templates/
  RoomTemplateMultiplayerSection.jsx
```

The public file remains the Binding Shell and preserves the existing
`form` / `updateDataField` interface used by Creation Edit.

## Layer ownership

### ViewModel / application-owned

- reads the Story creation form
- calls `useMutualPlayers()`
- normalizes mutual-follower response variants
- normalizes invited-player records
- enforces turn-based mode while invitees exist
- synchronizes:
  - `invited_players`
  - `turn_based`
  - `turn_mode`
  - `multiplayer_enabled`
  - `invite_status`
- maps player IDs back to invited-player records
- supplies default Player Character imagery

### Portable View / UI-owned

- Story multiplayer presentation
- turn-based card
- invitee chips
- picker overlay
- presentation-local picker disclosure
- presentation-local search query
- selected-player styling
- empty and error presentation
- responsive layout and accessibility

The View does not inspect raw Story JSON fields, call hooks or APIs, or save a
Story.

## Preserved behavior

- invited players force turn-based mode
- removing the last invitee restores the stored turn setting
- invite state updates all five existing multiplayer fields
- only mutual followers appear in the picker
- picker search matches username, tagline, and description
- current future-facing invite copy remains unchanged

## Live caller

```text
components/studio/my-creations/CreationEditShell.jsx
```

## Preview

```text
/dev/ui-preview/room-template-multiplayer-section
```

The preview is development-only and uses local fixture state. It never loads
mutual followers or modifies a Story.
