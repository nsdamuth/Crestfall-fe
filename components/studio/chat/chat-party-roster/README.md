# Chat Party Roster LOOM Package

**Contract:** `ChatPartyRoster.contract.js` (v1.0.0)

New package, build-0823 pass 2 (RULED 23 Aug 2026, the Party roster
ruling). Opened by `chat-cast-panel`'s `onOpenPartyRoster` when a
member row is double-clicked or an open slot is tapped.

## Boundary

```text
ChatPartyRoster.jsx
  -> useChatPartyRosterViewModel.js
  -> ChatPartyRoster.view.jsx
```

The View does not receive raw Character/NPC records or call an API;
search, filter, and sort run client-side in the ViewModel over a
caller-supplied candidate list (fixture-driven at this wave, CR-042's
client-side scope). Selection reports through semantic callbacks
(`onAddMember`, `onRemoveMember`); the page ViewModel applies them to
mock party-membership state, capping at 5.

## Responsive behavior, a deviation logged

Uses `KitModalFrame variant="modal"`, not `variant="sheet"`: the
modal variant is already the ruled responsive frame (centered at
700px and up, capped `panelClassName="max-w-[560px]"`; bottom-
anchored under 700px), matching the desktop 560px glass panel and the
mobile bottom-sheet requirement from one component. The trade: the
sheet-only grabber (`KitModalFrame`'s `sheetGrabber` prop, added this
same pass) does not apply to the modal variant, so this surface has
no grabber at any width. Logged as a deviation in the pass 2 session
report; the frame's circle-x close control is present at every width
regardless.

## Fixtures

`ChatPartyRoster.fixtures.js`: default (open slots remain), empty
results, full party (adds disabled, "Party full" word beside the
control), loading, error, longest content, and a mobile-labeled
fixture (same props; the modal variant's own responsive behavior
carries the width change).

## Package assets

- `ChatPartyRoster.contract.js`
- `ChatPartyRoster.fixtures.js`
- `useChatPartyRosterViewModel.js`
- `/dev/ui-preview/chat-party-roster`
