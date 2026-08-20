# Story Room → Chat C1–C6/C4 live binding

Status: **LIVE — W40**.

W40 makes the FE-owned C1–C5 chat packages the live presentation for `/studio/story-rooms/[id]` while preserving the existing Story Room application/runtime path.

## Authority

- Crestfall remains routing, API, services, runtime, persistence, transcript-export, share-review, share-persistence, and Engine authority.
- Crestfall-fe owns the C1–C5/C4 Views and this deployment binding.
- The existing `useStoryRoomChat` application mirror remains the live room-data/message/cast mutation boundary.

## Preserved current behavior

- semantic/legacy message rendering and AUTO_EVENT_MEDIA ordering;
- opening hero placement;
- copy/regenerate/continue/report message actions;
- `/help`, `/commands`, `/summary` behavior;
- Character/Narrator response selection and player yield;
- participant and Location mentions;
- Player Character selection;
- graph-authoritative NPC lifecycle including unavailable linked Characters;
- Random Liked Character loading;
- Runtime Mechanics panel;
- room deletion with the C3 Kit confirmation sheet instead of `window.confirm`;
- current World State projection.

## C4 live actions

`Chat State Panel` now exposes `Export Chat` and `Share Snapshot`. Their dialogs are the existing C4 `ChatSessionDialogs` package and the accepted `story_share_export_c4_binding_v1` projection.

Temporary and persistent reviewed share creation/revocation remain Chassis/backend operations. The old Story Room State Panel remains unchanged with its disabled legacy placeholders and is not the live Export/Share target.

## Deliberately not included

- `/studio/v2/**` route changes;
- new Scene Image generation behavior;
- Library Pass purchase behavior;
- streaming transport/Stop Generation;
- API/service/PostGraphile/DB logic moves.
