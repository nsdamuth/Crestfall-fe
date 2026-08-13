export const STORY_CHAT_PAGE_CONTRACT_VERSION = "1.0.0";

/**
 * Page contract, wave C5 (docs/plans/FABLE-GATE-PLAN.md).
 *
 * app/studio/v2/stories/[id]/page.jsx is a Next.js async server
 * component that awaits the route params and hands the id to this
 * Binding Shell. The Binding Shell resolves a mock snapshot
 * (chatV2StoryMock.js, pending CR-043), wires the real chat-composer/
 * chat-transcript/chat-cast-panel/chat-state-panel/chat-session-dialogs
 * ViewModels against local page state, and composes the chat-shell
 * package. No live Story record, no API call, no persistence.
 *
 * @typedef {Object} StoryChatPageProps
 * @property {string} id The [id] route param.
 */

export {};
