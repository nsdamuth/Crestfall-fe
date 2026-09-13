# Story details rail LOOM package

The story chat page's right rail at md and up, and the content of the right sheet below md (fe/chat-studio item 6, 12 Sep 2026).

## Boundary

`components/studio/story-rooms/StoryRoomDetailsRail.jsx` is the Binding Shell. It composes the application-owned panels into the rail's slots: the state panel's live Export and Share actions, the state panel's World state sections, the cast panel (roster and Manage Cast), the runtime mechanics panel under its existing gate, and the chat color list the chat shell view model owns. It injects `next/link`.

`useStoryRoomDetailsRailViewModel.js` owns:

- the story's media set, interim until CR-069 serves a list: the featured speaker image, every cast member's media images and avatar, every scene image in the transcript, deduplicated by url; when the snapshot serves none (every private character chat today, see the CR-069 finding), the catalogue creation's own featured media from its preview (`fetchCreationPreview`, the same served images the community story slider shows); at most four images (review round 4 item 4)
- the gallery index and the full-screen viewer index
- the drill-in state (`activeDetail`) and the back action
- the three-dot menu (Delete story, through the chat shell's confirm)
- the description clamp toggle
- the title, the rating and visibility chips, the byline (hidden until CR-067), and the description (brief 4 item 2, widened by review round 5 item 2: the catalogue creation's description from its preview through `fetchCreationPreview`, GET `/api/creations/{id}/preview`, the template when the story launched from one, else the Character's own; hidden only when the story resolves to no creation; CR-068 stays filed for the served field), clamped to three lines with See more

`StoryRoomDetailsRail.view.jsx` is the portable View: gallery (brief 4 item 1, review round 4 item 4: one 4:5 bed at every state, `--canvas` (the community slider's art surface, the darkest brown, so the corners and margin read against the `--surface-2` rail) with `--radius-md` corners and `--space-3` margin each side; with no media the circular geometric Crestfall mark from `StoryRoomMark.jsx` centered on the bed; with media (at most four) the image edge to edge inside the rounding, previous and next as 44px circles over the art (review round 5 item 1: no previous on the first slide, only the back arrow on the end card, paging never wraps), an "n/total" counter chip centered at the bottom on the tag-over-art recipe, tap opens the community image viewer through `viewerSlot`; and when the story resolves to a creation page one extra stop after the last image, an end card on the asset detail popup's "Want to see more" recipe with its backdrop blurred (`--blur-panel`) whose View catalogue link opens that page in a new tab; the brief 3 thumbnail strip is retired), title row with the three-dot menu on the shared menu recipe, chips, byline, description with See more, the actions slot, then five 44px drill-in rows with chevrons. A drill-in replaces the rail content in place under a 44px back row. `ChatColorPreferences` is the Preferences panel: the 13 palette combos as 44px rows with a swatch, the creator default marked, gold only on the selected row.

The viewer (review round 5 item 1, replacing the lean `StoryRoomGalleryViewer`) is the community image viewer, `components/kit/KitImageViewer`, mounted by the Binding Shell as `viewerSlot` while `gallery.viewerItem` is set: Details opens the creation's page in a new tab, Share copies that page's link, Edit and Remix ship "soon" (CR-065), Download hidden; Save and Report have no story-side handler (the viewer contract cannot hide them, logged).

## Placement

Mounted by the chat shell in its right rail (320px, open by default at md and up) and inside the right sheet below md, opened from the mobile bar's settings and media buttons. The rail column paints the surface (`--surface-2`, one step above the primary sidebar, brief 2 item 6) and the sheet paints its own; the View carries no surface, so its tap controls rise from whichever container holds it.

## Not in this package

- delete confirmation (the chat shell's `StoryChatDialog`)
- export and share dialogs (the state panel binding's `ChatSessionDialogs`)
- any fixture route or preview
