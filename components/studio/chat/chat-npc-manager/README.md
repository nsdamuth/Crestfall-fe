# Chat NPC Manager LOOM Package

**Contract:** `ChatNpcManager.contract.js` (v1.1.0)

Wave C3, `docs/plans/FABLE-GATE-PLAN.md`. New build; the legacy
`components/studio/story-rooms/story-room-npc-participant-manager`
tree is a stale pre-upgrade fork of this repo and is read-only
reference, never edited or imported from here. The behavioral
baseline this package is a designed superset of is
`crestfall-main/Crestfall`'s `story-room-npc-participant-manager`
package, contract 1.0.0.

## Boundary

```text
ChatNpcManager.jsx
  -> useChatNpcManagerViewModel.js
  -> ChatNpcManager.view.jsx
```

The View does not know the registry lifecycle response shape,
registry or participant identifiers, action-key construction, or
load/unload API ownership; it receives only display-ready sections and
emits opaque semantic action intent (`onActivateNpc(actionId)`).
Disclosure (`isOpen`) is presentation-only local state, seeded by
`initialOpen` for isolated preview.

## The four-section registry NPC lifecycle

Loaded (Unload), Narrative Targets (Load Now), Available (Load),
Previously Loaded (Reload), each with its own empty message and
action-icon key (`CHAT_NPC_MANAGER_ACTION_ICON_KEYS`). Every entry
carries an optional `statusLabel` (a canvas tag bed pill, e.g.
"Arriving"), `statusDetail`, and `pendingReason`, matching the
crestfall-main inventory's notices.

## Composition

`chat-cast-panel` composes this package's View directly (same
View-level composition as the crestfall-main baseline): the cast
panel's `npcParticipantManager` prop is a full, already contract-shaped
`ChatNpcManagerViewProps` object, rendered with
`<ChatNpcManagerView {...npcParticipantManager} />`. This package's
own ViewModel is not invoked by the cast panel; it exists for this
package's own Shell and preview route.

## Fixtures

`ChatNpcManager.fixtures.js`: closed, open with all four sections
populated, open with all four sections empty, loading, no-registry
notice, error, one entry busy, and a longest-content case (long names,
titles, registry titles, and pending reasons across every section).

## Package assets

- `ChatNpcManager.contract.js`
- `ChatNpcManager.fixtures.js`
- `useChatNpcManagerViewModel.js`
- `/dev/ui-preview/chat-npc-manager`


## W40 linked-Character recovery

The live Story Room binding may supply an `unavailable` informational section for graph-authoritative linked Character references that cannot currently resolve. These rows have `hasAction: false`; the View preserves their identity/status text without rendering a fake Load action.
