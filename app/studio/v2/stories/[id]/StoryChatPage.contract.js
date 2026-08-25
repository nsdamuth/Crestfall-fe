export const STORY_CHAT_PAGE_CONTRACT_VERSION = "1.1.0";

/**
 * Page contract, wave C5 (docs/plans/FABLE-GATE-PLAN.md).
 *
 * app/studio/v2/stories/[id]/page.jsx is a Next.js async server
 * component that awaits the route params and hands the id to this
 * Binding Shell. The Binding Shell resolves a mock snapshot
 * (chatV2StoryMock.js, pending CR-043), wires the real chat-composer/
 * chat-transcript/chat-cast-panel/chat-state-panel/chat-session-dialogs/
 * chat-party-roster ViewModels against local page state, and composes
 * the chat-shell package plus the shared FixtureActionNotice stub for
 * the scene-image picker. No live Story record, no API call, no
 * persistence.
 *
 * 1.1.0, 23 Aug 2026 (build-0823 pass 2): additive wiring only, no
 * change to this page's own `{ id }` prop boundary. Party roster
 * open/close and mock membership state, the scene-image picker stub,
 * and the coinChip fix (was passing coinBalanceLabel to a prop
 * chat-shell never read) all land here.
 *
 * @typedef {Object} StoryChatPageProps
 * @property {string} id The [id] route param.
 */

export {};
