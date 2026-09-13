# Story list LOOM package

The story chat page's left rail (ruling D4, fe/chat-studio item 1, 12 Sep 2026).

## Boundary

`components/studio/story-rooms/StoryRoomStoryList.jsx` is the Binding Shell. It owns only application integrations: the app router for row navigation and `next/link` for the New story link.

`useStoryRoomStoryListViewModel.js` owns:

- the list fetch through the existing `fetchStoryRooms()` client (the same `GET /api/studio/story-rooms` the Stories page reads through `getStoriesPageData`), on mount and whenever `refetchKey` changes
- row projection through `projectStoryRoomToContinueItem`, the Stories page's own projector, so title, last line, and recency match that page
- the relative day through `formatStudioNotificationRelativeTime`, the existing helper, never a new formatter
- the search query and client-side filtering by title and last line
- newest activity first ordering
- the loading, error, and empty states

`StoryRoomStoryList.view.jsx` is the portable View. It renders the search field (`KitSearchFieldView`), the New story link, the Recent heading, and one 56px row per story: art or the kit art placeholder at 40px, title at the ui step, last line at the label step, the relative day right-aligned, hover on `--step-above`, the current story on a gold left rule and `--fill-whisper`. Gold marks the selected row only.

## Placement

Mounted by the story chat shell in its left rail at md and up when the rail is open. Below md the list is not mounted; the page's mobile bar leads back to the Stories page.

## Not in this package

- creating a story (New story links to the Stories page, where a story begins)
- deleting, renaming, or reordering stories
- any fixture or preview route
