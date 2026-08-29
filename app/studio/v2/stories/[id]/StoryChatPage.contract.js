export const STORY_CHAT_PAGE_CONTRACT_VERSION = "2.0.0";

/**
 * V2 live Story Chat page contract.
 *
 * app/studio/v2/stories/[id]/page.jsx hands the room id to the V2 Binding
 * Shell. The shell reuses the application-owned Story Room runtime hook and
 * projects its room/messages/cast/state into the portable V2 Chat packages.
 * No V1 Story Room View is mounted and no mock send loop is used.
 *
 * @typedef {Object} StoryChatPageProps
 * @property {string} id The live Story Room id from the [id] route param.
 */

export {};
