export const STORY_CHAT_PAGE_CONTRACT_VERSION = "3.0.0";

/**
 * Canonical Story Chat route contract.
 *
 * `/studio/v2/stories/[id]` owns the user-facing Story Chat route and mounts
 * the established StoryRoomChatShell implementation directly. The historical
 * `/studio/story-rooms/[id]` route is a compatibility alias to this same
 * binding so existing bookmarks remain behaviorally identical.
 *
 * The former parallel V2 chat projection/view-model implementation was
 * retired. Story Chat functionality must continue to evolve in the existing
 * `components/studio/story-rooms/**` stack rather than through a second chat
 * implementation.
 *
 * @typedef {Object} StoryChatPageProps
 * @property {string} id The live Story Room id from the [id] route param.
 */

export {};
