# Story details rail LOOM package

The story chat page's right rail at md and up, and the content of the right sheet below md (fe/chat-studio item 6, 12 Sep 2026).

## Boundary

`components/studio/story-rooms/StoryRoomDetailsRail.jsx` is the Binding Shell. It composes the application-owned panels into the rail's slots: the state panel's live Export and Share actions, the state panel's World state sections, the cast panel (roster and Manage Cast), the runtime mechanics panel under its existing gate, and the chat color list the chat shell view model owns. It injects `next/link`.

`useStoryRoomDetailsRailViewModel.js` owns:

- the story's media set, interim until CR-069 serves a list: the featured speaker image, every cast member's media images and avatar, every scene image in the transcript, deduplicated by url
- the gallery index and the full-screen viewer index
- the drill-in state (`activeDetail`) and the back action
- the three-dot menu (Delete story, through the chat shell's confirm)
- the description clamp toggle
- the title, the rating and visibility chips, the byline and description (both hidden until CR-067 and CR-068)

`StoryRoomDetailsRail.view.jsx` is the portable View: gallery (4:5 featured image, previous and next circles over the art, thumbnail strip, tap opens `StoryRoomGalleryViewer`), title row with the three-dot menu on the shared menu recipe, chips, byline, description with See more, the actions slot, then five 44px drill-in rows with chevrons. A drill-in replaces the rail content in place under a 44px back row. `ChatColorPreferences` is the Preferences panel: the 13 palette combos as 44px rows with a swatch, the creator default marked, gold only on the selected row.

`StoryRoomGalleryViewer.jsx` is the lean viewer (decision D1): `KitModalFrame variant="viewer"` plus the shared `ImageFrame` (gold hairline, zoom and pan, pinch), previous and next, the frame's own close.

## Placement

Mounted by the chat shell in its right rail (320px, open by default at md and up) and inside the right sheet below md, opened from the mobile bar's settings and media buttons.

## Not in this package

- delete confirmation (the chat shell's `StoryChatDialog`)
- export and share dialogs (the state panel binding's `ChatSessionDialogs`)
- any fixture route or preview
