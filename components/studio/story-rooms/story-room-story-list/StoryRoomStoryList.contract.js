export const STORY_ROOM_STORY_LIST_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Stable portable UI boundary for the story chat page's left rail, the
 * story list (ruling D4, fe/chat-studio item 1, 12 Sep 2026).
 *
 * 1.1.0, fe/chat-studio brief 4 item 3 (13 Sep 2026). ADDITIVE:
 * `newChat` ({ label, pendingLabel, pending, disabled, title,
 * errorMessage, onPress } | null) backs a "New chat" button the View
 * renders above New story. The chat shell owns it: a tap starts a new
 * chat from the current story's source creation through the launch
 * controller the Stories page uses and navigates to the new chat;
 * `disabled` with a "not available yet" title when the story resolves
 * to no source creation. Null hides the button (portable fixtures).
 *
 * The View renders a search field, a New story link, and the recent
 * stories list with the current story marked. It owns no data: the
 * ViewModel fetches the same list the Stories page reads
 * (GET /api/studio/story-rooms) through the existing client and projects
 * every row with the Stories page's own projector, so the title, the
 * last line, and the recency match that page.
 *
 * @typedef {Object} StoryRoomStoryListItem
 * @property {string} id
 * @property {string} roomId
 * @property {string} title
 * @property {string} lastLine The last message line, or an empty string.
 * @property {string} relativeDay "Just now", "3h ago", "2d ago", or a short date.
 * @property {string|null} imageSrc
 * @property {boolean} isCurrent Whether this row is the story the page shows.
 * @property {string} href The canonical story chat href for the row.
 *
 * @typedef {Object} StoryRoomStoryListViewProps
 * @property {StoryRoomStoryListItem[]} items Filtered and sorted newest activity first.
 * @property {string} query
 * @property {(nextValue: string) => void} onQueryChange
 * @property {string} newStoryHref
 * @property {{label: string, pendingLabel: string, pending: boolean, disabled: boolean, title: string, errorMessage: string, onPress: () => void}|null} newChat
 * @property {boolean} isLoading
 * @property {string} errorMessage Empty when the list loaded.
 * @property {(roomId: string) => void} onSelect
 * @property {import("react").ElementType} LinkComponent Injected by the Binding Shell (next/link); "a" when portable.
 */

export const STORY_ROOM_STORY_LIST_PORTABILITY_RULES = Object.freeze({
  ownsRouterNavigation: "Binding Shell",
  ownsListFetchAndFilter: "ViewModel",
  ownsRowMarkup: "Portable View",
});

export {};
