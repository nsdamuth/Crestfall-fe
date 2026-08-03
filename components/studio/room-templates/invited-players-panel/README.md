# Invited Players Panel

## Public Shell

```text
components/studio/room-templates/InvitedPlayersPanel.jsx
```

The Shell preserves the existing public API used by the Story builder:

```jsx
<InvitedPlayersPanel
  invitedPlayers={invitedPlayers}
  onOpen={openPlayerPicker}
  onRemove={removeInvitedPlayer}
  mutualLoadError={mutualLoadError}
/>
```

## LOOM boundary

- `InvitedPlayersPanel.view.jsx` owns the visual hierarchy, empty and error states, invitee cards, and accessible action labels.
- `useInvitedPlayersPanelViewModel.js` converts application player records into display-ready invitees and adapts public callbacks into semantic View events.
- `InvitedPlayersPanel.contract.js` defines the stable View contract.
- `InvitedPlayersPanel.fixtures.js` provides direct contract-shaped isolated states.

The View does not know mutual-follower query results, picker state, Story package storage, invitation persistence, or turn-based enforcement.

## Development preview

```text
/dev/ui-preview/invited-players-panel
```

The preview is unavailable in production and keeps add/remove interactions in local state.

## Duplicate file warning

A separate same-named file currently exists at:

```text
components/studio/create/room-template/InvitedPlayersPanel.jsx
```

It is not imported by the active Story builder in the audited FE state. This conversion does not merge, modify, or delete it.
