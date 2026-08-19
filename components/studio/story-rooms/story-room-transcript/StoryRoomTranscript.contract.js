export const STORY_ROOM_TRANSCRIPT_VIEW_CONTRACT_VERSION = "1.1.0";

/**
 * Portable View contract.
 *
 * @typedef {Object} StoryRoomTranscriptMessageItem
 * @property {string} id Stable render key for the transcript row.
 * @property {Object} message Direct StoryRoomMessage View-contract props.
 *
 * @typedef {Object} StoryRoomTranscriptViewProps
 * @property {{displayUrl:string,width:(number|null),height:(number|null),altText:string}|null} openingHeroImage
 * @property {StoryRoomTranscriptMessageItem[]} messageItems
 * @property {boolean} loading
 * @property {boolean} sending
 * @property {boolean} summaryPending
 * @property {string} errorMessage
 * @property {Object|null} reportDialog
 */
