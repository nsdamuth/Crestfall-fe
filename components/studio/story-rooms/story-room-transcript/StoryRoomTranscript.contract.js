export const STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Portable View contract.
 *
 * @typedef {Object} StoryRoomTranscriptMessageItem
 * @property {string} id Stable render key for the transcript row.
 * @property {Object} message Direct StoryRoomMessage View-contract props.
 *
 * @typedef {Object} StoryRoomTranscriptViewProps
 * @property {StoryRoomTranscriptMessageItem[]} messageItems
 * @property {boolean} loading
 * @property {boolean} sending
 * @property {string} errorMessage
 * @property {Object|null} playerCharacterPrompt transient pre-first-message
 *   system prompt with select/change action; never persisted into room messages
 * @property {Object|null} reportDialog transient report reason/comment dialog
 *   projected from the Story Room message-action runtime
 */
