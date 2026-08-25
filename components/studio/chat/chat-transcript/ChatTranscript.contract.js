export const CHAT_TRANSCRIPT_VIEW_CONTRACT_VERSION = "1.0.0";

export const CHAT_TRANSCRIPT_DEFAULT_VISIBLE_MESSAGES = 12;
export const CHAT_TRANSCRIPT_LOAD_EARLIER_BATCH_SIZE = 10;

/**
 * Portable View contract, wave C1 (docs/plans/FABLE-GATE-PLAN.md).
 *
 * A designed superset of the crestfall-main chat baseline
 * (story-room-transcript 1.1.0): each message item still carries direct
 * `chat-message` View-contract props (media re-slotting stays the
 * caller's job, same as the baseline), and the scroll law is upgraded
 * per the plan's improvement openings: auto-scroll suppresses once the
 * reader scrolls up, with a jump-to-latest pill; a 68ch reading measure
 * (`--measure`); bottom padding equal to the composer's own height
 * instead of a fixed guess.
 *
 * @typedef {Object} ChatTranscriptMessageItem
 * @property {string} id Stable render key for the transcript row.
 * @property {Object} message Direct ChatMessage View-contract props, including local message-action bindings.
 *
 * @typedef {Object} ChatTranscriptOpeningHeroImage
 * @property {string} displayUrl
 * @property {number|null} width
 * @property {number|null} height
 * @property {string} altText
 *
 * @typedef {Object} ChatTranscriptViewProps
 * @property {ChatTranscriptOpeningHeroImage|null} openingHeroImage
 * @property {ChatTranscriptMessageItem[]} messageItems
 * @property {boolean} loading
 * @property {boolean} sending
 * @property {boolean} summaryPending
 * @property {string} errorMessage
 * @property {number} composerHeightPx Bottom padding law: the transcript's own bottom padding equals the docked composer's rendered height, so the reading column never sits behind it.
 */
