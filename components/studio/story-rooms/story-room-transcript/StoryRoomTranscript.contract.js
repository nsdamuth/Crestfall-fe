export const STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION = "1.2.0";

/**
 * Portable View contract.
 *
 * 1.2.0, fe/chat-studio review round 4 item 3 (13 Sep 2026, Brian's
 * browser review, RULED). Presentation only, no prop changed: the
 * notice cards' body copy (the player character prompt, the story
 * error card) reads at the transcript's chat tier, --text-chat over
 * --lh-chat, down from the body step, and their action button reads
 * at the same size with tighter side padding through .cf-btn--notice
 * (replacing .cf-btn--field), height still the 44px touch floor.
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
